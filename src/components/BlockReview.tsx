import { useMemo, useState } from "react";
import { Flag } from "lucide-react";

type ReviewFilter = "all" | "marked" | "incomplete";

interface BlockReviewProps {
  sectionStart: number;
  sectionEnd: number;
  currentQuestion: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onNavigate: (questionNumber: number) => void;
  onReturn: () => void;
  onEndBlock: () => void;
}

export const BlockReview = ({
  sectionStart,
  sectionEnd,
  currentQuestion,
  answers,
  flagged,
  onNavigate,
  onReturn,
  onEndBlock,
}: BlockReviewProps) => {
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [showEndDialog, setShowEndDialog] = useState(false);

  const items = useMemo(
    () => Array.from({ length: sectionEnd - sectionStart + 1 }, (_, index) => sectionStart + index),
    [sectionStart, sectionEnd]
  );

  const incompleteCount = items.filter((question) => answers[question] === undefined).length;
  const markedCount = items.filter((question) => flagged.has(question)).length;

  const visibleItems = items.filter((question) => {
    if (filter === "marked") return flagged.has(question);
    if (filter === "incomplete") return answers[question] === undefined;
    return true;
  });

  const openItem = (question: number) => {
    onNavigate(question);
    onReturn();
  };

  return (
    <section className="classic-review-screen" aria-labelledby="review-title">
      <div className="classic-review-heading">
        <h2 id="review-title">Review</h2>
        <p>Select an item to return to it. Marked and incomplete items are identified below.</p>
      </div>

      <div className="classic-review-summary" role="group" aria-label="Review filters">
        <button
          type="button"
          className={filter === "all" ? "is-active" : ""}
          onClick={() => setFilter("all")}
        >
          Review All <strong>{items.length}</strong>
        </button>
        <button
          type="button"
          className={filter === "marked" ? "is-active" : ""}
          onClick={() => setFilter("marked")}
        >
          Review Marked <strong>{markedCount}</strong>
        </button>
        <button
          type="button"
          className={filter === "incomplete" ? "is-active" : ""}
          onClick={() => setFilter("incomplete")}
        >
          Review Incomplete <strong>{incompleteCount}</strong>
        </button>
      </div>

      <div className="classic-review-table" role="table" aria-label="Block item status">
        <div className="classic-review-row classic-review-row-header" role="row">
          <span role="columnheader">Item</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Marked</span>
        </div>

        {visibleItems.length > 0 ? visibleItems.map((question) => {
          const answered = answers[question] !== undefined;
          const marked = flagged.has(question);
          const itemNumber = question - sectionStart + 1;

          return (
            <button
              type="button"
              role="row"
              key={question}
              className={`classic-review-row classic-review-item ${question === currentQuestion ? "is-current" : ""}`}
              onClick={() => openItem(question)}
            >
              <span role="cell">{itemNumber}</span>
              <span role="cell">{answered ? "Complete" : "Incomplete"}</span>
              <span role="cell" className="classic-review-mark-cell">
                {marked ? <><Flag size={13} fill="currentColor" /> Marked</> : ""}
              </span>
            </button>
          );
        }) : (
          <div className="classic-review-empty">No items match this review filter.</div>
        )}
      </div>

      <div className="classic-review-actions">
        <button type="button" onClick={onReturn}>Return to Questions</button>
        <button type="button" className="classic-primary-action" onClick={() => setShowEndDialog(true)}>End Block</button>
      </div>

      {showEndDialog ? (
        <div className="classic-modal-backdrop" role="presentation" onMouseDown={() => setShowEndDialog(false)}>
          <section className="classic-modal classic-end-dialog" role="alertdialog" aria-modal="true" aria-labelledby="review-end-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="classic-modal-titlebar" id="review-end-title">End Block</div>
            <div className="classic-modal-body">
              <p>Are you sure you want to end this block?</p>
              <p>You have <strong>{incompleteCount}</strong> incomplete item{incompleteCount === 1 ? "" : "s"} and <strong>{markedCount}</strong> marked item{markedCount === 1 ? "" : "s"}.</p>
              <p>After the block is ended, you will not be able to return to these items.</p>
            </div>
            <div className="classic-modal-actions">
              <button type="button" onClick={() => setShowEndDialog(false)}>Return to Review</button>
              <button type="button" className="classic-primary-action" onClick={onEndBlock}>End Block</button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
};
