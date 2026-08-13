import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { StickyNote } from "lucide-react";

interface NotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const Notes = ({ notes, onNotesChange }: NotesProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(notes);

  useEffect(() => {
    if (!open) setDraft(notes);
  }, [notes, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const openPanel = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    setDraft(notes);
    setOpen(true);
  };

  const saveAndClose = () => {
    onNotesChange(draft);
    setOpen(false);
  };

  const deleteNotes = () => {
    setDraft("");
    onNotesChange("");
    setOpen(false);
  };

  const panel = open
    ? createPortal(
        <div className="nbme-notes-panel" role="dialog" aria-label="Notes">
          <textarea
            rows={7}
            cols={42}
            wrap="hard"
            maxLength={1500}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoFocus
            aria-label="Question notes"
          />
          <div className="nbme-notes-actions">
            <button type="button" onClick={saveAndClose}>Save and Close</button>
            <button type="button" onClick={deleteNotes}>Delete Notes</button>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        className="classic-tool-trigger"
        title="Notes"
        aria-expanded={open}
        onClick={() => (open ? saveAndClose() : openPanel())}
      >
        <span className="classic-tool-square-icon"><StickyNote size={23} strokeWidth={2.1} /></span>
        <span>Notes</span>
      </button>
      {panel}
    </>
  );
};
