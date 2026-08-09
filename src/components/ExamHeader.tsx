import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Flag,
  ListChecks,
  Pause,
  X,
} from "lucide-react";
import { LabValues } from "./LabValues";
import { Calculator } from "./Calculator";

interface ExamHeaderProps {
  currentQuestion: number;
  timeRemaining: number;
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  isFlagged: boolean;
  onEndBlock: () => void;
  onReview: () => void;
  onPause: () => void;
  showTimer: boolean;
  currentSection: number;
  sectionStart: number;
  sectionEnd: number;
  examTitle: string;
  answeredInSection: number;
  markedInSection: number;
  canPrevious: boolean;
  canNext: boolean;
}

export const ExamHeader = ({
  currentQuestion,
  timeRemaining,
  onPrevious,
  onNext,
  onFlag,
  isFlagged,
  onEndBlock,
  onReview,
  onPause,
  showTimer,
  currentSection,
  sectionStart,
  sectionEnd,
  examTitle,
  answeredInSection,
  markedInSection,
  canPrevious,
  canNext,
}: ExamHeaderProps) => {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showTimerValue, setShowTimerValue] = useState(true);

  const itemInSection = currentQuestion - sectionStart + 1;
  const itemsInSection = sectionEnd - sectionStart + 1;
  const unanswered = Math.max(itemsInSection - answeredInSection, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hr ${minutes.toString().padStart(2, "0")} min ${secs
      .toString()
      .padStart(2, "0")} sec`;
  };

  const confirmEndBlock = () => {
    setShowEndDialog(false);
    onEndBlock();
  };

  return (
    <>
      <header className="classic-exam-header" role="banner">
        <div className="classic-header-accent" aria-hidden="true" />
        <div className="classic-header-main-row">
          <div className="classic-question-location">
            Exam Section {currentSection} Item: {itemInSection} of {itemsInSection}
          </div>
          <div className="classic-header-brand" aria-label="Exam delivery interface">
            Board Examination Simulator
          </div>
          <div className="classic-time-block">
            {showTimer ? (
              <button
                type="button"
                className="classic-timer-button"
                onClick={() => setShowTimerValue((value) => !value)}
                aria-expanded={showTimerValue}
                title="Show or hide the timer"
              >
                <span>Time Remaining:</span>
                <strong>{showTimerValue ? formatTime(timeRemaining) : "Hidden"}</strong>
              </button>
            ) : null}
          </div>
        </div>

        <div className="classic-header-sub-row">
          <div className="classic-header-sub-left">
            <button
              type="button"
              onClick={onFlag}
              className={`classic-mark-button ${isFlagged ? "is-marked" : ""}`}
              aria-pressed={isFlagged}
              aria-label={isFlagged ? "Remove mark for review" : "Mark for review"}
            >
              <span className="classic-mark-box" aria-hidden="true">
                {isFlagged ? <Flag size={11} strokeWidth={3} /> : null}
              </span>
              <span>Mark</span>
            </button>
          </div>
          <div className="classic-exam-title" title={examTitle}>
            {examTitle}
          </div>
          <div className="classic-header-sub-right" />
        </div>
      </header>

      <nav className="classic-bottom-bar" aria-label="Exam navigation">
        <button
          className="classic-bottom-button classic-end-button"
          type="button"
          onClick={() => setShowEndDialog(true)}
          title="End Block"
        >
          <span className="classic-bottom-icon"><X size={18} strokeWidth={2.5} /></span>
          <span>End Block</span>
        </button>

        <button
          className="classic-bottom-button"
          type="button"
          onClick={onPrevious}
          disabled={!canPrevious}
          title="Previous"
        >
          <span className="classic-bottom-icon"><ChevronLeft size={20} strokeWidth={3} /></span>
          <span>Previous</span>
        </button>

        <button
          className="classic-bottom-button"
          type="button"
          onClick={onNext}
          disabled={!canNext}
          title="Next"
        >
          <span className="classic-bottom-icon"><ChevronRight size={20} strokeWidth={3} /></span>
          <span>Next</span>
        </button>

        <div className="classic-bottom-spacer" aria-hidden="true" />

        <div className="classic-tool-slot"><LabValues /></div>
        <div className="classic-tool-slot"><Calculator /></div>

        <button className="classic-bottom-button" type="button" onClick={onReview} title="Review">
          <span className="classic-bottom-icon"><ListChecks size={17} strokeWidth={2.4} /></span>
          <span>Review</span>
        </button>

        <button
          className="classic-bottom-button"
          type="button"
          onClick={() => setShowHelpDialog(true)}
          title="Help"
        >
          <span className="classic-bottom-icon"><CircleHelp size={18} strokeWidth={2.4} /></span>
          <span>Help</span>
        </button>

        <button className="classic-bottom-button" type="button" onClick={onPause} title="Pause">
          <span className="classic-bottom-icon"><Pause size={17} fill="currentColor" /></span>
          <span>Pause</span>
        </button>
      </nav>

      {showEndDialog ? (
        <div className="classic-modal-backdrop" role="presentation" onMouseDown={() => setShowEndDialog(false)}>
          <section
            className="classic-modal classic-end-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="end-block-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="classic-modal-titlebar" id="end-block-title">End Block</div>
            <div className="classic-modal-body">
              <p>Are you sure you want to end this block?</p>
              <p>
                You have <strong>{unanswered}</strong> unanswered item{unanswered === 1 ? "" : "s"} and{" "}
                <strong>{markedInSection}</strong> marked item{markedInSection === 1 ? "" : "s"} in this block.
              </p>
              <p>After the block is ended, you will not be able to return to these items.</p>
            </div>
            <div className="classic-modal-actions">
              <button type="button" onClick={() => setShowEndDialog(false)}>Return to Block</button>
              <button type="button" className="classic-primary-action" onClick={confirmEndBlock}>End Block</button>
            </div>
          </section>
        </div>
      ) : null}

      {showHelpDialog ? (
        <div className="classic-modal-backdrop" role="presentation" onMouseDown={() => setShowHelpDialog(false)}>
          <section
            className="classic-modal classic-help-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="classic-modal-titlebar" id="help-title">Help</div>
            <div className="classic-modal-body classic-help-copy">
              <p><strong>Answering:</strong> Select one response for each item. Your selection is saved automatically.</p>
              <p><strong>Mark:</strong> Mark an item when you want to return to it during the current block.</p>
              <p><strong>Review:</strong> Opens the block review screen with answered, incomplete, and marked items.</p>
              <p><strong>Lab Values and Calculator:</strong> Open reference tools without leaving the current item.</p>
              <p><strong>Pause:</strong> Pauses the local simulator and stops its timer until you resume.</p>
            </div>
            <div className="classic-modal-actions">
              <button type="button" className="classic-primary-action" onClick={() => setShowHelpDialog(false)}>Close</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
};
