import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { examQuestions, examInfo } from "@/data/examQuestions";
import { StartScreen } from "@/components/StartScreen";
import { ExamHeader } from "@/components/ExamHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionNav } from "@/components/QuestionNav";
import { ExamControls } from "@/components/ExamControls";
import { ExamSummary } from "@/components/ExamSummary";

type ExamMode = "start" | "timed" | "practice" | "complete" | "review";

const Index = () => {
  const [mode, setMode] = useState<ExamMode>("start");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(examInfo.timeLimit * 60);
  const [timeSpent, setTimeSpent] = useState(0);

  const question = examQuestions.find((q) => q.id === currentQuestion) || examQuestions[0];
  const totalQuestions = examQuestions.length;

  // Timer effect
  useEffect(() => {
    if (mode !== "timed") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setMode("complete");
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  // Track time in practice mode
  useEffect(() => {
    if (mode !== "practice") return;

    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const handleStart = useCallback(() => {
    setMode("timed");
    setCurrentQuestion(1);
    setAnswers({});
    setFlagged(new Set());
    setShowExplanation(false);
    setTimeRemaining(examInfo.timeLimit * 60);
    setTimeSpent(0);
  }, []);

  const handlePractice = useCallback(() => {
    setMode("practice");
    setCurrentQuestion(1);
    setAnswers({});
    setFlagged(new Set());
    setShowExplanation(false);
    setTimeRemaining(999 * 60); // Unlimited time
    setTimeSpent(0);
  }, []);

  const handleSelectAnswer = useCallback((answer: string) => {
    if (showExplanation) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
  }, [currentQuestion, showExplanation]);

  const handleShowAnswer = useCallback(() => {
    setShowExplanation(true);
  }, []);

  const handleSubmit = useCallback(() => {
    setShowExplanation(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      setMode("complete");
    }
  }, [currentQuestion, totalQuestions]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1);
      setShowExplanation(false);
    }
  }, [currentQuestion]);

  const handleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion)) {
        next.delete(currentQuestion);
      } else {
        next.add(currentQuestion);
      }
      return next;
    });
  }, [currentQuestion]);

  const handleNavigate = useCallback((questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    setShowExplanation(false);
  }, []);

  const handleReset = useCallback(() => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion];
      return next;
    });
    setShowExplanation(false);
  }, [currentQuestion]);

  const handleRestart = useCallback(() => {
    setMode("start");
    setCurrentQuestion(1);
    setAnswers({});
    setFlagged(new Set());
    setShowExplanation(false);
    setTimeRemaining(examInfo.timeLimit * 60);
    setTimeSpent(0);
  }, []);

  const handleReview = useCallback(() => {
    setMode("review");
    setCurrentQuestion(1);
    setShowExplanation(true);
  }, []);

  // Start Screen
  if (mode === "start") {
    return (
      <StartScreen
        onStart={handleStart}
        onPractice={handlePractice}
        totalQuestions={totalQuestions}
        timeLimit={examInfo.timeLimit}
      />
    );
  }

  // Summary Screen
  if (mode === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <ExamSummary
          questions={examQuestions}
          answers={answers}
          timeSpent={timeSpent}
          onRestart={handleRestart}
          onReview={handleReview}
        />
      </div>
    );
  }

  // Exam / Review Mode
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background">
      <ExamHeader
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        timeRemaining={mode === "timed" ? timeRemaining : 999 * 60}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFlag={handleFlag}
        isFlagged={flagged.has(currentQuestion)}
        answeredCount={answeredCount}
      />

      <main className="container px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <QuestionCard
                key={currentQuestion}
                question={question}
                selectedAnswer={answers[currentQuestion] || null}
                showExplanation={showExplanation || mode === "review"}
                onSelectAnswer={handleSelectAnswer}
              />
            </AnimatePresence>

            {mode !== "review" && (
              <ExamControls
                hasAnswer={answers[currentQuestion] !== undefined}
                showExplanation={showExplanation}
                isLastQuestion={currentQuestion === totalQuestions}
                onShowAnswer={handleShowAnswer}
                onSubmit={handleSubmit}
                onNext={handleNext}
                onReset={handleReset}
              />
            )}

            {mode === "review" && (
              <div className="flex justify-center gap-3 pt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 1}
                  className="px-6 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleRestart}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Restart
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentQuestion === totalQuestions}
                  className="px-6 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-24">
              <QuestionNav
                totalQuestions={totalQuestions}
                currentQuestion={currentQuestion}
                answers={answers}
                flagged={flagged}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
