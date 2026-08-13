import { useEffect, useRef } from "react";
import { FlaskConical } from "lucide-react";
import { LabValues } from "./LabValues";
import { useExamUI } from "./ExamUIProvider";

/** Keep the source lab dataset intact while replacing its legacy toolbar trigger. */
export const CoordinatedLabValues = () => {
  const legacyWrapperRef = useRef<HTMLDivElement>(null);
  const visibleTriggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const { activePopup, openPopup, closePopup } = useExamUI();
  const open = activePopup === "lab";

  const getLegacyTrigger = () => legacyWrapperRef.current?.querySelector<HTMLButtonElement>("button.classic-tool-trigger");

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
      <div ref={legacyWrapperRef} className="source-legacy-lab-trigger" aria-hidden="true">
        <LabValues />
      </div>
    </>
  );
};
