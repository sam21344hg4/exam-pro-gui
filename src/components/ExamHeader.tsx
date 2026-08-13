import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ListChecks,
  LockKeyhole,
  Pause,
  Settings,
  X,
} from "lucide-react";
import { LabValues } from "./LabValues";
import { Calculator } from "./Calculator";
import { Notes } from "./Notes";

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
  totalSections?: number;
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
  onEndBlock,
  onReview,
  onPause,
  showTimer,
  currentSection,
  totalSections = currentSection,
  sectionStart,
  sectionEnd,
  answeredInSection,
  markedInSection,
  canPrevious,
  canNext,
}: ExamHeaderProps) => {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notes, setNotes] = useState("");

  const itemInSection = currentQuestion - sectionStart + 1;
  const itemsInSection = sectionEnd - sectionStart + 1;
  const unanswered = Math.max(itemsInSection - answeredInSection, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const confirmEndBlock = () => {
    setShowEndDialog(false);
    onEndBlock();
  };

  return (
    <>
      <header className="classic-exam-header" role="banner">
        <div className="classic-header-stats" aria-label="Exam position">
          <span>Item: {itemInSection} of {itemsInSection}</span>
          <span>Block: {currentSection} of {totalSections}</span>
        </div>

        <nav className="classic-header-navigation" aria-label="Question navigation">
          <button type="button" onClick={onPrevious} disabled={!canPrevious} title="Previous">
            <ChevronLeft aria-hidden="true" />
            <span>Previous</span>
          </button>
          <div className="classic-header-question-number">{itemInSection} / {itemsInSection}</div>
          <button type="button" onClick={onNext} disabled={!canNext} title="Next">
            <ChevronRight aria-hidden="true" />
            <span>Next</span>
          </button>
        </nav>

        <div className="classic-header-tools" aria-label="Exam tools">
          <div className="classic-header-tool-slot"><LabValues /></div>
          <div className="classic-header-tool-slot"><Notes notes={notes} onNotesChange={setNotes} /></div>
          <div className="classic-header-tool-slot"><Calculator /></div>
          <div className="classic-settings-wrap">
            <button
              type="button"
              className="classic-header-settings"
              onClick={() => setShowSettings((value) => !value)}
              aria-expanded={showSettings}
              title="Settings"
            >
              <Settings aria-hidden="true" />
              <span>Settings</span>
            </button>
            {showSettings ? (
              <div className="classic-settings-menu" role="menu">
                <button type="button" role="menuitem" onClick={() => { setShowSettings(false); onReview(); }}>
                  <ListChecks size={16} /> Review Block
                </button>
                <button type="button" role="menuitem" onClick={() => { setShowSettings(false); setShowHelpDialog(true); }}>
                  <CircleHelp size={16} /> Help
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <footer className="classic-bottom-bar" aria-label="Exam controls">
        <div className="classic-footer-left">
          <div className="classic-block-time">
            <span>Block Time Remaining:</span>
            <strong>{showTimer ? formatTime(timeRemaining) : "untimed"}</strong>
          </div>
          <button type="button" className="classic-footer-button" onClick={onPause} title="Pause">
            <Pause aria-hidden="true" />
            <span>Pause</span>
          </button>
        </div>

        <button type="button" className="classic-footer-button classic-lock-button" onClick={onPause} title="Lock">
          <LockKeyhole aria-hidden="true" />
          <span>Lock</span>
        </button>

        <button
          type="button"
          className="classic-footer-button classic-end-button"
          onClick={() => setShowEndDialog(true)}
          title="End Block"
        >
          <span className="classic-end-icon"><X aria-hidden="true" /></span>
          <span>End Block</span>
        </button>
      </footer>

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
              <p><strong>Mark Question:</strong> Mark an item when you want to return to it during the current block.</p>
              <p><strong>Review:</strong> Opens the block review screen with answered, incomplete, and marked items.</p>
              <p><strong>Lab Values, Notes, and Calculator:</strong> Open reference tools without leaving the current item.</p>
              <p><strong>Pause / Lock:</strong> Stops the local simulator timer until you resume.</p>
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