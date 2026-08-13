import { MouseEvent, useEffect, useRef } from "react";
import { LabValues } from "./LabValues";
import { useExamUI } from "./ExamUIProvider";

/**
 * LabValues contains the source reference table data and still owns its rendered
 * exhibit state. This bridge keeps that legacy component synchronized with the
 * single exam UI coordinator without duplicating the laboratory dataset.
 */
export const CoordinatedLabValues = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const { activePopup, openPopup, closePopup } = useExamUI();

  const getTrigger = () => wrapperRef.current?.querySelector<HTMLButtonElement>("button.classic-tool-trigger");

  useEffect(() => {
    const trigger = getTrigger();
    if (!trigger) return;

    const syncFromLegacyTrigger = () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen && activePopup !== "lab") openPopup("lab");
      if (!isOpen && activePopup === "lab") closePopup("lab");

      if (wasOpenRef.current && !isOpen) trigger.focus();
      wasOpenRef.current = isOpen;
    };

    syncFromLegacyTrigger();
    const observer = new MutationObserver(syncFromLegacyTrigger);
    observer.observe(trigger, { attributes: true, attributeFilter: ["aria-expanded"] });
    return () => observer.disconnect();
  }, [activePopup]);

  useEffect(() => {
    const trigger = getTrigger();
    if (!trigger) return;
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    if (activePopup !== "lab" && isOpen) trigger.click();
  }, [activePopup]);

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const trigger = (event.target as HTMLElement).closest<HTMLButtonElement>("button.classic-tool-trigger");
    if (!trigger || !wrapperRef.current?.contains(trigger)) return;

    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    if (isOpen) closePopup("lab");
    else openPopup("lab");
  };

  return (
    <div ref={wrapperRef} className="classic-lab-coordinator" onClickCapture={onClickCapture}>
      <LabValues />
    </div>
  );
};
