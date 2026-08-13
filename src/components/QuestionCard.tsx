import { useEffect, useMemo, useRef, useState } from "react";
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

type ImageTool = "invert" | "contrast" | null;

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
  const [activeImageTool, setActiveImageTool] = useState<ImageTool>(null);
  const [invertValue, setInvertValue] = useState(-100);
  const [contrastValue, setContrastValue] = useState(0);
  const [invertEnabled, setInvertEnabled] = useState(false);
  const [contrastEnabled, setContrastEnabled] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showZoom) {
        setShowZoom(false);
        setZoomLevel(1);
        return;
      }
      setActiveImageTool(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showZoom]);

  useEffect(() => {
    setShowZoom(false);
    setZoomLevel(1);
    setActiveImageTool(null);
    setInvertValue(-100);
    setContrastValue(0);
    setInvertEnabled(false);
    setContrastEnabled(false);
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

  const invertPercent = invertEnabled ? ((invertValue + 100) / 200) * 100 : 0;
  const contrastPercent = contrastEnabled ? contrastValue + 100 : 100;
  const imageFilter = `invert(${invertPercent}%) contrast(${contrastPercent}%)`;

  const resetInvert = () => {
    setInvertValue(-100);
    setInvertEnabled(false);
  };

  const resetContrast = () => {
    setContrastValue(0);
    setContrastEnabled(false);
  };

  const openZoom = () => {
    // The real driver does not leave Settings/other header panels floating over the image viewer.
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    setActiveImageTool(null);
    setZoomLevel(1);
    setShowZoom(true);
  };

  const zoomIn = () => setZoomLevel((value) => Math.min(4, Number((value + 0.25).toFixed(2))));
  const zoomOut = () => setZoomLevel((value) => Math.max(0.25, Number((value - 0.25).toFixed(2))));

  const renderSlider = (tool: Exclude<ImageTool, null>) => {
    const isInvert = tool === "invert";
    const value = isInvert ? invertValue : contrastValue;
    const enabled = isInvert ? invertEnabled : contrastEnabled;
    const setValue = isInvert ? setInvertValue : setContrastValue;
    const setEnabled = isInvert ? setInvertEnabled : setContrastEnabled;
    const reset = isInvert ? resetInvert : resetContrast;

    return (
      <div className={`source-image-slider source-image-slider-${tool}`}>
        <div className="source-image-slider-title">{isInvert ? "Invert" : "Contrast"}</div>
        <div className="source-image-slider-track-wrap">
          <input
            aria-label={`${isInvert ? "Invert" : "Contrast"} adjustment`}
            type="range"
            min="-100"
            max="100"
            step="1"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </div>
        <label className="source-image-slider-toggle">
          On/Off
          <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        </label>
        <button type="button" className="source-image-slider-reset" onClick={reset}>Reset</button>
      </div>
    );
  };

  return (
    <>
      <motion.div
        key={question.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.08 }}
        className="classic-question-card"
      >
        <label className={`classic-question-mark ${isFlagged ? "is-marked" : ""}`}>
          <input type="checkbox" checked={isFlagged} onChange={() => onFlag?.()} aria-label="Mark question" />
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
            {question.image ? (
              <figure className="classic-question-image">
                <div className="classic-image-frame source-media-gallery">
                  <div className="classic-image-tools" aria-label="Image tools">
                    <div className="source-image-tool-wrap">
                      <button
                        type="button"
                        className={activeImageTool === "invert" ? "is-active" : ""}
                        aria-pressed={activeImageTool === "invert"}
                        onClick={() => setActiveImageTool((value) => value === "invert" ? null : "invert")}
                        title="Invert"
                      >
                        <span className="classic-invert-icon" aria-hidden="true" />
                        <span>Invert</span>
                      </button>
                      {activeImageTool === "invert" ? renderSlider("invert") : null}
                    </div>

                    <div className="source-image-tool-wrap">
                      <button
                        type="button"
                        className={activeImageTool === "contrast" ? "is-active" : ""}
                        aria-pressed={activeImageTool === "contrast"}
                        onClick={() => setActiveImageTool((value) => value === "contrast" ? null : "contrast")}
                        title="Contrast"
                      >
                        <Contrast size={28} strokeWidth={1.8} />
                        <span>Contrast</span>
                      </button>
                      {activeImageTool === "contrast" ? renderSlider("contrast") : null}
                    </div>

                    <button type="button" onClick={openZoom} title="Zoom">
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
                {question.imageCaption ? <figcaption>{question.imageCaption}</figcaption> : null}
              </figure>
            ) : null}
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
          <div className="classic-proceed-row">
            <button type="button" className="classic-proceed-button" onClick={onNext}>Proceed to Next Item</button>
          </div>
        ) : null}

        {showExplanation ? (
          <div className={`classic-explanation ${isCorrect ? "correct" : "incorrect"}`}>
            <strong>{isCorrect ? "Correct" : `Correct answer: ${question.correctAnswer}`}</strong>
            <p>{question.explanation}</p>
            <p><strong>Educational Objective:</strong> {question.educationalObjective}</p>
          </div>
        ) : null}
      </motion.div>

      {showZoom && question.image ? (
        <section className="source-image-viewer" role="dialog" aria-modal="false" aria-label="Magnified image">
          <div className="source-viewer-toolbar" role="group" aria-label="Image zoom controls">
            <button type="button" onClick={zoomIn} disabled={zoomLevel >= 4}>Zoom In</button>
            <button type="button" onClick={zoomOut} disabled={zoomLevel <= 0.25}>Zoom Out</button>
            <button type="button" onClick={() => setZoomLevel(1)}>Reset</button>
          </div>
          <button type="button" className="source-viewer-close" onClick={() => setShowZoom(false)} aria-label="Close magnified image">
            <span className="source-viewer-close-icon"><X size={30} /></span>
            <span>Close</span>
          </button>
          <div className="source-viewer-canvas">
            <div className="source-viewer-image-wrap" style={{ width: `${zoomLevel * 100}%`, height: `${zoomLevel * 100}%` }}>
              <img src={question.image} alt={question.imageCaption || "Magnified question image"} style={{ filter: imageFilter }} draggable={false} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
