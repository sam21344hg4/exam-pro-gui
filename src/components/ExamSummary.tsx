import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, RotateCcw, BookOpen } from "lucide-react";
import { Question } from "@/data/examQuestions";

interface ExamSummaryProps {
  questions: Question[];
  answers: Record<number, string>;
  timeSpent: number;
  onRestart: () => void;
  onReview: () => void;
}

export const ExamSummary = ({
  questions,
  answers,
  timeSpent,
  onRestart,
  onReview,
}: ExamSummaryProps) => {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = () => {
    if (percentage >= 90) return { text: "Excellent!", color: "text-success" };
    if (percentage >= 80) return { text: "Great Job!", color: "text-secondary" };
    if (percentage >= 70) return { text: "Good Work", color: "text-primary" };
    if (percentage >= 60) return { text: "Keep Practicing", color: "text-warning" };
    return { text: "Needs Improvement", color: "text-destructive" };
  };

  const grade = getGrade();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/20 mb-4"
          >
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">
            Exam Complete!
          </h2>
          <p className={`text-lg font-semibold ${grade.color === "text-success" ? "text-primary-foreground" : grade.color}`}>
            {grade.text}
          </p>
        </div>

        {/* Stats */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-4 rounded-xl bg-question-bg"
            >
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold text-foreground">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-4 rounded-xl bg-question-bg"
            >
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <p className="text-3xl font-bold text-foreground">
                {correctAnswers}/{totalQuestions}
              </p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center p-4 rounded-xl bg-question-bg"
            >
              <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
              <p className="text-3xl font-bold text-foreground">
                {formatTime(timeSpent)}
              </p>
              <p className="text-sm text-muted-foreground">Time Spent</p>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Performance</span>
              <span className="font-medium text-foreground">{percentage}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  percentage >= 70 ? "bg-success" : percentage >= 50 ? "bg-warning" : "bg-destructive"
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onRestart}
              className="flex-1 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restart Exam
            </Button>
            <Button
              onClick={onReview}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              <BookOpen className="h-4 w-4" />
              Review Answers
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
