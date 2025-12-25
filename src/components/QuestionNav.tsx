import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";
import { motion } from "framer-motion";

interface QuestionNavProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onNavigate: (questionNumber: number) => void;
}

export const QuestionNav = ({
  totalQuestions,
  currentQuestion,
  answers,
  flagged,
  onNavigate,
}: QuestionNavProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-3">Question Navigator</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const isAnswered = answers[num] !== undefined;
          const isCurrent = num === currentQuestion;
          const isFlagged = flagged.has(num);

          return (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(num)}
              className={cn(
                "relative h-9 w-full rounded-md text-sm font-medium transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                isCurrent
                  ? "bg-primary text-primary-foreground shadow-md"
                  : isAnswered
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {num}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning">
                  <Flag className="h-2.5 w-2.5 text-warning-foreground" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-primary" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-secondary" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-muted" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative h-3 w-3 rounded bg-muted">
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-warning" />
          </span>
          <span>Flagged</span>
        </div>
      </div>
    </div>
  );
};
