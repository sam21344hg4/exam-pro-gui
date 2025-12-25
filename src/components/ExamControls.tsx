import { Button } from "@/components/ui/button";
import { Eye, Send, RotateCcw, ChevronRight } from "lucide-react";

interface ExamControlsProps {
  hasAnswer: boolean;
  showExplanation: boolean;
  isLastQuestion: boolean;
  onShowAnswer: () => void;
  onSubmit: () => void;
  onNext: () => void;
  onReset: () => void;
}

export const ExamControls = ({
  hasAnswer,
  showExplanation,
  isLastQuestion,
  onShowAnswer,
  onSubmit,
  onNext,
  onReset,
}: ExamControlsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
      {!showExplanation ? (
        <>
          <Button
            variant="outline"
            onClick={onShowAnswer}
            disabled={!hasAnswer}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Show Answer
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!hasAnswer}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          {!isLastQuestion && (
            <Button onClick={onNext} className="gap-2 bg-primary hover:bg-primary/90">
              Next Question
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};
