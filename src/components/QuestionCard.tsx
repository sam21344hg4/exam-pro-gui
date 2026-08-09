import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
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

  return (
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
              <img src={question.image} alt={question.imageCaption || "Question image"} />
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
  );
};
