import { ChevronLeft, ChevronRight, CircleHelp, Flag, Pause, RotateCcw } from "lucide-react";
import { LabValues } from "./LabValues";
import { Calculator } from "./Calculator";
import { Notes } from "./Notes";

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
  onPrevious,
  onNext,
  onFlag,
  isFlagged,
  notes,
  onNotesChange,
  onEndBlock,
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

  const openReviewHelp = () => {
    window.alert("Review shows marked, answered, and unanswered items. Use Previous and Next to move through the block.");
  };

  const openGeneralHelp = () => {
    window.alert("Select one answer for each question. Use Mark to flag an item. Calculator, Lab Values, and Notes open in separate dialogs.");
  };

  return (
    <>
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

      <nav className="classic-bottom-bar" aria-label="Exam navigation">
        <button className="classic-bottom-button" onClick={onPrevious} disabled={currentQuestion === sectionStart}>
          <span className="classic-bottom-icon"><ChevronLeft size={18} /></span>
          <span>Previous</span>
        </button>
        <button className="classic-bottom-button" onClick={onNext} disabled={currentQuestion === sectionEnd}>
          <span className="classic-bottom-icon"><ChevronRight size={18} /></span>
          <span>Next</span>
        </button>
        <div className="classic-bottom-spacer" />
        <div className="classic-tool-slot"><Calculator /></div>
        <div className="classic-tool-slot"><LabValues /></div>
        <div className="classic-tool-slot"><Notes notes={notes} onNotesChange={onNotesChange} /></div>
        <button className="classic-bottom-button" type="button" onClick={openReviewHelp}>
          <span className="classic-bottom-icon"><RotateCcw size={16} /></span>
          <span>Review</span>
        </button>
        <button className="classic-bottom-button" type="button" onClick={openGeneralHelp}>
          <span className="classic-bottom-icon"><CircleHelp size={17} /></span>
          <span>Help</span>
        </button>
        <button className="classic-bottom-button" type="button" onClick={onEndBlock}>
          <span className="classic-bottom-icon"><Pause size={16} /></span>
          <span>Pause</span>
        </button>
      </nav>
    </>
  );
};
