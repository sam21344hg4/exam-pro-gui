import { Clock, BookOpen, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LabValues } from "./LabValues";
import { Notes } from "./Notes";
import { Calculator } from "./Calculator";
import { ThemeToggle } from "./ThemeToggle";
import { TextZoom } from "./TextZoom";
import { EndBlock } from "./EndBlock";
import { Separator } from "@/components/ui/separator";

interface ExamHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  isFlagged: boolean;
  answeredCount: number;
  notes: string;
  onNotesChange: (notes: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onEndBlock: () => void;
  showTimer: boolean;
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
  notes,
  onNotesChange,
  isDark,
  onToggleTheme,
  fontSize,
  onFontSizeChange,
  onEndBlock,
  showTimer,
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
      <div className="container flex h-14 items-center justify-between px-2 md:px-4">
        {/* Left: Navigation and Item Info */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          
          <div className="hidden sm:flex flex-col text-xs">
            <span className="font-semibold text-foreground">
              Item: {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-muted-foreground">Block: 1 of 1</span>
          </div>

          <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />

          <Button
            variant={isFlagged ? "default" : "outline"}
            size="sm"
            onClick={onFlag}
            className={`gap-1 text-xs h-8 ${isFlagged ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}`}
          >
            <Flag className="h-3 w-3" />
            <span className="hidden md:inline">Mark</span>
          </Button>
        </div>

        {/* Center: Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentQuestion === 1}
            className="gap-1 h-8 text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex flex-col items-center mx-2">
            <div className="w-24 sm:w-32">
              <Progress value={progress} className="h-1.5" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentQuestion === totalQuestions}
            className="gap-1 h-8 text-xs"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <LabValues />
          <Notes notes={notes} onNotesChange={onNotesChange} />
          <Calculator />
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          <TextZoom fontSize={fontSize} onFontSizeChange={onFontSizeChange} />
          
          <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />

          {/* Timer */}
          {showTimer && (
            <div
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs ${
                isLowTime
                  ? "bg-destructive/10 text-destructive animate-pulse-soft"
                  : "bg-timer-bg text-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}

          <EndBlock
            answeredCount={answeredCount}
            totalQuestions={totalQuestions}
            onEnd={onEndBlock}
          />
        </div>
      </div>
    </header>
  );
};
