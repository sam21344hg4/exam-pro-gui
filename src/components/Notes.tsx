import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote } from "lucide-react";

interface NotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const Notes = ({ notes, onNotesChange }: NotesProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs relative">
          <StickyNote className="h-4 w-4" />
          <span className="hidden sm:inline">Notes</span>
          {notes.length > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-warning" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Scratch Pad</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Use this space for notes and calculations. Notes are saved during your exam session.
          </p>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Type your notes here..."
            className="min-h-[300px] font-mono text-sm resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{notes.length} characters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNotesChange("")}
              className="text-destructive hover:text-destructive"
            >
              Clear Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
