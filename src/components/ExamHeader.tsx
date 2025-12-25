import { Clock, BookOpen, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ExamHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  isFlagged: boolean;
  answeredCount: number;
}

export const ExamHeader = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onPrevious,
  onNext,
  onFlag,
  isFlagged,
  answeredCount,
}: ExamHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (answeredCount / totalQuestions) * 100;
  const isLowTime = timeRemaining < 300; // Less than 5 minutes

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-foreground">NBME 26</h1>
            <p className="text-xs text-muted-foreground">Section 1</p>
          </div>
        </div>

        {/* Center: Navigation and Progress */}
        <div className="flex flex-1 items-center justify-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={currentQuestion === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <div className="w-32 sm:w-48">
              <Progress value={progress} className="h-1.5" />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={currentQuestion === totalQuestions}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: Timer and Flag */}
        <div className="flex items-center gap-2">
          <Button
            variant={isFlagged ? "default" : "outline"}
            size="sm"
            onClick={onFlag}
            className={`hidden sm:flex gap-1.5 ${isFlagged ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}`}
          >
            <Flag className="h-3.5 w-3.5" />
            <span className="text-xs">Flag</span>
          </Button>

          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
              isLowTime
                ? "bg-destructive/10 text-destructive animate-pulse-soft"
                : "bg-timer-bg text-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
