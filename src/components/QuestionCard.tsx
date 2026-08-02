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
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
  fontSize,
  strikethroughs,
  onToggleStrikethrough,
}: QuestionCardProps) => {
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="classic-question-card"
    >
      <div className="classic-question-stem" style={{ fontSize: `${Math.max(fontSize - 2, 15)}px` }}>
        <span className="classic-question-number">{question.id}.</span>
        <div>
          <p>{question.stem}</p>
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
