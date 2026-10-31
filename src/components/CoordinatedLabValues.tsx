import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FlaskConical } from "lucide-react";
import { LabValues } from "./LabValues";
import { useExamUI } from "./ExamUIProvider";

const MIN_LAB_PANE = 100;
const STATUS_RAIL_WIDTH = 105;

const waitForPaint = () => new Promise<void>((resolve) => {
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
});

const clearSearchMarks = (root: ParentNode | null) => {
  if (!root) return;
  root.querySelectorAll<HTMLElement>("mark[data-source-lab-mark]").forEach((mark) => {
    const parent = mark.parentNode;
    mark.replaceWith(document.createTextNode(mark.textContent || ""));
    parent?.normalize();
  });
};

const markMatches = (root: ParentNode | null, query: string) => {
  if (!root || !query.trim()) return false;
  const needle = query.trim().toLocaleLowerCase();
  let found = false;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("mark[data-source-lab-mark]") || parent.closest("script,style")) return NodeFilter.FILTER_REJECT;
      return (node.textContent || "").toLocaleLowerCase().includes(needle) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  nodes.forEach((node) => {
    const text = node.data;
    const lower = text.toLocaleLowerCase();
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let index = lower.indexOf(needle, cursor);
    while (index >= 0) {
      found = true;
      if (index > cursor) fragment.append(document.createTextNode(text.slice(cursor, index)));
      const mark = document.createElement("mark");
      mark.dataset.sourceLabMark = "true";
      mark.textContent = text.slice(index, index + needle.length);
      fragment.append(mark);
      cursor = index + needle.length;
      index = lower.indexOf(needle, cursor);
    }
    if (cursor < text.length) fragment.append(document.createTextNode(text.slice(cursor)));
    node.replaceWith(fragment);
  });

  return found;
};

