import { Flag } from "lucide-react";

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
  currentSection: number;
  totalSections: number;
  sectionStart: number;
  sectionEnd: number;
}

export const ExamHeader = ({
  currentQuestion,
  timeRemaining,
  onFlag,
  isFlagged,
  showTimer,
  currentSection,
  sectionStart,
  sectionEnd,
}: ExamHeaderProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hr ${minutes.toString().padStart(2, "0")} min ${secs.toString().padStart(2, "0")} sec`;
  };

  const itemInSection = currentQuestion - sectionStart + 1;
  const itemsInSection = sectionEnd - sectionStart + 1;

  return (
    <header className="classic-exam-header">
      <div className="classic-header-left">
        <div className="classic-section-line">
          Exam Section {currentSection}: Item {itemInSection} of {itemsInSection}
        </div>
        <button
          type="button"
          onClick={onFlag}
          className={`classic-mark-button ${isFlagged ? "is-marked" : ""}`}
          aria-pressed={isFlagged}
        >
          <span className="classic-mark-box" aria-hidden="true">
            {isFlagged ? <Flag size={12} strokeWidth={3} /> : null}
          </span>
          Mark
        </button>
      </div>

      {showTimer && (
        <div className="classic-time-block">
          <div>Time Remaining:</div>
          <strong>{formatTime(timeRemaining)}</strong>
        </div>
      )}
    </header>
  );
};
