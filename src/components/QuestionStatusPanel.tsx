interface QuestionStatusPanelProps {
  sectionStart: number;
  sectionEnd: number;
  currentQuestion: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onNavigate: (questionNumber: number) => void;
}

export const QuestionStatusPanel = ({
  sectionStart,
  sectionEnd,
  currentQuestion,
  answers,
  flagged,
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

          return (
            <button
              key={questionNumber}
              type="button"
              className={`classic-status-item ${isCurrent ? "is-current" : ""} ${isAnswered ? "is-answered" : ""}`}
              onClick={() => onNavigate(questionNumber)}
              aria-current={isCurrent ? "true" : undefined}
              title={`Item ${displayNumber}${isAnswered ? ", answered" : ", unanswered"}${isFlagged ? ", marked" : ""}`}
            >
              <span className="classic-status-dot" aria-hidden="true" />
              <span>{displayNumber}</span>
              <span className="classic-status-flag" aria-hidden="true">{isFlagged ? "⚑" : ""}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
