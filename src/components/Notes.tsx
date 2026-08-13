import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StickyNote, X } from "lucide-react";
import { useExamUI } from "./ExamUIProvider";

interface NotesProps {
  itemId?: number;
  notes: string;
  onNotesChange: ((itemId: number, notes: string) => void) | ((notes: string) => void);
}

export const Notes = ({ itemId, notes, onNotesChange }: NotesProps) => {
  const { activePopup, openPopup, closePopup } = useExamUI();
  const open = activePopup === "notes";
  const resolvedItemId = itemId ?? 0;
  const [draft, setDraft] = useState(notes);
  const draftRef = useRef(notes);
  const openItemRef = useRef(resolvedItemId);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const commitNote = (targetItem: number, value: string) => {
    if (itemId === undefined) {
      (onNotesChange as (notes: string) => void)(value);
    } else {
      (onNotesChange as (itemId: number, notes: string) => void)(targetItem, value);
    }
  };

  useEffect(() => { draftRef.current = draft; }, [draft]);

  useEffect(() => {
    if (!open) {
      openItemRef.current = resolvedItemId;
      setDraft(notes);
      draftRef.current = notes;
      return;
    }

    if (openItemRef.current !== resolvedItemId) {
      const previousDraft = draftRef.current;
      commitNote(openItemRef.current, previousDraft.trim() ? previousDraft : "");
      openItemRef.current = resolvedItemId;
      setDraft(notes);
      draftRef.current = notes;
    }
  }, [resolvedItemId, notes, open]);

  useEffect(() => {
    if (wasOpenRef.current && !open) triggerRef.current?.focus();
    wasOpenRef.current = open;
  }, [open]);

  const persistDraft = () => {
    const value = draftRef.current;
    commitNote(openItemRef.current, value.trim() ? value : "");
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      persistDraft();
      closePopup("notes");
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  const openPanel = () => {
    openItemRef.current = resolvedItemId;
    setDraft(notes);
    draftRef.current = notes;
    openPopup("notes");
  };

  const saveAndClose = () => {
    persistDraft();
    closePopup("notes");
  };

  const deleteNote = () => {
    setDraft("");
    draftRef.current = "";
    commitNote(openItemRef.current, "");
    closePopup("notes");
  };

  const panel = open
    ? createPortal(
        <div className="nbme-notes-panel" role="dialog" aria-label="Notepad" aria-modal="false">
          <div className="nbme-notes-handle">
            <h2 className="classic-visually-hidden">Notepad</h2>
            <button type="button" className="nbme-notes-close" aria-label="Close" title="Close" onClick={saveAndClose}>
              <X aria-hidden="true" />
            </button>
          </div>
          <textarea
            rows={4}
            cols={150}
            wrap="hard"
            maxLength={700}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoFocus
            aria-label="Notes"
          />
          <div className="nbme-notes-actions">
            <button type="button" onClick={saveAndClose}>Save and Close</button>
            <button type="button" onClick={deleteNote}>Delete Note</button>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button ref={triggerRef} type="button" className="classic-tool-trigger" title="Notes" aria-expanded={open} onClick={() => (open ? saveAndClose() : openPanel())}>
        <span className="classic-tool-square-icon"><StickyNote size={23} strokeWidth={2.1} /></span>
        <span>Notes</span>
      </button>
      {panel}
    </>
  );
};
