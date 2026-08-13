import { useCallback, useEffect, useMemo, useState } from "react";
import { availableExams, ExamData } from "@/data/exams";
import { StartScreen } from "@/components/StartScreen";
import { ExamHeader, ExamSectionMeta } from "@/components/ExamHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionStatusPanel } from "@/components/QuestionStatusPanel";
import { ExamSummary } from "@/components/ExamSummary";
import { BlockReview } from "@/components/BlockReview";
import { useExamUI } from "@/components/ExamUIProvider";

type ExamMode = "start" | "timed" | "practice" | "breakintro" | "break" | "complete" | "review";

const Index = () => {
  const { activePopup, dismissAllTools, isBlockingModal } = useExamUI();
  const [selectedExam, setSelectedExam] = useState<ExamData>(availableExams[0]);
  const [mode, setMode] = useState<ExamMode>("start");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set([1]));
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(selectedExam.sections[0]?.timeLimitMinutes * 60 || selectedExam.timeLimit * 60);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(selectedExam.breakTimeMinutes * 60);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [strikethroughs, setStrikethroughs] = useState<Set<string>>(new Set());
  const [highlights, setHighlights] = useState<Record<number, string[]>>({});
  const [showBlockReview, setShowBlockReview] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const questions = selectedExam.questions;
  const totalQuestions = questions.length;

  const sectionRanges = useMemo(() => {
    let cursor = 1;
    return selectedExam.sections.map((section, index) => {
      const start = cursor;
      const declaredEnd = start + section.itemCount - 1;
      const end = Math.min(declaredEnd, totalQuestions);
      cursor = declaredEnd + 1;
      return {
        block: index + 1,
        start,
        end,
        itemCount: Math.max(end - start + 1, 0),
        durationSeconds: section.timeLimitMinutes * 60,
      };
    }).filter((section) => section.itemCount > 0);
  }, [selectedExam.sections, totalQuestions]);

  const effectiveTotalSections = Math.max(1, sectionRanges.length);
  const blockTimeTotalSeconds = sectionRanges.reduce((sum, section) => sum + section.durationSeconds, 0) || selectedExam.timeLimit * 60;
  const dayTimeLimitSeconds = blockTimeTotalSeconds + selectedExam.breakTimeMinutes * 60;

  const displayedSection = useMemo(() => {
    if (mode === "timed" || mode === "breakintro" || mode === "break") return Math.min(currentSection, effectiveTotalSections);
    const found = sectionRanges.find((range) => currentQuestion >= range.start && currentQuestion <= range.end);
    return found?.block || 1;
  }, [mode, currentSection, currentQuestion, effectiveTotalSections, sectionRanges]);

  const sectionInfo = sectionRanges[displayedSection - 1] || {
    block: 1,
    start: 1,
    end: totalQuestions,
    itemCount: totalQuestions,
    durationSeconds: selectedExam.timeLimit * 60,
  };

  const question = questions.find((item) => item.id === currentQuestion) || questions[0];

  const sectionQuestions = useMemo(
    () => Array.from({ length: sectionInfo.itemCount }, (_, index) => sectionInfo.start + index),
    [sectionInfo.itemCount, sectionInfo.start]
  );

  const answeredInSection = sectionQuestions.filter((number) => answers[number] !== undefined).length;

  const overviewSections = useMemo<ExamSectionMeta[]>(
    () => sectionRanges.map((section) => ({
      block: section.block,
      itemCount: section.itemCount,
      durationSeconds: section.durationSeconds,
      completed: mode === "timed" || mode === "breakintro" || mode === "break" ? section.block < currentSection || (mode !== "timed" && section.block === currentSection) : false,
    })),
    [sectionRanges, mode, currentSection]
  );

  const scrollExamTop = useCallback(() => {
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(".classic-exam-main")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  const sectionTime = useCallback((sectionNumber: number) => {
    return sectionRanges[sectionNumber - 1]?.durationSeconds || selectedExam.timeLimit * 60;
  }, [sectionRanges, selectedExam.timeLimit]);

  const sectionStart = useCallback((sectionNumber: number) => {
    return sectionRanges[sectionNumber - 1]?.start || 1;
  }, [sectionRanges]);

  const resetSessionState = useCallback(() => {
    setCurrentQuestion(1);
    setCurrentSection(1);
    setAnswers({});
    setFlagged(new Set());
    setNotes({});
    setVisited(new Set([1]));
    setShowExplanation(false);
    setTimeRemaining(sectionTime(1));
    setBreakTimeRemaining(selectedExam.breakTimeMinutes * 60);
    setTimeSpent(0);
    setStrikethroughs(new Set());
    setHighlights({});
    setShowBlockReview(false);
    setIsPaused(false);
    dismissAllTools();
  }, [sectionTime, selectedExam.breakTimeMinutes, dismissAllTools]);

  const startSection = useCallback((sectionNumber: number) => {
    const start = sectionStart(sectionNumber);
    const dayRemaining = Math.max(dayTimeLimitSeconds - timeSpent, 0);
    setCurrentSection(sectionNumber);
    setCurrentQuestion(start);
    setVisited((previous) => new Set(previous).add(start));
    setTimeRemaining(Math.min(sectionTime(sectionNumber), dayRemaining));
    setShowExplanation(false);
    setShowBlockReview(false);
    setMode("timed");
    setIsPaused(false);
    dismissAllTools();
    scrollExamTop();
  }, [sectionStart, dayTimeLimitSeconds, timeSpent, sectionTime, dismissAllTools, scrollExamTop]);

  useEffect(() => {
    if (mode !== "timed" || isPaused) return;
    const interval = window.setInterval(() => {
      setTimeRemaining((previous) => Math.max(previous - 1, 0));
      setTimeSpent((previous) => previous + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mode, isPaused]);

  useEffect(() => {
    if ((mode !== "breakintro" && mode !== "break") || isPaused) return;
    const interval = window.setInterval(() => {
      setBreakTimeRemaining((previous) => previous - 1);
      setTimeSpent((previous) => previous + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mode, isPaused]);

  useEffect(() => {
    if ((mode === "timed" || mode === "breakintro" || mode === "break") && timeSpent >= dayTimeLimitSeconds) {
      setMode("complete");
      dismissAllTools();
    }
  }, [mode, timeSpent, dayTimeLimitSeconds, dismissAllTools]);

  useEffect(() => {
    if (mode !== "timed" || timeRemaining > 0) return;

    if (currentSection < effectiveTotalSections) {
      startSection(currentSection + 1);
    } else {
      setMode("complete");
      dismissAllTools();
    }
  }, [mode, timeRemaining, currentSection, effectiveTotalSections, startSection, dismissAllTools]);

  useEffect(() => {
    if (mode !== "practice" || isPaused) return;
    const interval = window.setInterval(() => setTimeSpent((previous) => previous + 1), 1000);
    return () => window.clearInterval(interval);
  }, [mode, isPaused]);

  const handleSelectExam = useCallback((examId: string) => {
    const exam = availableExams.find((item) => item.id === examId);
    if (exam) {
      setSelectedExam(exam);
      setTimeRemaining(exam.sections[0]?.timeLimitMinutes * 60 || exam.timeLimit * 60);
      setBreakTimeRemaining(exam.breakTimeMinutes * 60);
    }
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
    dismissAllTools();

    if (currentSection < effectiveTotalSections) {
      setMode("breakintro");
    } else {
      setMode("complete");
    }
  }, [currentSection, effectiveTotalSections, dismissAllTools]);

  const handleEndBlock = useCallback(() => {
    if (mode === "timed") handleEndSection();
    else {
      setMode("complete");
      setShowBlockReview(false);
      dismissAllTools();
    }
  }, [mode, handleEndSection, dismissAllTools]);

  const handleSelectAnswer = useCallback((answer: string) => {
    if (mode === "review") return;
    const strikeKey = `${currentQuestion}-${answer}`;
    setStrikethroughs((previous) => {
      if (!previous.has(strikeKey)) return previous;
      const next = new Set(previous);
      next.delete(strikeKey);
      return next;
    });
    setAnswers((previous) => ({ ...previous, [currentQuestion]: answer }));
  }, [currentQuestion, mode]);

  const markVisited = useCallback((item: number) => {
    setVisited((previous) => {
      if (previous.has(item)) return previous;
      const next = new Set(previous);
      next.add(item);
      return next;
    });
  }, []);

  const isNavigationAllowed = useCallback((questionNumber: number) => {
    const target = questions.find((item) => item.id === questionNumber);
    if (!target?.sequentialGroup || !target.sequentialIndex || target.sequentialIndex <= 1) return true;
    return questions
      .filter((item) => item.sequentialGroup === target.sequentialGroup && (item.sequentialIndex || 0) < target.sequentialIndex!)
      .every((item) => visited.has(item.id) || answers[item.id] !== undefined);
  }, [questions, visited, answers]);

  const handleNext = useCallback(() => {
    if (showBlockReview) return;
    dismissAllTools();

    if (mode === "timed") {
      if (currentQuestion < sectionInfo.end) {
        const next = currentQuestion + 1;
        setCurrentQuestion(next);
        markVisited(next);
        setShowExplanation(false);
        scrollExamTop();
      } else {
        setShowBlockReview(true);
      }
      return;
    }

    if (currentQuestion < totalQuestions) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      markVisited(next);
      setShowExplanation(mode === "review");
      scrollExamTop();
    } else if (mode !== "review") {
      setMode("complete");
    }
  }, [showBlockReview, dismissAllTools, mode, currentQuestion, sectionInfo.end, totalQuestions, markVisited, scrollExamTop]);

  const handlePrevious = useCallback(() => {
    if (showBlockReview) return;
    const lowerBound = mode === "timed" ? sectionInfo.start : 1;
    if (currentQuestion > lowerBound) {
      const previous = currentQuestion - 1;
      dismissAllTools();
      setCurrentQuestion(previous);
      markVisited(previous);
      setShowExplanation(mode === "review");
      scrollExamTop();
    }
  }, [showBlockReview, mode, sectionInfo.start, currentQuestion, dismissAllTools, markVisited, scrollExamTop]);

  const handleFlag = useCallback(() => {
    if (mode === "review") return;
    setFlagged((previous) => {
      const next = new Set(previous);
      if (next.has(currentQuestion)) next.delete(currentQuestion);
      else next.add(currentQuestion);
      return next;
    });
  }, [currentQuestion, mode]);

  const handleNavigate = useCallback((questionNumber: number) => {
    const lower = mode === "timed" ? sectionInfo.start : 1;
    const upper = mode === "timed" ? sectionInfo.end : totalQuestions;
    if (questionNumber < lower || questionNumber > upper || !isNavigationAllowed(questionNumber)) return;
    dismissAllTools();
    setCurrentQuestion(questionNumber);
    markVisited(questionNumber);
    setShowExplanation(mode === "review");
    scrollExamTop();
  }, [mode, sectionInfo.start, sectionInfo.end, totalQuestions, isNavigationAllowed, dismissAllTools, markVisited, scrollExamTop]);

  const handleToggleStrikethrough = useCallback((optionLabel: string) => {
    const key = `${currentQuestion}-${optionLabel}`;
    setStrikethroughs((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, [currentQuestion]);

  const handleNoteChange = useCallback((itemId: number, value: string) => {
    setNotes((previous) => {
      const next = { ...previous };
      if (value.trim()) next[itemId] = value;
      else delete next[itemId];
      return next;
    });
  }, []);

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
    dismissAllTools();
    setMode("review");
    setCurrentQuestion(1);
    setCurrentSection(1);
    setShowExplanation(true);
    setShowBlockReview(false);
    setIsPaused(false);
    scrollExamTop();
  }, [dismissAllTools, scrollExamTop]);

  if (mode === "start") {
    return <StartScreen exams={availableExams} selectedExam={selectedExam} onSelectExam={handleSelectExam} onStart={handleStart} onPractice={handlePractice} />;
  }

  if (mode === "complete") {
    return <div className="min-h-screen flex items-center justify-center p-4 bg-background"><ExamSummary questions={questions} answers={answers} timeSpent={timeSpent} onRestart={handleRestart} onReview={handlePostExamReview} /></div>;
  }

  if (mode === "breakintro" || mode === "break") {
    const nextBlock = currentSection + 1;
    const breakOverBy = Math.max(-breakTimeRemaining, 0);
    return (
      <div className="source-break-shell">
        <section className="source-break-card" aria-labelledby="source-break-title">
          <h1 id="source-break-title">{mode === "breakintro" ? "Break" : "Break Time"}</h1>
          <div className="source-break-times">
            <div><span>Break Time Remaining:</span><strong>{breakTimeRemaining > 0 ? `${Math.floor(breakTimeRemaining / 60)} min ${Math.max(0, breakTimeRemaining % 60)} sec` : "0 min 0 sec"}</strong></div>
            <div><span>Day Time Remaining:</span><strong>{Math.max(dayTimeLimitSeconds - timeSpent, 0) > 0 ? `${Math.floor(Math.max(dayTimeLimitSeconds - timeSpent, 0) / 3600)} hr ${Math.floor((Math.max(dayTimeLimitSeconds - timeSpent, 0) % 3600) / 60)} min ${Math.max(dayTimeLimitSeconds - timeSpent, 0) % 60} sec` : "0 min 0 sec"}</strong></div>
            {breakOverBy > 0 ? <div className="source-break-warning">Break time exceeded by {Math.floor(breakOverBy / 60)} min {breakOverBy % 60} sec.</div> : null}
          </div>
          <div className="source-break-actions">
            <button type="button" onClick={() => startSection(nextBlock)}>Continue Exam</button>
            {mode === "breakintro" ? <button type="button" onClick={() => setMode("break")}>Begin Break</button> : null}
          </div>
        </section>
      </div>
    );
  }

  const canPrevious = !showBlockReview && currentQuestion > (mode === "timed" ? sectionInfo.start : 1);
  const canNext = !showBlockReview && currentQuestion < (mode === "timed" ? sectionInfo.end : totalQuestions);
  const displayNumber = currentQuestion - sectionInfo.start + 1;
  const shellInert = isBlockingModal || activePopup === "zoom";
  const inertProps = shellInert ? ({ inert: "" } as any) : {};

  return (
    <div className="classic-exam-shell">
      <a className="classic-skip-link" href="#classic-main">Skip to main</a>
      <a className="classic-skip-link" href="#classic-status">Skip to navigation</a>
      <div className="classic-visually-hidden" aria-live="assertive">Item {displayNumber} of {sectionInfo.itemCount}</div>

      <ExamHeader
        currentQuestion={currentQuestion}
        timeRemaining={timeRemaining}
        timeSpent={timeSpent}
        breakTimeRemaining={Math.max(breakTimeRemaining, 0)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onEndBlock={handleEndBlock}
        onPause={selectedExam.programId === "267" ? undefined : () => setIsPaused(true)}
        showTimer={mode === "timed"}
        currentSection={displayedSection}
        totalSections={effectiveTotalSections}
        sectionStart={sectionInfo.start}
        sectionEnd={sectionInfo.end}
        sectionTimeLimitSeconds={sectionInfo.durationSeconds}
        dayTimeLimitSeconds={dayTimeLimitSeconds}
        sections={overviewSections}
        answeredInSection={answeredInSection}
        canPrevious={canPrevious}
        canNext={canNext}
        note={notes[currentQuestion] || ""}
        onNoteChange={handleNoteChange}
        programId={selectedExam.programId}
        isFlagged={flagged.has(currentQuestion)}
        onFlag={handleFlag}
        canMark={mode !== "review"}
      />

      {!showBlockReview ? (
        <div id="classic-status" {...inertProps}>
          <QuestionStatusPanel sectionStart={sectionInfo.start} sectionEnd={sectionInfo.end} currentQuestion={currentQuestion} answers={answers} flagged={flagged} notes={notes} onNavigate={handleNavigate} canNavigate={isNavigationAllowed} />
        </div>
      ) : null}

      <main id="classic-main" className="classic-exam-main" aria-live="polite" {...(isBlockingModal ? inertProps : {})}>
        {showBlockReview ? (
          <BlockReview sectionStart={sectionInfo.start} sectionEnd={sectionInfo.end} currentQuestion={currentQuestion} answers={answers} flagged={flagged} onNavigate={handleNavigate} onReturn={() => setShowBlockReview(false)} onEndBlock={handleEndBlock} />
        ) : (
          <QuestionCard
            question={question}
            displayNumber={displayNumber}
            selectedAnswer={answers[currentQuestion] || null}
            showExplanation={showExplanation || mode === "review"}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNext}
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
          <section className="classic-pause-card"><h2 id="pause-title">Exam Paused</h2><button type="button" autoFocus onClick={() => setIsPaused(false)}>Resume</button></section>
        </div>
      ) : null}
    </div>
  );
};

export default Index;
