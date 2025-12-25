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
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Question Stem */}
      <div className="mb-6 rounded-xl bg-question-bg p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {question.id}
          </span>
          <p 
            className="font-clinical leading-relaxed text-foreground"
            style={{ fontSize: `${fontSize}px` }}
          >
            {question.stem}
          </p>
        </div>
      </div>

      {/* Strikethrough hint */}
      {!showExplanation && (
        <p className="text-xs text-muted-foreground mb-3 text-center">
          Right-click an answer to strike it out
        </p>
      )}

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <motion.div
            key={option.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <OptionButton
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
          </motion.div>
        ))}
      </div>

      {/* Explanation Panel */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden"
        >
          <div
            className={`rounded-xl p-6 md:p-8 border-2 ${
              isCorrect
                ? "bg-option-correct border-success/30"
                : "bg-option-incorrect border-destructive/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isCorrect
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
              {!isCorrect && (
                <span className="text-sm text-muted-foreground">
                  Correct answer: <strong>{question.correctAnswer}</strong>
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Explanation</h4>
                <p 
                  className="font-clinical text-foreground/90 leading-relaxed whitespace-pre-line"
                  style={{ fontSize: `${fontSize - 2}px` }}
                >
                  {question.explanation}
                </p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  Educational Objective
                </h4>
                <p 
                  className="font-clinical text-foreground/80 leading-relaxed"
                  style={{ fontSize: `${fontSize - 2}px` }}
                >
                  {question.educationalObjective}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
