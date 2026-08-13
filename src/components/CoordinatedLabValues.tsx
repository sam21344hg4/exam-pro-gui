import { MouseEvent, useEffect, useRef } from "react";
import { LabValues } from "./LabValues";
import { useExamUI } from "./ExamUIProvider";

/**
 * LabValues contains the source reference table data and its own internal open state.
 * This bridge makes that legacy component participate in the single exam UI state
 * without duplicating the laboratory-value dataset.
 */
export const CoordinatedLabValues = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { activePopup, openPopup, closePopup } = useExamUI();

  const getTrigger = () => wrapperRef.current?.querySelector<HTMLButtonElement>("button.classic-tool-trigger");

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
