import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Flag, LockKeyhole, Pause, Settings as SettingsIcon, X } from "lucide-react";
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
  breakTimeRemaining: number;
  onPrevious: () => void;
  onNext: () => void;
  onEndBlock: () => void;
  onPause?: () => void;
  showTimer: boolean;
  currentSection: number;
  totalSections: number;
  sectionStart: number;
  sectionEnd: number;
  sectionTimeLimitSeconds: number;
  dayTimeLimitSeconds: number;
  sections: ExamSectionMeta[];
  answeredInSection: number;
  canPrevious: boolean;
  canNext: boolean;
  note: string;
  onNoteChange: (itemId: number, note: string) => void;
  programId: string;
  isFlagged: boolean;
  onFlag: () => void;
  canMark: boolean;
}

const formatCompactClock = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const formatLongTime = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours > 0) return `${hours} hr ${minutes} min ${secs} sec`;
  return `${minutes} min ${secs} sec`;
};

export const ExamHeader = ({
  currentQuestion,
  timeRemaining,
  timeSpent,
  breakTimeRemaining,
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
  canPrevious,
  canNext,
  note,
  onNoteChange,
  programId,
  isFlagged,
  onFlag,
  canMark,
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
    isBlockingModal,
  } = useExamUI();

  const [showResizeMenu, setShowResizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const timerPanelRef = useRef<HTMLElement>(null);
  const overviewPanelRef = useRef<HTMLElement>(null);

  const itemInSection = currentQuestion - sectionStart + 1;
  const itemsInSection = Math.max(sectionEnd - sectionStart + 1, 0);
  const unanswered = Math.max(itemsInSection - answeredInSection, 0);
  const blockElapsed = showTimer ? Math.max(sectionTimeLimitSeconds - timeRemaining, 0) : timeSpent;
  const dayRemaining = showTimer ? Math.max(dayTimeLimitSeconds - timeSpent, 0) : 0;
  const dayElapsed = showTimer ? Math.min(timeSpent, dayTimeLimitSeconds) : timeSpent;
  const isUsmle = programId === "267";
  const inertProps = isBlockingModal ? ({ inert: "" } as any) : {};

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

  const beginUnauthorizedBreak = () => openPopup("unauthorizedBreak");

  return (
    <>
      <header {...inertProps} className="classic-exam-header source-exam-header" role="banner">
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

        {canMark ? (
          <label className={`source-mark-trigger ${isFlagged ? "is-marked" : ""}`}>
            <input type="checkbox" checked={isFlagged} onChange={onFlag} aria-label="Mark question" />
            <Flag aria-hidden="true" />
            <span>Mark Question</span>
          </label>
        ) : <span className="source-mark-placeholder" aria-hidden="true" />}

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
              <span className="source-settings-icon-box" aria-hidden="true"><SettingsIcon /><span className="source-settings-divider" /><span className="source-settings-triangle">▼</span></span>
              <span>Settings</span>
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

                <button type="button" role="menuitemcheckbox" aria-checked={showStrikeout} onClick={() => setShowStrikeout(!showStrikeout)}><span>Show/Hide Strikeout</span></button>
                <button type="button" role="menuitem" id="tools-help" onClick={() => openPopup("help")}><span>Help</span></button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <footer {...inertProps} className="classic-bottom-bar source-bottom-bar" aria-label="Exam controls">
        <div className="classic-footer-left">
          <button type="button" className={`source-timer-trigger ${activePopup === "timer" ? "is-open" : ""}`} onClick={() => togglePopup("timer")} aria-expanded={activePopup === "timer"}>
            <span>Block Time Remaining:</span><strong>{showTimer ? formatCompactClock(timeRemaining) : "untimed"}</strong>
            {showTimer ? <><span>Day Time Remaining:</span><strong>{formatCompactClock(dayRemaining)}</strong></> : null}
          </button>
          {!isUsmle && onPause ? <button type="button" className="classic-footer-button" onClick={onPause} title="Pause"><Pause aria-hidden="true" /><span>Pause</span></button> : null}
        </div>

        {isUsmle ? (
          <button type="button" className="classic-footer-button classic-lock-button" onClick={() => openPopup("lockWarning")} title="Lock"><LockKeyhole aria-hidden="true" /><span>Lock</span></button>
        ) : null}
        <button type="button" className={`classic-footer-button classic-end-button ${unanswered === 0 ? "is-complete" : ""}`} onClick={() => togglePopup("end")} title="End Block">
          <span className="classic-end-icon">{unanswered === 0 ? <ChevronRight aria-hidden="true" /> : <X aria-hidden="true" />}</span><span>End Block</span>
        </button>
      </footer>

      {activePopup === "overview" ? (
        <section ref={overviewPanelRef} className="source-overview-panel" role="dialog" aria-modal="false" aria-labelledby="overview-title">
          <button type="button" className="source-panel-close" aria-label="Close" title="Close" onClick={() => closePopup("overview")}><X aria-hidden="true" /></button>
          <div className="source-panel-heading" id="overview-title">Exam Overview</div>
          <table><tbody>
            {sections.map((row) => (
              <tr key={row.block} className={row.block === currentSection ? "is-current" : ""}>
                <td className="source-overview-check">{row.completed ? "✓" : ""}</td>
                <td>{row.block}</td><td>Exam Block</td><td>{formatLongTime(row.durationSeconds)}</td><td>{row.itemCount} items</td>
              </tr>
            ))}
          </tbody></table>
        </section>
      ) : null}

      {activePopup === "timer" ? (
        <section ref={timerPanelRef} className="source-timer-panel" role="dialog" aria-modal="false" aria-labelledby="timer-title">
          <button type="button" className="source-panel-close" aria-label="Close" title="Close" onClick={() => closePopup("timer")}><X aria-hidden="true" /></button>
          <div className="source-panel-heading" id="timer-title">Block Time Information</div>
          <div className="source-time-section">
            <h3>Block: {currentSection} of {totalSections}</h3>
            <dl>
              <div><dt>Time Remaining:</dt><dd>{showTimer ? formatLongTime(timeRemaining) : "untimed"}</dd></div>
              <div><dt>Elapsed Time:</dt><dd>{formatLongTime(blockElapsed)}</dd></div>
              <div><dt>Length of Block:</dt><dd>{showTimer ? formatLongTime(sectionTimeLimitSeconds) : "untimed"}</dd></div>
            </dl>
          </div>
          <div className="source-time-divider" />
          <div className="source-panel-heading source-day-heading">Day Time Information</div>
          <div className="source-time-section">
            <h3>Day: 1 of 1</h3>
            <dl>
              <div><dt>Time Remaining:</dt><dd>{showTimer ? formatLongTime(dayRemaining) : "untimed"}</dd></div>
              <div><dt>Elapsed Time:</dt><dd>{formatLongTime(dayElapsed)}</dd></div>
              <div><dt>Total Time:</dt><dd>{showTimer ? formatLongTime(dayTimeLimitSeconds) : "untimed"}</dd></div>
            </dl>
            <div className="source-break-time"><span>Break Time Remaining:</span><strong>{formatLongTime(breakTimeRemaining)}</strong></div>
          </div>
        </section>
      ) : null}

      {activePopup === "end" ? (
        <section className={`source-end-dialog ${unanswered > 0 ? "is-incomplete" : "is-complete"}`} role="alertdialog" aria-modal="true" aria-labelledby="source-end-title">
          <button type="button" className="source-alert-close" aria-label="Close" title="Close" onClick={() => closePopup("end")}><X aria-hidden="true" /></button>
          <div className="source-panel-heading" id="source-end-title">{unanswered > 0 ? "Warning - This block is incomplete!" : "Warning - You are about to end the block."}</div>
          <div className="source-end-copy">
            {unanswered > 0 ? <p>Number of unanswered items in this block: {unanswered}</p> : null}
            <p>If you end this block you will not be able to return.</p>
          </div>
          <div className="source-end-actions"><button type="button" onClick={confirmEndBlock}>End Block</button><button type="button" autoFocus onClick={() => closePopup("end")}>Remain in Block</button></div>
        </section>
      ) : null}

      {activePopup === "lockWarning" ? (
        <section className="source-alert-dialog source-lock-warning" role="alertdialog" aria-modal="true" aria-labelledby="source-lock-warning-title">
          <button type="button" className="source-alert-close" aria-label="Close" title="Close" onClick={() => closePopup("lockWarning")}><X aria-hidden="true" /></button>
          <div className="source-alert-title" id="source-lock-warning-title">Unauthorized Break Warning</div>
          <div className="source-alert-copy">You are about to lock the exam and take an Unauthorized Break. An Unauthorized Break may be reported as an irregularity for the exam.</div>
          <div className="source-alert-actions"><button type="button" onClick={beginUnauthorizedBreak}>Unauthorized Break</button><button type="button" autoFocus onClick={() => closePopup("lockWarning")}>Return to Exam</button></div>
        </section>
      ) : null}

      {activePopup === "unauthorizedBreak" ? (
        <section className="source-alert-dialog source-unauthorized-break" role="alertdialog" aria-modal="true" aria-labelledby="source-unauthorized-break-title">
          <div className="source-alert-title" id="source-unauthorized-break-title">Unauthorized Break</div>
          <div className="source-alert-copy"><h1>* * * Unauthorized Break * * *</h1><p>WARNING</p><p>The clock for this block continues to run.</p></div>
          <div className="source-alert-actions"><button type="button" autoFocus onClick={() => closePopup("unauthorizedBreak")}>Return to Exam</button></div>
        </section>
      ) : null}

      {activePopup === "help" ? (
        <section id="helpContainer" className="source-help-container source-help-from-driver" role="dialog" aria-label="Help" aria-modal="false">
          <div className="source-help-handle">
            <h2>Exam Interface and Features</h2>
            <button className="source-help-close" type="button" aria-label="Close" title="Close" autoFocus onClick={() => closePopup("help")}><X aria-hidden="true" /></button>
          </div>
          <div className="source-help-content" tabIndex={0}>
            <div><h3>Exam Navigation</h3><table><tbody>
              <tr className="source-help-top"><td colSpan={2}>&nbsp;</td></tr>
              <tr><td><b>Question Status Panel</b></td><td>At the left of the screen, the Question Status Panel indicates your location within the exam section and displays information about the status of each question. A dot indicates an unanswered question. A flag indicates a question you have marked. A pencil indicates a question where you have left a note.</td></tr>
              <tr className="source-help-blue"><td><b>Previous/Next</b></td><td>Moves backward or forward one screen. The number on the left indicates the current question and the number on the right indicates the total number of questions in the current block.</td></tr>
              {isUsmle ? <tr><td><b>Lock</b></td><td>Locks your exam if you must take an unauthorized break during an exam section. This does not pause the exam timer.</td></tr> : null}
              <tr className="source-help-blue"><td><b>End Block</b></td><td>After completing all the questions in a block, you may click End Block to finalize your responses and proceed to the next block. You will not be able to return to a block after it has been ended.</td></tr>
            </tbody></table></div>
            <div><h3>Managing Time</h3><table><tbody>
              <tr><td><b>Block Time Remaining</b></td><td>Maximum time remaining to complete the current block in which you are working.</td></tr>
              <tr className="source-help-blue"><td><b>Day Time Remaining</b></td><td>Maximum time remaining to complete the entire exam.</td></tr>
              <tr><td><b>Item Info Panel</b></td><td>Shows current item number and block. Clicking this panel displays an exam overview of the number of items and time allotted for all blocks.</td></tr>
              <tr className="source-help-blue"><td><b>Exam Overview</b></td><td>Displays the time allocated to complete each block in the exam including optional blocks, and whether or not the blocks have been completed.</td></tr>
              <tr><td><b>Timer Info Panel</b></td><td>Shows remaining Block Time and Day Time. Clicking this panel displays details of block and day timers.</td></tr>
            </tbody></table></div>
            <div><h3>Answering Questions</h3><p>As you navigate through the questions in your exam, you can select your choice of answer using the mouse or keyboard. You may change your answer at any time until you end the block. Once you have selected an answer you will not be able to return the item to its original unanswered state.</p></div>
            <div><h3>Highlight, Strike Out, and Other Features</h3>
              <p><b>Highlight:</b> Left click-and-drag on text in the question to highlight text. Click highlighted text to remove highlighting.</p>
              <p><b>Strikeout:</b> The strikeout button is enabled by default and can be turned off through Show/Hide Strikeout. Click the button or right click an option to add or remove strikeout. Strikeout is removed if the option is selected as the answer.</p>
              <p><b>Mark Question:</b> Mark an item to review later if time allows.</p>
              <p><b>Notes:</b> Add a note to an item. Saved notes display a pencil on the navigation bar.</p>
              <p><b>Image Invert:</b> Inverts the colors of images.</p><p><b>Image Contrast:</b> Adjusts the contrast of images.</p><p><b>Image Magnification:</b> Allows full-screen magnification of images.</p>
            </div>
            <div><h3>Exiting a Block</h3><p>If there is time remaining, and you wish to end a block, click the End Block button. Once you end a block, you will not be able to revisit the questions or change the answers that you have entered.</p><p><b>When Time Runs Out:</b> If a question is on your screen when allocated time runs out, and you have answered that question, your answer will be recorded. You will not be allowed to answer additional questions in that block.</p></div>
            <div><h3>Settings</h3><table><tbody>
              <tr className="source-help-top"><td><b>Settings</b></td><td>Opens the menu to access the settings detailed below.</td></tr>
              <tr><td><b>Resize Text</b></td><td>Resizes the text of the exam interface and questions.</td></tr>
              <tr className="source-help-blue"><td><b>Color Theme</b></td><td>Switches between the default color theme and a dark theme.</td></tr>
              <tr><td><b>Show/Hide Strikeout</b></td><td>When enabled, displays a strikeout icon next to each answer option.</td></tr>
              <tr className="source-help-blue"><td><b>Help</b></td><td>Review the information presented in this tutorial for interacting with the exam.</td></tr>
            </tbody></table></div>
          </div>
        </section>
      ) : null}
    </>
  );
};
