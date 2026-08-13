import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";

export type ExamPopup =
  | "lab"
  | "notes"
  | "settings"
  | "help"
  | "timer"
  | "overview"
  | "end"
  | "zoom"
  | "lockWarning"
  | "unauthorizedBreak"
  | "reducedTime"
  | null;

interface ExamUIContextValue {
  activePopup: ExamPopup;
  calculatorOpen: boolean;
  showStrikeout: boolean;
  textZoom: 100 | 125 | 150 | 200;
  darkTheme: boolean;
  isBlockingModal: boolean;
  openPopup: (popup: Exclude<ExamPopup, null>) => void;
  closePopup: (popup?: Exclude<ExamPopup, null>) => void;
  togglePopup: (popup: Exclude<ExamPopup, null>) => void;
  dismissAllTools: () => void;
  openCalculator: () => void;
  closeCalculator: () => void;
  toggleCalculator: () => void;
  setShowStrikeout: (show: boolean) => void;
  setTextZoom: (zoom: 100 | 125 | 150 | 200) => void;
  setDarkTheme: (dark: boolean) => void;
}

const ExamUIContext = createContext<ExamUIContextValue | null>(null);

const focusIsWithin = (selectors: string) => {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return false;
  return selectors.split(",").some((selector) => {
    const element = document.querySelector(selector.trim());
    return element instanceof HTMLElement && (element === active || element.contains(active));
  });
};

export const ExamUIProvider = ({ children }: { children: ReactNode }) => {
  const [activePopup, setActivePopup] = useState<ExamPopup>(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [suspendedPopup, setSuspendedPopup] = useState<ExamPopup>(null);
  const [showStrikeout, setShowStrikeout] = useState(true);
  const [textZoom, setTextZoom] = useState<100 | 125 | 150 | 200>(100);
  const [darkTheme, setDarkTheme] = useState(false);
  const zoomBeforeMediaRef = useRef<100 | 125 | 150 | 200>(100);

  const isBlockingModal = activePopup === "help" || activePopup === "end" || activePopup === "lockWarning" || activePopup === "unauthorizedBreak" || activePopup === "reducedTime";

  useEffect(() => {
    document.body.classList.toggle("classic-show-strikeout", showStrikeout);
    return () => document.body.classList.remove("classic-show-strikeout");
  }, [showStrikeout]);

  useEffect(() => {
    document.documentElement.classList.toggle("classic-dark-theme", darkTheme);
    return () => document.documentElement.classList.remove("classic-dark-theme");
  }, [darkTheme]);

  useEffect(() => {
    document.documentElement.dataset.examTextZoom = String(textZoom);
    document.documentElement.classList.remove("zoom100", "zoom125", "zoom150", "zoom200");
    document.documentElement.classList.add(`zoom${textZoom}`);
    return () => {
      delete document.documentElement.dataset.examTextZoom;
      document.documentElement.classList.remove("zoom100", "zoom125", "zoom150", "zoom200");
    };
  }, [textZoom]);

  useEffect(() => {
    const shouldDisable = activePopup === "zoom";
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".classic-exam-header,.classic-bottom-bar"));
    targets.forEach((target) => {
      if (shouldDisable) {
        target.setAttribute("inert", "");
        target.setAttribute("aria-hidden", "true");
      } else {
        target.removeAttribute("inert");
        target.removeAttribute("aria-hidden");
      }
    });
    return () => {
      targets.forEach((target) => {
        target.removeAttribute("inert");
        target.removeAttribute("aria-hidden");
      });
    };
  }, [activePopup]);

  const openPopup = (popup: Exclude<ExamPopup, null>) => {
    if (popup === "zoom") {
      zoomBeforeMediaRef.current = textZoom;
      setTextZoom(100);
      setSuspendedPopup(activePopup === "lab" ? "lab" : null);
      setActivePopup("zoom");
      setCalculatorOpen(false);
      return;
    }

    setSuspendedPopup(null);
    setActivePopup(popup);
    if (popup !== "notes") setCalculatorOpen(false);
  };

  const closePopup = (popup?: Exclude<ExamPopup, null>) => {
    setActivePopup((current) => {
      if (popup && current !== popup) return current;
      if (current === "zoom") {
        setTextZoom(zoomBeforeMediaRef.current);
        if (suspendedPopup === "lab") {
          setSuspendedPopup(null);
          return "lab";
        }
      }
      setSuspendedPopup(null);
      return null;
    });
  };

  const dismissAllTools = () => {
    if (activePopup === "zoom") setTextZoom(zoomBeforeMediaRef.current);
    setSuspendedPopup(null);
    setActivePopup(null);
    setCalculatorOpen(false);
  };

  const togglePopup = (popup: Exclude<ExamPopup, null>) => {
    if (activePopup === popup) closePopup(popup);
    else openPopup(popup);
  };

  const openCalculator = () => {
    if (activePopup !== "notes") setActivePopup(null);
    setSuspendedPopup(null);
    setCalculatorOpen(true);
  };

  const closeCalculator = () => setCalculatorOpen(false);

  const toggleCalculator = () => {
    if (calculatorOpen) closeCalculator();
    else openCalculator();
  };

  useEffect(() => {
    if (activePopup !== "settings") return;

    const menu = document.querySelector<HTMLElement>(".source-settings-menu");
    if (menu) menu.style.setProperty("right", "132px", "important");

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (document.querySelector(".classic-settings-wrap")?.contains(target)) return;
      closePopup("settings");
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      menu?.style.removeProperty("right");
    };
  }, [activePopup]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activePopup === "notes" || activePopup === "unauthorizedBreak" || activePopup === "reducedTime") return;

      const blocking = activePopup === "help" || activePopup === "end" || activePopup === "lockWarning";
      const focusSelectors: Partial<Record<Exclude<ExamPopup, null>, string>> = {
        settings: ".source-settings-menu,.classic-header-settings",
        timer: ".source-timer-panel,.source-timer-trigger",
        overview: ".source-overview-panel,.source-item-info-trigger",
        lab: ".source-lab-panel,[title='Lab Values']",
        zoom: ".source-image-viewer",
      };

      if (activePopup) {
        const selectors = focusSelectors[activePopup];
        if (!blocking && selectors && !focusIsWithin(selectors)) return;
        event.preventDefault();
        closePopup(activePopup);
        return;
      }

      if (calculatorOpen && focusIsWithin(".nbme-calculator-panel,[title='Calculator']")) {
        event.preventDefault();
        setCalculatorOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePopup, calculatorOpen, suspendedPopup]);

  const value = useMemo<ExamUIContextValue>(() => ({
    activePopup,
    calculatorOpen,
    showStrikeout,
    textZoom,
    darkTheme,
    isBlockingModal,
    openPopup,
    closePopup,
    togglePopup,
    dismissAllTools,
    openCalculator,
    closeCalculator,
    toggleCalculator,
    setShowStrikeout,
    setTextZoom,
    setDarkTheme,
  }), [activePopup, calculatorOpen, showStrikeout, textZoom, darkTheme, isBlockingModal, suspendedPopup]);

  return <ExamUIContext.Provider value={value}>{children}</ExamUIContext.Provider>;
};

export const useExamUI = () => {
  const context = useContext(ExamUIContext);
  if (!context) throw new Error("useExamUI must be used inside ExamUIProvider");
  return context;
};
