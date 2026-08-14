import { Flag, Pencil } from "lucide-react";

interface QuestionStatusPanelProps {
  sectionStart: number;
  sectionEnd: number;
  currentQuestion: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  notes: Record<number, string>;
  onNavigate: (questionNumber: number) => void;
}

export const QuestionStatusPanel = ({
  sectionStart,
  sectionEnd,
  currentQuestion,
  answers,
  flagged,
  notes,
  onNavigate,
}: QuestionStatusPanelProps) => {
  const items = Array.from(
    { length: Math.max(sectionEnd - sectionStart + 1, 0) },
    (_, index) => sectionStart + index
  );

  return (
    <aside className="classic-status-panel" aria-label="Question Status">
      <div className="classic-status-title">
        <span>Question Status</span>
        <span aria-hidden="true">ⓘ</span>
      </div>
      <div className="classic-status-list">
        {items.map((questionNumber) => {
          const displayNumber = questionNumber - sectionStart + 1;
          const isCurrent = questionNumber === currentQuestion;
          const isAnswered = answers[questionNumber] !== undefined;
          const isFlagged = flagged.has(questionNumber);
          const note = notes[questionNumber]?.trim() || "";

          return (
            <button
              key={questionNumber}
              type="button"
              className={`classic-status-item ${isCurrent ? "is-current" : ""} ${isAnswered ? "is-answered" : ""}`}
              onClick={() => onNavigate(questionNumber)}
              aria-current={isCurrent ? "true" : undefined}
              title={`Item ${displayNumber}${isAnswered ? ", answered" : ", unanswered"}${isFlagged ? ", marked" : ""}${note ? `, note: ${note}` : ""}`}
            >
              <span className="classic-status-dot" aria-hidden="true" />
              <span>{displayNumber}</span>
              <span className="classic-status-icons" aria-hidden="true">
                <span className="classic-status-icon-slot">
                  {note ? <Pencil className="classic-status-note" /> : null}
                </span>
                <span className="classic-status-icon-slot">
                  {isFlagged ? <Flag className="classic-status-flag" /> : null}
                </span>
              </span>
            </button>
          );
        })}
        <div className="classic-status-key">Key</div>
      </div>
    </aside>
  );
};
