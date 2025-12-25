import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { availableExams, ExamData } from "@/data/exams";
import { StartScreen } from "@/components/StartScreen";
import { ExamHeader } from "@/components/ExamHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionNav } from "@/components/QuestionNav";
import { ExamControls } from "@/components/ExamControls";
import { ExamSummary } from "@/components/ExamSummary";

type ExamMode = "start" | "timed" | "practice" | "complete" | "review";

// Section configuration - 50 questions per section, 1 hour each
const QUESTIONS_PER_SECTION = 50;
const SECTION_TIME_LIMIT = 60 * 60; // 1 hour in seconds

const Index = () => {
  const [selectedExam, setSelectedExam] = useState<ExamData>(availableExams[0]);
  const [mode, setMode] = useState<ExamMode>("start");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(SECTION_TIME_LIMIT);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Section state
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  
  // Toolbar features state
  const [notes, setNotes] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  
  // Strikethrough state - stores "questionId-optionLabel" strings
  const [strikethroughs, setStrikethroughs] = useState<Set<string>>(new Set());

  const questions = selectedExam.questions;
  const totalQuestions = questions.length;
  const totalSections = Math.ceil(totalQuestions / QUESTIONS_PER_SECTION);
  
  // Calculate section boundaries
  const sectionInfo = useMemo(() => {
    const sectionStart = (currentSection - 1) * QUESTIONS_PER_SECTION + 1;
    const sectionEnd = Math.min(currentSection * QUESTIONS_PER_SECTION, totalQuestions);
    return { sectionStart, sectionEnd, questionsInSection: sectionEnd - sectionStart + 1 };
  }, [currentSection, totalQuestions]);
  
  // Get current question data
  const question = questions.find((q) => q.id === currentQuestion) || questions[0];
  
  // Check if current question is within allowed section (for timed mode)
  const isQuestionAccessible = useCallback((questionNum: number) => {
    if (mode !== "timed") return true;
    const questionSection = Math.ceil(questionNum / QUESTIONS_PER_SECTION);
    return questionSection === currentSection || completedSections.has(questionSection);
  }, [mode, currentSection, completedSections]);

  // Dark mode effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Timer effect - per section in timed mode
  useEffect(() => {
    if (mode !== "timed") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Section time expired - auto-complete section
          if (currentSection < totalSections) {
            handleEndSection();
          } else {
            setMode("complete");
          }
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, currentSection, totalSections]);

  // Track time in practice mode
  useEffect(() => {
    if (mode !== "practice") return;

    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const handleSelectExam = useCallback((examId: string) => {
    const exam = availableExams.find((e) => e.id === examId);
    if (exam) {
      setSelectedExam(exam);
      setTimeRemaining(SECTION_TIME_LIMIT);
    }
  }, []);

  const handleStart = useCallback(() => {
    setMode("timed");
    setCurrentQuestion(1);
    setCurrentSection(1);
    setCompletedSections(new Set());
    setAnswers({});
    setFlagged(new Set());
    setShowExplanation(false);
    setTimeRemaining(SECTION_TIME_LIMIT);
    setTimeSpent(0);
    setNotes("");
    setStrikethroughs(new Set());
  }, []);

  const handlePractice = useCallback(() => {
    setMode("practice");
    setCurrentQuestion(1);
    setCurrentSection(1);
    setCompletedSections(new Set());
    setAnswers({});
    setFlagged(new Set());
    setShowExplanation(false);
    setTimeRemaining(999 * 60);
    setTimeSpent(0);
    setNotes("");
    setStrikethroughs(new Set());
  }, []);
  
  // End current section and move to next
  const handleEndSection = useCallback(() => {
    setCompletedSections((prev) => new Set([...prev, currentSection]));
    
    if (currentSection < totalSections) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setCurrentQuestion((nextSection - 1) * QUESTIONS_PER_SECTION + 1);
      setTimeRemaining(SECTION_TIME_LIMIT);
      setShowExplanation(false);
    } else {
      setMode("complete");
    }
  }, [currentSection, totalSections]);

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
    // In timed mode, can only navigate within current section
    if (mode === "timed") {
      if (currentQuestion < sectionInfo.sectionEnd) {
        setCurrentQuestion((prev) => prev + 1);
        setShowExplanation(false);
      }
      // At section end, user must use End Block to proceed
    } else {
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion((prev) => prev + 1);
        setShowExplanation(false);
      } else {
        setMode("complete");
      }
    }
  }, [currentQuestion, totalQuestions, mode, sectionInfo.sectionEnd]);

  const handlePrevious = useCallback(() => {
    // In timed mode, can only navigate within current section
    if (mode === "timed") {
      if (currentQuestion > sectionInfo.sectionStart) {
        setCurrentQuestion((prev) => prev - 1);
        setShowExplanation(false);
      }
    } else {
      if (currentQuestion > 1) {
        setCurrentQuestion((prev) => prev - 1);
        setShowExplanation(false);
      }
    }
  }, [currentQuestion, mode, sectionInfo.sectionStart]);

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
    // In timed mode, only allow navigation within current section
    if (mode === "timed") {
      if (questionNumber >= sectionInfo.sectionStart && questionNumber <= sectionInfo.sectionEnd) {
        setCurrentQuestion(questionNumber);
        setShowExplanation(false);
      }
    } else {
      setCurrentQuestion(questionNumber);
      setShowExplanation(false);
    }
  }, [mode, sectionInfo.sectionStart, sectionInfo.sectionEnd]);

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
    setCurrentSection(1);
    setCompletedSections(new Set());
    setAnswers({});
    setFlagged(new Set());
    setShowExplanation(false);
    setTimeRemaining(SECTION_TIME_LIMIT);
    setTimeSpent(0);
    setNotes("");
    setStrikethroughs(new Set());
  }, []);

  const handleReview = useCallback(() => {
    setMode("review");
    setCurrentQuestion(1);
    setShowExplanation(true);
  }, []);

  const handleEndBlock = useCallback(() => {
    if (mode === "timed" && currentSection < totalSections) {
      handleEndSection();
    } else {
      setMode("complete");
    }
  }, [mode, currentSection, totalSections, handleEndSection]);

  const handleToggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const handleToggleStrikethrough = useCallback((optionLabel: string) => {
    const key = `${currentQuestion}-${optionLabel}`;
    setStrikethroughs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, [currentQuestion]);

  // Start Screen
  if (mode === "start") {
    return (
      <StartScreen
        exams={availableExams}
        selectedExam={selectedExam}
        onSelectExam={handleSelectExam}
        onStart={handleStart}
        onPractice={handlePractice}
      />
    );
  }

  // Summary Screen
  if (mode === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <ExamSummary
          questions={questions}
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
        notes={notes}
        onNotesChange={setNotes}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onEndBlock={handleEndBlock}
        showTimer={mode === "timed"}
        currentSection={currentSection}
        totalSections={totalSections}
        sectionStart={sectionInfo.sectionStart}
        sectionEnd={sectionInfo.sectionEnd}
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
                fontSize={fontSize}
                strikethroughs={strikethroughs}
                onToggleStrikethrough={handleToggleStrikethrough}
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
            <div className="sticky top-20">
              <QuestionNav
                totalQuestions={totalQuestions}
                currentQuestion={currentQuestion}
                answers={answers}
                flagged={flagged}
                onNavigate={handleNavigate}
                sectionStart={sectionInfo.sectionStart}
                sectionEnd={sectionInfo.sectionEnd}
                currentSection={currentSection}
                totalSections={totalSections}
                isTimed={mode === "timed"}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
