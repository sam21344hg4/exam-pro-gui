import { useCallback, useEffect, useMemo, useState } from "react";
import { availableExams, ExamData } from "@/data/exams";
import { StartScreen } from "@/components/StartScreen";
import { ExamHeader } from "@/components/ExamHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionStatusPanel } from "@/components/QuestionStatusPanel";
import { ExamSummary } from "@/components/ExamSummary";
import { BlockReview } from "@/components/BlockReview";

type ExamMode = "start" | "timed" | "practice" | "complete" | "review";

const QUESTIONS_PER_SECTION = 50;
const SECTION_TIME_LIMIT = 60 * 60;

const Index = () => {
  const [selectedExam, setSelectedExam] = useState<ExamData>(availableExams[0]);
  const [mode, setMode] = useState<ExamMode>("start");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(SECTION_TIME_LIMIT);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [strikethroughs, setStrikethroughs] = useState<Set<string>>(new Set());
  const [highlights, setHighlights] = useState<Record<number, string[]>>({});
  const [showBlockReview, setShowBlockReview] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const questions = selectedExam.questions;
  const totalQuestions = questions.length;
  const totalSections = Math.max(1, Math.ceil(totalQuestions / QUESTIONS_PER_SECTION));

  const displayedSection = mode === "timed"
    ? currentSection
    : Math.min(totalSections, Math.max(1, Math.ceil(currentQuestion / QUESTIONS_PER_SECTION)));

  const sectionInfo = useMemo(() => {
    const sectionStart = (displayedSection - 1) * QUESTIONS_PER_SECTION + 1;
    const sectionEnd = Math.min(displayedSection * QUESTIONS_PER_SECTION, totalQuestions);
    return { sectionStart, sectionEnd };
  }, [displayedSection, totalQuestions]);

  const question = questions.find((item) => item.id === currentQuestion) || questions[0];

  const sectionQuestions = useMemo(
    () => Array.from(
      { length: Math.max(sectionInfo.sectionEnd - sectionInfo.sectionStart + 1, 0) },
      (_, index) => sectionInfo.sectionStart + index
    ),
    [sectionInfo.sectionStart, sectionInfo.sectionEnd]
  );

  const answeredInSection = sectionQuestions.filter((number) => answers[number] !== undefined).length;
  const markedInSection = sectionQuestions.filter((number) => flagged.has(number)).length;

  const resetSessionState = useCallback(() => {
    setCurrentQuestion(1);
    setCurrentSection(1);
    setAnswers({});
    setFlagged(new Set());
    setShowExplanation(false);
    setTimeRemaining(SECTION_TIME_LIMIT);
    setTimeSpent(0);
    setStrikethroughs(new Set());
    setHighlights({});
    setShowBlockReview(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (mode !== "timed" || isPaused) return;

    const interval = window.setInterval(() => {
      setTimeRemaining((previous) => Math.max(previous - 1, 0));
      setTimeSpent((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mode, isPaused]);

  useEffect(() => {
    if (mode !== "timed" || timeRemaining > 0) return;

    if (currentSection < totalSections) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setCurrentQuestion((nextSection - 1) * QUESTIONS_PER_SECTION + 1);
      setTimeRemaining(SECTION_TIME_LIMIT);
      setShowExplanation(false);
      setShowBlockReview(false);
    } else {
      setMode("complete");
    }
  }, [mode, timeRemaining, currentSection, totalSections]);

  useEffect(() => {
    if (mode !== "practice" || isPaused) return;
    const interval = window.setInterval(() => setTimeSpent((previous) => previous + 1), 1000);
    return () => window.clearInterval(interval);
  }, [mode, isPaused]);

  const handleSelectExam = useCallback((examId: string) => {
    const exam = availableExams.find((item) => item.id === examId);
    if (exam) setSelectedExam(exam);
  }, []);

  const handleStart = useCallback(() => {
    resetSessionState();
    setMode("timed");
  }, [resetSessionState]);

  const handlePractice = useCallback(() => {
    resetSessionState();
    setMode("practice");
  }, [resetSessionState]);

  const handleEndSection = useCallback(() => {
    setShowBlockReview(false);
    setIsPaused(false);

    if (currentSection < totalSections) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setCurrentQuestion((nextSection - 1) * QUESTIONS_PER_SECTION + 1);
      setTimeRemaining(SECTION_TIME_LIMIT);
      setShowExplanation(false);
      window.scrollTo({ top: 0 });
    } else {
      setMode("complete");
    }
  }, [currentSection, totalSections]);

  const handleEndBlock = useCallback(() => {
    if (mode === "timed") {
      handleEndSection();
    } else {
      setMode("complete");
      setShowBlockReview(false);
    }
  }, [mode, handleEndSection]);

  const handleSelectAnswer = useCallback((answer: string) => {
    if (mode === "review" || showExplanation) return;

    const strikeKey = `${currentQuestion}-${answer}`;
    setStrikethroughs((previous) => {
      if (!previous.has(strikeKey)) return previous;
      const next = new Set(previous);
      next.delete(strikeKey);
      return next;
    });

    setAnswers((previous) => ({ ...previous, [currentQuestion]: answer }));
    if (mode === "practice") setShowExplanation(true);
  }, [currentQuestion, mode, showExplanation]);

  const handleNext = useCallback(() => {
    if (showBlockReview) return;

    if (mode === "timed") {
      if (currentQuestion < sectionInfo.sectionEnd) {
        setCurrentQuestion((previous) => previous + 1);
        setShowExplanation(false);
      } else {
        setShowBlockReview(true);
      }
      return;
    }

    if (currentQuestion < totalQuestions) {
      setCurrentQuestion((previous) => previous + 1);
      setShowExplanation(mode === "review");
    } else if (mode !== "review") {
      setMode("complete");
    }
  }, [showBlockReview, mode, currentQuestion, sectionInfo.sectionEnd, totalQuestions]);

  const handlePrevious = useCallback(() => {
    if (showBlockReview) return;

    const lowerBound = mode === "timed" ? sectionInfo.sectionStart : 1;
    if (currentQuestion > lowerBound) {
      setCurrentQuestion((previous) => previous - 1);
      setShowExplanation(mode === "review");
    }
  }, [showBlockReview, mode, currentQuestion, sectionInfo.sectionStart]);

  const handleFlag = useCallback(() => {
    setFlagged((previous) => {
      const next = new Set(previous);
      if (next.has(currentQuestion)) next.delete(currentQuestion);
      else next.add(currentQuestion);
      return next;
    });
  }, [currentQuestion]);

  const handleNavigate = useCallback((questionNumber: number) => {
    const lower = mode === "timed" ? sectionInfo.sectionStart : 1;
    const upper = mode === "timed" ? sectionInfo.sectionEnd : totalQuestions;
    if (questionNumber < lower || questionNumber > upper) return;
    setCurrentQuestion(questionNumber);
    setShowExplanation(mode === "review");
    window.scrollTo({ top: 0 });
  }, [mode, sectionInfo.sectionStart, sectionInfo.sectionEnd, totalQuestions]);

  const handleToggleStrikethrough = useCallback((optionLabel: string) => {
    const key = `${currentQuestion}-${optionLabel}`;
    const willStrike = !strikethroughs.has(key);

    setStrikethroughs((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

    if (willStrike) {
      setAnswers((previous) => {
        if (previous[currentQuestion] !== optionLabel) return previous;
        const next = { ...previous };
        delete next[currentQuestion];
        return next;
      });
    }
  }, [currentQuestion, strikethroughs]);

  const handleAddHighlight = useCallback((text: string) => {
    setHighlights((previous) => {
      const existing = previous[currentQuestion] || [];
      if (existing.includes(text)) return previous;
      return { ...previous, [currentQuestion]: [...existing, text] };
    });
  }, [currentQuestion]);

  const handleRemoveHighlight = useCallback((text: string) => {
    setHighlights((previous) => {
      const nextValues = (previous[currentQuestion] || []).filter((value) => value !== text);
      if (nextValues.length === 0) {
        const next = { ...previous };
        delete next[currentQuestion];
        return next;
      }
      return { ...previous, [currentQuestion]: nextValues };
    });
  }, [currentQuestion]);

  const handleRestart = useCallback(() => {
    resetSessionState();
    setMode("start");
  }, [resetSessionState]);

  const handlePostExamReview = useCallback(() => {
    setMode("review");
    setCurrentQuestion(1);
    setCurrentSection(1);
    setShowExplanation(true);
    setShowBlockReview(false);
    setIsPaused(false);
  }, []);

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

  if (mode === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <ExamSummary
          questions={questions}
          answers={answers}
          timeSpent={timeSpent}
          onRestart={handleRestart}
          onReview={handlePostExamReview}
        />
      </div>
    );
  }

  const timedLowerBound = sectionInfo.sectionStart;
  const timedUpperBound = sectionInfo.sectionEnd;
  const canPrevious = !showBlockReview && currentQuestion > (mode === "timed" ? timedLowerBound : 1);
  const canNext = !showBlockReview && (
    mode === "timed" ? currentQuestion <= timedUpperBound : currentQuestion < totalQuestions
  );

  return (
    <div className="classic-exam-shell">
      <ExamHeader
        currentQuestion={currentQuestion}
        timeRemaining={timeRemaining}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFlag={handleFlag}
        isFlagged={flagged.has(currentQuestion)}
        onEndBlock={handleEndBlock}
        onReview={() => setShowBlockReview(true)}
        onPause={() => setIsPaused(true)}
        showTimer={mode === "timed"}
        currentSection={displayedSection}
        sectionStart={sectionInfo.sectionStart}
        sectionEnd={sectionInfo.sectionEnd}
        examTitle={selectedExam.section || selectedExam.title}
        answeredInSection={answeredInSection}
        markedInSection={markedInSection}
        canPrevious={canPrevious}
        canNext={canNext}
      />

      {!showBlockReview ? (
        <QuestionStatusPanel
          sectionStart={sectionInfo.sectionStart}
          sectionEnd={sectionInfo.sectionEnd}
          currentQuestion={currentQuestion}
          answers={answers}
          flagged={flagged}
          onNavigate={handleNavigate}
        />
      ) : null}

      <main className="classic-exam-main" aria-live="polite">
        {showBlockReview ? (
          <BlockReview
            sectionStart={sectionInfo.sectionStart}
            sectionEnd={sectionInfo.sectionEnd}
            currentQuestion={currentQuestion}
            answers={answers}
            flagged={flagged}
            onNavigate={handleNavigate}
            onReturn={() => setShowBlockReview(false)}
            onEndBlock={handleEndBlock}
          />
        ) : (
          <QuestionCard
            question={question}
            selectedAnswer={answers[currentQuestion] || null}
            showExplanation={showExplanation || mode === "review"}
            onSelectAnswer={handleSelectAnswer}
            fontSize={18}
            strikethroughs={strikethroughs}
            onToggleStrikethrough={handleToggleStrikethrough}
            highlights={highlights[currentQuestion] || []}
            onAddHighlight={handleAddHighlight}
            onRemoveHighlight={handleRemoveHighlight}
          />
        )}
      </main>

      {isPaused ? (
        <div className="classic-pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <section className="classic-pause-card">
            <h2 id="pause-title">Exam Paused</h2>
            <p>The timer is stopped while this simulator is paused.</p>
            <button type="button" autoFocus onClick={() => setIsPaused(false)}>Resume</button>
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default Index;
