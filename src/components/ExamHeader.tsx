import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LockKeyhole, Menu, Pause, X } from "lucide-react";
import { Calculator } from "./Calculator";
import { CoordinatedLabValues } from "./CoordinatedLabValues";
import { Notes } from "./Notes";
import { useExamUI } from "./ExamUIProvider";

export interface ExamSectionMeta {
  block: number;
  itemCount: number;
  durationSeconds: number;
  completed: boolean;
}

interface ExamHeaderProps {
  currentQuestion: number;
  timeRemaining: number;
  timeSpent: number;
  onPrevious: () => void;
  onNext: () => void;
  onEndBlock: () => void;
  onPause: () => void;
  showTimer: boolean;
  currentSection: number;
  totalSections: number;
  sectionStart: number;
  sectionEnd: number;
  sectionTimeLimitSeconds: number;
  dayTimeLimitSeconds: number;
  sections: ExamSectionMeta[];
  answeredInSection: number;
  markedInSection: number;
  canPrevious: boolean;
  canNext: boolean;
  note: string;
  onNoteChange: (itemId: number, note: string) => void;
}

const formatClock = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatLongTime = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return `${hours} hr ${minutes} min ${secs} sec`;
};

export const ExamHeader = ({
  currentQuestion,
  timeRemaining,
  timeSpent,
  onPrevious,
  onNext,
  onEndBlock,
  onPause,
  showTimer,
  currentSection,
  totalSections,
  sectionStart,
  sectionEnd,
  sectionTimeLimitSeconds,
  dayTimeLimitSeconds,
  sections,
  answeredInSection,
  markedInSection,
  canPrevious,
  canNext,
  note,
  onNoteChange,
}: ExamHeaderProps) => {
  const {
    activePopup,
    openPopup,
    closePopup,
    togglePopup,
    showStrikeout,
    setShowStrikeout,
    textZoom,
    setTextZoom,
    darkTheme,
    setDarkTheme,
  } = useExamUI();

  const [showResizeMenu, setShowResizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  const itemInSection = currentQuestion - sectionStart + 1;
  const itemsInSection = Math.max(sectionEnd - sectionStart + 1, 0);
  const unanswered = Math.max(itemsInSection - answeredInSection, 0);
  const blockElapsed = showTimer ? Math.max(sectionTimeLimitSeconds - timeRemaining, 0) : timeSpent;
  const dayRemaining = showTimer ? Math.max(dayTimeLimitSeconds - timeSpent, 0) : 0;
  const dayElapsed = showTimer ? Math.min(timeSpent, dayTimeLimitSeconds) : timeSpent;

  useEffect(() => {
    if (activePopup !== "settings") {
      setShowResizeMenu(false);
      setShowColorMenu(false);
    }
  }, [activePopup]);

  useEffect(() => {
    if (activePopup !== "settings") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || (!showResizeMenu && !showColorMenu)) return;
      event.preventDefault();
      event.stopPropagation();
      setShowResizeMenu(false);
      setShowColorMenu(false);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [activePopup, showResizeMenu, showColorMenu]);

  const confirmEndBlock = () => {
    closePopup("end");
    onEndBlock();
  };

  return (
    <>
      <header className="classic-exam-header source-exam-header" role="banner">
        <button
          type="button"
          className={`classic-header-stats source-item-info-trigger ${activePopup === "overview" ? "is-open" : ""}`}
          aria-expanded={activePopup === "overview"}
          onClick={() => togglePopup("overview")}
          title="Item Information"
        >
          <span>Item: {itemInSection} of {itemsInSection}</span>
          <span>Block: {currentSection} of {totalSections}</span>
        </button>

        <nav className="classic-header-navigation" aria-label="Question navigation">
          <button type="button" onClick={onPrevious} disabled={!canPrevious} title="Previous">
            <ChevronLeft aria-hidden="true" /><span>Previous</span>
          </button>
          <div className="classic-header-question-number">{itemInSection} / {itemsInSection}</div>
          <button type="button" onClick={onNext} disabled={!canNext} title="Next">
            <ChevronRight aria-hidden="true" /><span>Next</span>
          </button>
        </nav>

        <div className="classic-header-tools" aria-label="Exam tools">
          <div className="classic-header-tool-slot"><CoordinatedLabValues /></div>
          <div className="classic-header-tool-slot"><Notes itemId={currentQuestion} notes={note} onNotesChange={onNoteChange} /></div>
          <div className="classic-header-tool-slot"><Calculator /></div>
          <div className="classic-settings-wrap">
            <button
              type="button"
              className={`classic-header-settings ${activePopup === "settings" ? "is-open" : ""}`}
              onClick={() => togglePopup("settings")}
              aria-expanded={activePopup === "settings"}
              title="Settings"
            >
              <Menu aria-hidden="true" /><span>Settings</span>
            </button>

            {activePopup === "settings" ? (
              <div className="classic-settings-menu source-settings-menu" role="menu">
                <div className="source-settings-submenu-wrap">
                  <button type="button" role="menuitem" aria-haspopup="true" aria-expanded={showResizeMenu} onClick={() => { setShowResizeMenu((value) => !value); setShowColorMenu(false); }}>
                    <span>Resize Text</span><span className="source-settings-caret">▶</span>
                  </button>
                  {showResizeMenu ? (
                    <div className="source-settings-submenu source-resize-menu" role="menu">
                      {([100, 125, 150, 200] as const).map((zoom) => (
                        <button key={zoom} type="button" role="menuitemradio" aria-checked={textZoom === zoom} onClick={() => { setTextZoom(zoom); setShowResizeMenu(false); }}>
                          <span>{zoom}%{textZoom === zoom ? "*" : ""}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="source-settings-submenu-wrap">
                  <button type="button" role="menuitem" aria-haspopup="true" aria-expanded={showColorMenu} onClick={() => { setShowColorMenu((value) => !value); setShowResizeMenu(false); }}>
                    <span>Color Theme</span><span className="source-settings-caret">▶</span>
                  </button>
                  {showColorMenu ? (
                    <div className="source-settings-submenu source-color-menu" role="menu">
                      <button type="button" role="menuitemradio" aria-checked={!darkTheme} onClick={() => { setDarkTheme(false); setShowColorMenu(false); }}><span>Default{!darkTheme ? "*" : ""}</span></button>
                      <button type="button" role="menuitemradio" aria-checked={darkTheme} onClick={() => { setDarkTheme(true); setShowColorMenu(false); }}><span>Dark Theme{darkTheme ? "*" : ""}</span></button>
                    </div>
                  ) : null}
                </div>

                <button type="button" role="menuitemcheckbox" aria-checked={showStrikeout} onClick={() => setShowStrikeout(!showStrikeout)}>
                  <span>Show/Hide Strikeout</span>
                </button>
                <button type="button" role="menuitem" id="tools-help" onClick={() => openPopup("help")}><span>Help</span></button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <footer className="classic-bottom-bar source-bottom-bar" aria-label="Exam controls">
        <div className="classic-footer-left">
          <button type="button" className={`source-timer-trigger ${activePopup === "timer" ? "is-open" : ""}`} onClick={() => togglePopup("timer")} aria-expanded={activePopup === "timer"}>
            <span>Block Time Remaining:</span><strong>{showTimer ? formatClock(timeRemaining) : "untimed"}</strong>
            {showTimer ? <><span>Day Time Remaining:</span><strong>{formatClock(dayRemaining)}</strong></> : null}
          </button>
          <button type="button" className="classic-footer-button" onClick={onPause} title="Pause"><Pause aria-hidden="true" /><span>Pause</span></button>
        </div>

        <button type="button" className="classic-footer-button classic-lock-button" onClick={onPause} title="Lock"><LockKeyhole aria-hidden="true" /><span>Lock</span></button>
        <button type="button" className={`classic-footer-button classic-end-button ${unanswered === 0 ? "is-complete" : ""}`} onClick={() => togglePopup("end")} title="End Block">
          <span className="classic-end-icon">{unanswered === 0 ? <ChevronRight aria-hidden="true" /> : <X aria-hidden="true" />}</span><span>End Block</span>
        </button>
      </footer>

      {activePopup === "overview" ? (
        <section className="source-overview-panel" role="dialog" aria-modal="false" aria-labelledby="overview-title">
          <div className="source-panel-heading" id="overview-title">Exam Overview</div>
          <div className="source-overview-caption">Day 1 of 1</div>
          <table><thead><tr><th>Block</th><th>Time</th><th>Items</th></tr></thead><tbody>
            {sections.map((row) => (
              <tr key={row.block} className={row.block === currentSection ? "is-current" : ""}>
                <td>{row.completed ? "✓ " : ""}{row.block}</td><td>{formatLongTime(row.durationSeconds)}</td><td>{row.itemCount}</td>
              </tr>
            ))}
          </tbody></table>
        </section>
      ) : null}

      {activePopup === "timer" ? (
        <section className="source-timer-panel" role="dialog" aria-modal="false" aria-labelledby="timer-title">
          <div className="source-panel-heading" id="timer-title">Time Information</div>
          <div className="source-time-section">
            <h3>Block {currentSection} of {totalSections}</h3>
            <dl>
              <div><dt>Time Remaining</dt><dd>{showTimer ? formatLongTime(timeRemaining) : "untimed"}</dd></div>
              <div><dt>Elapsed Time</dt><dd>{formatLongTime(blockElapsed)}</dd></div>
              <div><dt>Length of Block</dt><dd>{showTimer ? formatLongTime(sectionTimeLimitSeconds) : "untimed"}</dd></div>
            </dl>
          </div>
          <div className="source-time-section">
            <h3>Day 1 of 1</h3>
            <dl>
              <div><dt>Time Remaining</dt><dd>{showTimer ? formatLongTime(dayRemaining) : "untimed"}</dd></div>
              <div><dt>Elapsed Time</dt><dd>{formatLongTime(dayElapsed)}</dd></div>
              <div><dt>Total Time</dt><dd>{showTimer ? formatLongTime(dayTimeLimitSeconds) : "untimed"}</dd></div>
              <div><dt>Break Time Remaining</dt><dd>Not available</dd></div>
            </dl>
          </div>
        </section>
      ) : null}

      {activePopup === "end" ? (
        <section className="source-end-dialog" role="alertdialog" aria-modal="true" aria-labelledby="source-end-title">
          <div className="source-panel-heading" id="source-end-title">End Block</div>
          <div className="source-end-copy">
            {unanswered > 0 ? <><p>There {unanswered === 1 ? "is" : "are"} still <strong>{unanswered}</strong> incomplete item{unanswered === 1 ? "" : "s"} in this block.</p><p>Are you sure that you wish to end the block?</p></> : <><p>Once you exit this block you will NOT be able to return to any of the items.</p><p>Are you sure that you wish to exit this block?</p></>}
            {markedInSection > 0 ? <p>You have {markedInSection} marked item{markedInSection === 1 ? "" : "s"}.</p> : null}
          </div>
          <div className="source-end-actions"><button type="button" onClick={confirmEndBlock}>End Block</button><button type="button" autoFocus onClick={() => closePopup("end")}>Remain in Block</button></div>
        </section>
      ) : null}

      {activePopup === "help" ? (
        <section id="helpContainer" className="source-help-container source-help-from-driver" role="dialog" aria-label="Help" aria-modal="false">
          <div className="source-help-handle">
            <h2>Exam Interface and Features</h2>
            <button className="source-help-close" type="button" aria-label="Close" title="Close" autoFocus onClick={() => closePopup("help")}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" /></svg>
            </button>
          </div>
          <div className="source-help-content" tabIndex={0}>
            <div><h3>Exam Navigation</h3><table><tbody>
              <tr className="source-help-top"><td colSpan={2}>&nbsp;</td></tr>
              <tr><td><b>Item Information Panel</b></td><td>Shows an exam overview and sections completed. The current item and block information are already displayed.</td></tr>
              <tr className="source-help-blue"><td><b>Previous/Next</b></td><td>Move backward or forward one screen.</td></tr>
              <tr><td><b>Lab Values</b></td><td>Opens a searchable reference containing four categories of laboratory values. SI reference intervals are also available.</td></tr>
              <tr className="source-help-blue"><td><b>Notes</b></td><td>Add a note to an item.</td></tr>
              <tr><td><b>Calculator</b></td><td>Opens a basic calculator. To close the calculator, click again.</td></tr>
            </tbody></table></div>
            <div><h3>Settings</h3><table><tbody>
              <tr className="source-help-top"><td><b>Settings</b></td><td>Opens the menu to access the settings detailed below.</td></tr>
              <tr><td><b>Resize Text</b></td><td>Resizes the text of the exam interface and questions.</td></tr>
              <tr className="source-help-blue"><td><b>Color Theme</b></td><td>Switches between the default color theme and a dark theme.</td></tr>
              <tr><td><b>Show/Hide Strikeout</b></td><td>When enabled, displays a strikeout icon next to each answer option.</td></tr>
              <tr className="source-help-blue"><td><b>Help</b></td><td>Review the information presented in this tutorial for interacting with the exam.</td></tr>
            </tbody></table></div>
            <div><h3>Highlight, Strike Out, and Other Features</h3>
              <p><b>Highlight:</b> Click and drag over text to highlight it in yellow. Click highlighted text to remove highlighting.</p>
              <p><b>Strikeout:</b> Click the strikeout button to add or remove strikeout from an option, or right click an option. Strikeout is removed from an option if that option is selected as the answer.</p>
              <p><b>Mark Question:</b> Mark an item to review later if time allows.</p>
              <p><b>Image Invert:</b> Inverts the colors of images.</p>
              <p><b>Image Contrast:</b> Adjusts the contrast of images.</p>
              <p><b>Image Magnification:</b> Allows full-screen magnification of images.</p>
              <p><b>Timer Panel:</b> Displays additional time summary information, including block and day timing.</p>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
