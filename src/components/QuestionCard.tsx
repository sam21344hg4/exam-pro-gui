import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Contrast, Flag, Search, X } from "lucide-react";
import { Question } from "@/data/examQuestions";
import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  showExplanation: boolean;
  onSelectAnswer: (answer: string) => void;
  onNext?: () => void;
  fontSize: number;
  strikethroughs: Set<string>;
  onToggleStrikethrough: (optionLabel: string) => void;
  isFlagged?: boolean;
  onFlag?: () => void;
  highlights?: string[];
  onAddHighlight?: (text: string) => void;
  onRemoveHighlight?: (text: string) => void;
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
  onNext,
  fontSize,
  strikethroughs,
  onToggleStrikethrough,
  isFlagged = false,
  onFlag,
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
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!showZoom) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowZoom(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showZoom]);

  useEffect(() => {
    setShowZoom(false);
    setZoomLevel(1);
    setShowContrast(false);
  }, [question.id]);

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

  const openZoom = () => {
    setZoomLevel(1);
    setShowZoom(true);
  };

  const zoomIn = () => setZoomLevel((value) => Math.min(3, Number((value + 0.25).toFixed(2))));
  const zoomOut = () => setZoomLevel((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))));
  const resetZoom = () => setZoomLevel(1);

  const zoomOverlay = showZoom && question.image
    ? createPortal(
        <section
          className="classic-image-zoom-overlay"
          role="dialog"
          aria-modal="false"
          aria-label="Magnified image"
        >
          <div className="classic-image-zoom-toolbar">
            <div className="classic-image-zoom-controls" role="group" aria-label="Image zoom controls">
              <button type="button" onClick={zoomIn} disabled={zoomLevel >= 3}>Zoom In</button>
              <button type="button" onClick={zoomOut} disabled={zoomLevel <= 0.5}>Zoom Out</button>
              <button type="button" onClick={resetZoom} disabled={zoomLevel === 1}>Reset</button>
            </div>

            <button
              type="button"
              className="classic-image-zoom-close"
              onClick={() => setShowZoom(false)}
              aria-label="Close magnified image"
            >
              <span className="classic-image-zoom-close-icon"><X size={21} strokeWidth={2.5} /></span>
              <span>Close</span>
            </button>
          </div>

          <div className="classic-image-zoom-stage">
            <img
              className="classic-image-zoom-image"
              src={question.image}
              alt={question.imageCaption || "Magnified question image"}
              style={{
                filter: imageFilter,
                transform: `scale(${zoomLevel})`,
              }}
              draggable={false}
            />
          </div>
        </section>,
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
        <label className={`classic-question-mark ${isFlagged ? "is-marked" : ""}`}>
          <input
            type="checkbox"
            checked={isFlagged}
            onChange={() => onFlag?.()}
            aria-label="Mark question"
          />
          <Flag size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>Mark Question</span>
        </label>

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
                        <Contrast size={28} strokeWidth={1.8} />
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

                    <button type="button" onClick={openZoom} title="Magnify image">
                      <Search size={29} strokeWidth={1.8} />
                      <span>Zoom</span>
                    </button>
                  </div>

                  <div className="classic-image-canvas">
                    <img
                      src={question.image}
                      alt={question.imageCaption || "Question image"}
                      style={{ filter: imageFilter }}
                      draggable={false}
                    />
                  </div>
                </div>
                {question.imageCaption && <figcaption>{question.imageCaption}</figcaption>}
              </figure>
            )}
          </div>
        </div>

        <div className="classic-options" role="radiogroup" aria-label="Answer choices">
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

        {!showExplanation && onNext ? (
          <button type="button" className="classic-proceed-button" onClick={onNext}>
            Proceed to Next Item
          </button>
        ) : null}

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
