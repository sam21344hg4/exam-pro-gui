import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Contrast, Search, X } from "lucide-react";
import { Question } from "@/data/examQuestions";
import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  showExplanation: boolean;
  onSelectAnswer: (answer: string) => void;
  fontSize: number;
  strikethroughs: Set<string>;
  onToggleStrikethrough: (optionLabel: string) => void;
  highlights?: string[];
  onAddHighlight?: (text: string) => void;
  onRemoveHighlight?: (text: string) => void;
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
  fontSize,
  strikethroughs,
  onToggleStrikethrough,
  highlights = [],
  onAddHighlight,
  onRemoveHighlight,
}: QuestionCardProps) => {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const stemRef = useRef<HTMLDivElement>(null);
  const [imageInverted, setImageInverted] = useState(false);
  const [imageContrast, setImageContrast] = useState(100);
  const [showContrast, setShowContrast] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    if (!showZoom) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowZoom(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showZoom]);

  const highlightedStem = useMemo(() => {
    if (highlights.length === 0) return question.stem;

    const unique = Array.from(new Set(highlights.filter(Boolean))).sort((a, b) => b.length - a.length);
    if (unique.length === 0) return question.stem;

    const escaped = unique.map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const matcher = new RegExp(`(${escaped.join("|")})`, "g");

    return question.stem.split(matcher).map((part, index) => {
      const matched = unique.find((value) => value === part);
      if (!matched) return <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>;
      return (
        <mark
          key={`${index}-${part.slice(0, 12)}`}
          className="classic-highlight"
          title="Click to remove highlight"
          onClick={(event) => {
            event.stopPropagation();
            onRemoveHighlight?.(matched);
          }}
        >
          {part}
        </mark>
      );
    });
  }, [question.stem, highlights, onRemoveHighlight]);

  const handleStemMouseUp = () => {
    if (!onAddHighlight || showExplanation) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !stemRef.current) return;

    const anchor = selection.anchorNode;
    const focus = selection.focusNode;
    if (!anchor || !focus || !stemRef.current.contains(anchor) || !stemRef.current.contains(focus)) return;

    const text = selection.toString().trim();
    if (text.length < 2 || text.length > 240) return;

    onAddHighlight(text);
    selection.removeAllRanges();
  };

  const imageFilter = `${imageInverted ? "invert(1) " : ""}contrast(${imageContrast}%)`;

  const resetImage = () => {
    setImageInverted(false);
    setImageContrast(100);
  };

  const zoomOverlay = showZoom && question.image
    ? createPortal(
        <div
          className="classic-image-zoom-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Magnified image"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowZoom(false);
          }}
          style={{ zIndex: 2147483000 }}
        >
          <button
            type="button"
            className="classic-image-zoom-close"
            onClick={() => setShowZoom(false)}
            aria-label="Close magnified image"
            style={{
              position: "fixed",
              top: 18,
              right: 22,
              zIndex: 2147483647,
              width: "auto",
              minWidth: 92,
              height: 38,
              padding: "0 14px",
              display: "inline-flex",
              flexDirection: "row",
              gap: 7,
              background: "#000",
              color: "#fff",
              border: "2px solid #fff",
              borderRadius: 0,
              font: "bold 12pt Arial, Helvetica, sans-serif",
              cursor: "pointer",
            }}
          >
            <X size={22} strokeWidth={3} />
            <span>CLOSE</span>
          </button>
          <img
            src={question.image}
            alt={question.imageCaption || "Magnified question image"}
            style={{ filter: imageFilter }}
            onMouseDown={(event) => event.stopPropagation()}
          />
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <motion.div
        key={question.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="classic-question-card"
      >
        <div
          ref={stemRef}
          className="classic-question-stem"
          style={{ fontSize: `${Math.max(fontSize - 2, 15)}px` }}
          onMouseUp={handleStemMouseUp}
        >
          <span className="classic-question-number">{question.id}.</span>
          <div>
            <p>{highlightedStem}</p>
            {question.image && (
              <figure className="classic-question-image">
                <div className="classic-image-frame">
                  <div className="classic-image-tools" aria-label="Image tools">
                    <button
                      type="button"
                      className={imageInverted ? "is-active" : ""}
                      onClick={() => setImageInverted((value) => !value)}
                      title="Invert image colors"
                    >
                      <span className="classic-invert-icon" aria-hidden="true" />
                      <span>Invert</span>
                    </button>

                    <div className="classic-image-tool-with-popover">
                      <button
                        type="button"
                        className={showContrast ? "is-active" : ""}
                        onClick={() => setShowContrast((value) => !value)}
                        title="Adjust image contrast"
                      >
                        <Contrast size={25} strokeWidth={2} />
                        <span>Contrast</span>
                      </button>
                      {showContrast ? (
                        <div className="classic-contrast-popover">
                          <label htmlFor={`contrast-${question.id}`}>Contrast</label>
                          <input
                            id={`contrast-${question.id}`}
                            type="range"
                            min="25"
                            max="200"
                            step="5"
                            value={imageContrast}
                            onChange={(event) => setImageContrast(Number(event.target.value))}
                            orient="vertical"
                          />
                          <div>{imageContrast}%</div>
                          <button type="button" onClick={resetImage}>Reset</button>
                        </div>
                      ) : null}
                    </div>

                    <button type="button" onClick={() => setShowZoom(true)} title="Magnify image">
                      <Search size={27} strokeWidth={2} />
                      <span>Zoom</span>
                    </button>
                  </div>

                  <div className="classic-image-canvas">
                    <img
                      src={question.image}
                      alt={question.imageCaption || "Question image"}
                      style={{ filter: imageFilter }}
                    />
                  </div>
                </div>
                {question.imageCaption && <figcaption>{question.imageCaption}</figcaption>}
              </figure>
            )}
          </div>
        </div>

        <div className="classic-options">
          {question.options.map((option) => (
            <OptionButton
              key={option.label}
              label={option.label}
              text={option.text}
              isSelected={selectedAnswer === option.label}
              isCorrect={option.label === question.correctAnswer}
              showResult={showExplanation}
              onClick={() => onSelectAnswer(option.label)}
              disabled={showExplanation}
              fontSize={fontSize}
              isStrikethrough={strikethroughs.has(`${question.id}-${option.label}`)}
              onToggleStrikethrough={() => onToggleStrikethrough(option.label)}
            />
          ))}
        </div>

        {showExplanation && (
          <div className={`classic-explanation ${isCorrect ? "correct" : "incorrect"}`}>
            <strong>{isCorrect ? "Correct" : `Correct answer: ${question.correctAnswer}`}</strong>
            <p>{question.explanation}</p>
            <p><strong>Educational Objective:</strong> {question.educationalObjective}</p>
          </div>
        )}
      </motion.div>
      {zoomOverlay}
    </>
  );
};