/** Keep the source lab dataset intact while reproducing StartTest exhibit behavior around it. */
export const CoordinatedLabValues = () => {
  const legacyWrapperRef = useRef<HTMLDivElement>(null);
  const visibleTriggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const matchTabsRef = useRef<Set<number>>(new Set());
  const searchRef = useRef("");
  const scanTokenRef = useRef(0);
  const scanningRef = useRef(false);
  const { activePopup, openPopup, closePopup } = useExamUI();
  const open = activePopup === "lab";

  const getLegacyTrigger = () => legacyWrapperRef.current?.querySelector<HTMLButtonElement>("button.classic-tool-trigger");

  const applySplitterPosition = (pointerX?: number) => {
    const available = Math.max(window.innerWidth - STATUS_RAIL_WIDTH, MIN_LAB_PANE * 2);
    const rawWidth = pointerX === undefined ? available / 2 : window.innerWidth - pointerX;
    const width = Math.min(Math.max(rawWidth, MIN_LAB_PANE), available - MIN_LAB_PANE);
    document.documentElement.style.setProperty("--source-lab-width", `${Math.round(width)}px`);
  };

  useEffect(() => {
    const legacyTrigger = getLegacyTrigger();
    if (!legacyTrigger) return;

    const observer = new MutationObserver(() => {
      const legacyOpen = legacyTrigger.getAttribute("aria-expanded") === "true";
      if (!legacyOpen && activePopup === "lab") closePopup("lab");
      if (wasOpenRef.current && !legacyOpen) visibleTriggerRef.current?.focus();
      wasOpenRef.current = legacyOpen;
    });

    wasOpenRef.current = legacyTrigger.getAttribute("aria-expanded") === "true";
    observer.observe(legacyTrigger, { attributes: true, attributeFilter: ["aria-expanded"] });
    return () => observer.disconnect();
  }, [activePopup]);

  useEffect(() => {
    const legacyTrigger = getLegacyTrigger();
    if (!legacyTrigger) return;
    const legacyOpen = legacyTrigger.getAttribute("aria-expanded") === "true";

    if (open && !legacyOpen) legacyTrigger.click();
    if (!open && legacyOpen) legacyTrigger.click();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    applySplitterPosition();

    let disposed = false;
    let detach = () => {};

    const setupPanel = () => {
      if (disposed) return;
      const panel = document.querySelector<HTMLElement>(".source-lab-panel");
      const input = document.querySelector<HTMLInputElement>("#source-lab-search");
      if (!panel || !input) {
        window.requestAnimationFrame(setupPanel);
        return;
      }

      const applyIndicators = () => {
        const tabs = Array.from(document.querySelectorAll<HTMLElement>(".source-lab-tabs li"));
        tabs.forEach((tab, index) => tab.classList.toggle("searched", matchTabsRef.current.has(index)));
      };

      const applyCurrentHighlight = () => {
        const table = document.querySelector<HTMLElement>(".source-lab-table");
        clearSearchMarks(table);
        if (searchRef.current) markMatches(table, searchRef.current);
        applyIndicators();
      };

      const scanTabs = async (value: string) => {
        const token = ++scanTokenRef.current;
        searchRef.current = value.trim();
        matchTabsRef.current = new Set();
        const currentTable = document.querySelector<HTMLElement>(".source-lab-table");
        clearSearchMarks(currentTable);

        if (!searchRef.current) {
          applyIndicators();
          return;
        }

        scanningRef.current = true;
        panel.classList.add("is-search-scanning");
        const initialTabs = Array.from(document.querySelectorAll<HTMLElement>(".source-lab-tabs li"));
        const originalIndex = Math.max(0, initialTabs.findIndex((tab) => tab.classList.contains("active")));
        const matches = new Set<number>();

        try {
          for (let index = 0; index < initialTabs.length; index += 1) {
            if (disposed || token !== scanTokenRef.current) return;
            const tabs = Array.from(document.querySelectorAll<HTMLElement>(".source-lab-tabs li"));
            tabs[index]?.click();
            await waitForPaint();
            if (disposed || token !== scanTokenRef.current) return;
            const table = document.querySelector<HTMLElement>(".source-lab-table");
            clearSearchMarks(table);
            if (markMatches(table, searchRef.current)) matches.add(index);
          }

          const tabs = Array.from(document.querySelectorAll<HTMLElement>(".source-lab-tabs li"));
          tabs[originalIndex]?.click();
          await waitForPaint();
          if (disposed || token !== scanTokenRef.current) return;
          matchTabsRef.current = matches;
          applyCurrentHighlight();
        } finally {
          scanningRef.current = false;
          panel.classList.remove("is-search-scanning");
        }
      };

      const onInput = () => {
        const value = input.value;
        window.setTimeout(() => { void scanTabs(value); }, 0);
      };

      const onTabClick = () => {
        if (scanningRef.current) return;
        window.setTimeout(applyCurrentHighlight, 0);
      };

      input.addEventListener("input", onInput);
      panel.querySelector(".source-lab-tabs")?.addEventListener("click", onTabClick);
      detach = () => {
        input.removeEventListener("input", onInput);
        panel.querySelector(".source-lab-tabs")?.removeEventListener("click", onTabClick);
        clearSearchMarks(panel);
        panel.classList.remove("is-search-scanning");
      };
    };

    setupPanel();
    return () => {
      disposed = true;
      scanTokenRef.current += 1;
      scanningRef.current = false;
      detach();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => applySplitterPosition();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const onSplitterPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    applySplitterPosition(event.clientX);
  };

  const onSplitterPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    applySplitterPosition(event.clientX);
  };

  const onSplitterPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const toggle = () => {
    if (open) closePopup("lab");
    else openPopup("lab");
  };

  return (
    <>
      <button ref={visibleTriggerRef} type="button" className="classic-tool-trigger" title="Lab Values" aria-expanded={open} onClick={toggle}>
        <span className="classic-tool-square-icon"><FlaskConical size={23} strokeWidth={2.1} /></span>
        <span>Lab Values</span>
      </button>
      <div ref={legacyWrapperRef} className="source-legacy-lab-trigger" aria-hidden="true"><LabValues /></div>
      {open ? createPortal(
        <div
          className="source-lab-splitter"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize Lab Values"
          onPointerDown={onSplitterPointerDown}
          onPointerMove={onSplitterPointerMove}
          onPointerUp={onSplitterPointerUp}
          onPointerCancel={onSplitterPointerUp}
        />,
        document.body
      ) : null}
    </>
  );
};
