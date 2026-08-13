import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
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
  const [showResizeMenu, setShowResizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showStrikeout, setShowStrikeout] = useState(false);
  const [textZoom, setTextZoom] = useState(100);
  const [darkTheme, setDarkTheme] = useState(false);
  const [notes, setNotes] = useState("");

  const itemInSection = currentQuestion - sectionStart + 1;
  const itemsInSection = sectionEnd - sectionStart + 1;
  const unanswered = Math.max(itemsInSection - answeredInSection, 0);

  useEffect(() => {
    document.body.classList.toggle("classic-show-strikeout", showStrikeout);
    return () => document.body.classList.remove("classic-show-strikeout");
  }, [showStrikeout]);

  useEffect(() => {
    document.documentElement.classList.toggle("classic-dark-theme", darkTheme);
    return () => document.documentElement.classList.remove("classic-dark-theme");
  }, [darkTheme]);

  useEffect(() => {
    document.documentElement.dataset.examTextZoom = String(textZoom);
    return () => {
      delete document.documentElement.dataset.examTextZoom;
    };
  }, [textZoom]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showHelpDialog) {
        setShowHelpDialog(false);
        return;
      }
      if (showResizeMenu || showColorMenu) {
        setShowResizeMenu(false);
        setShowColorMenu(false);
        return;
      }
      if (showSettings) setShowSettings(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showHelpDialog, showResizeMenu, showColorMenu, showSettings]);

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

  const closeSettings = () => {
    setShowSettings(false);
    setShowResizeMenu(false);
    setShowColorMenu(false);
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
              onClick={() => {
                setShowSettings((value) => !value);
                setShowResizeMenu(false);
                setShowColorMenu(false);
              }}
              aria-expanded={showSettings}
              title="Settings"
            >
              <Settings aria-hidden="true" />
              <span>Settings</span>
            </button>
            {showSettings ? (
              <div className="classic-settings-menu source-settings-menu" role="menu">
                <div className="source-settings-submenu-wrap">
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={showResizeMenu}
                    onClick={() => {
                      setShowResizeMenu((value) => !value);
                      setShowColorMenu(false);
                    }}
                  >
                    <span>Resize Text</span><span className="source-settings-caret">▶</span>
                  </button>
                  {showResizeMenu ? (
                    <div className="source-settings-submenu source-resize-menu" role="menu">
                      {[100, 125, 150, 200].map((zoom) => (
                        <button key={zoom} type="button" role="menuitem" onClick={() => { setTextZoom(zoom); setShowResizeMenu(false); }}>
                          {zoom}%{textZoom === zoom ? "*" : ""}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="source-settings-submenu-wrap">
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={showColorMenu}
                    onClick={() => {
                      setShowColorMenu((value) => !value);
                      setShowResizeMenu(false);
                    }}
                  >
                    <span>Color Theme</span><span className="source-settings-caret">▶</span>
                  </button>
                  {showColorMenu ? (
                    <div className="source-settings-submenu source-color-menu" role="menu">
                      <button type="button" role="menuitem" onClick={() => { setDarkTheme(false); setShowColorMenu(false); }}>Default{!darkTheme ? "*" : ""}</button>
                      <button type="button" role="menuitem" onClick={() => { setDarkTheme(true); setShowColorMenu(false); }}>Dark Theme{darkTheme ? "*" : ""}</button>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setShowStrikeout((value) => !value)}
                >
                  Show/Hide Strikeout
                </button>

                <button
                  type="button"
                  role="menuitem"
                  id="tools-help"
                  onClick={() => {
                    closeSettings();
                    setShowHelpDialog(true);
                  }}
                >
                  Help
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
        <section id="helpContainer" className="source-help-container" role="dialog" aria-label="Help" aria-modal="false">
          <div className="source-help-handle">
            <h2>Exam Interface and Features</h2>
            <button className="source-help-close" type="button" aria-label="Close" title="Close" autoFocus onClick={() => setShowHelpDialog(false)}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
              </svg>
            </button>
          </div>

          <div className="source-help-content" tabIndex={0}>
            <div>
              <h3>Exam Navigation</h3>
              <table>
                <tbody>
                  <tr className="source-help-top"><td colSpan={2}>&nbsp;</td></tr>
                  <tr><td><b>Question Status Panel</b></td><td><p>At the left of the screen, the Question Status Panel indicates your location within the exam section and displays information about the status of each question.</p><p>A dot indicates an unanswered question.</p><p>A flag indicates a question you have marked.</p><p>A pencil indicates a question where you have left a note.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Previous/Next</b></td><td><p>Moves backward or forward one screen.</p><p>The number on the left indicates the current question and the number on right indicates the total number of questions in the current block.</p></td></tr>
                  <tr><td><b>Timer Info Panel</b></td><td><p>Shows remaining Block Time and Day Time.</p><p>Clicking on this panel displays details of block and day timers.</p></td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3>Answering Questions</h3>
              <p>As you navigate through the questions in your exam, you can select your choice of answer using the mouse or keyboard. You may change your answer at any time until you end the block. Once you have selected an answer you will not be able to return the item to its original unanswered state.</p>
              <p>The following tools are available for you to interact with on each question.</p>
              <table>
                <tbody>
                  <tr><td><b>Highlight</b></td><td><p>Left click-and-drag on text in the question to highlight text.</p><p>Single click on highlighted text to remove.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Strikeout</b></td><td><p>Right click on an answer option to strike out that option.</p><p>Right click on a strikeout to remove.</p></td></tr>
                  <tr><td><b>Strikeout Button</b></td><td><p>An optional Strikeout button can be enabled by selecting Show Strikeout in the Settings.</p><p>This Strikeout button can be activated via mouse, or by pressing [enter] or [space] on the keyboard.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Mark</b></td><td><p>Places a flag mark in the Question Status Panel for this question.</p></td></tr>
                  <tr><td><b>Lab Values</b></td><td><p>Opens a searchable reference containing laboratory values.</p><p>SI reference intervals can be optionally displayed.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Notes</b></td><td><p>Adds a note to the exam question.</p><p>A pencil icon will be added to the Question Status Panel for this question.</p></td></tr>
                  <tr><td><b>Calculator</b></td><td><p>Opens a basic calculator.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Image Invert</b></td><td><p>Inverts the colors of images.</p></td></tr>
                  <tr><td><b>Image Contrast</b></td><td><p>Adjusts the contrast of images.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Image Magnification</b></td><td><p>Allows full-screen magnification of images.</p></td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3>Keyboard Controls</h3>
              <table>
                <tbody>
                  <tr className="source-help-top"><td><b>Keystroke</b></td><td><b>Function</b></td></tr>
                  <tr className="source-help-blue"><td><b>Tab</b><br /><b>Shift + Tab</b></td><td><p>Go to next (Tab) or previous (Shift + Tab) focusable item (link, button, input, etc.).</p></td></tr>
                  <tr><td><b>Enter or Spacebar</b></td><td><p>Activate or open a button, link, or interactive element.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Arrow Keys</b></td><td><p>Navigate within the list of answer options.</p></td></tr>
                  <tr><td><b>Windows: Control +/-</b><br /><b>MacOS: Command +/-</b></td><td><p>Enlarge or reduce.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Spacebar</b></td><td><p>Select or unselect a checkbox or radio button.</p></td></tr>
                  <tr><td><b>Escape (Esc)</b></td><td><p>Close a newly opened overlay, such as a modal dialog window, popup, or dropdown menu.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Individual Letter Keys (A,B,C, etc.)</b></td><td><p>You can also select an answer option by pressing the corresponding letter on the keyboard. For example, A for answer option “A.”</p></td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3>Settings</h3>
              <table>
                <tbody>
                  <tr className="source-help-top"><td colSpan={2}>&nbsp;</td></tr>
                  <tr className="source-help-blue"><td><b>Settings</b></td><td><p>Opens the menu to access the settings detailed below.</p></td></tr>
                  <tr><td><b>Resize Text</b></td><td><p>Resizes the text of the exam interface and questions.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Color Theme</b></td><td><p>Switches between the default color theme and a dark theme.</p></td></tr>
                  <tr><td><b>Show/Hide Strikeout</b></td><td><p>When enabled, displays a strikeout icon next to each answer option.</p></td></tr>
                  <tr className="source-help-blue"><td><b>Help</b></td><td><p>Review the information presented in this tutorial for interacting with the exam.</p></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
