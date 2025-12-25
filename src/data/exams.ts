import { examQuestions, examInfo, Question } from "./examQuestions";
import { nbme25Questions, nbme25Info } from "./nbme25";

export interface ExamData {
  id: string;
  title: string;
  section: string;
  totalQuestions: number;
  timeLimit: number;
  questions: Question[];
}

export const availableExams: ExamData[] = [
  {
    id: "nbme26",
    title: "NBME 26",
    section: examInfo.section,
    totalQuestions: examInfo.totalQuestions,
    timeLimit: examInfo.timeLimit,
    questions: examQuestions,
  },
  {
    id: "nbme25",
    title: "NBME 25",
    section: nbme25Info.section,
    totalQuestions: nbme25Info.totalQuestions,
    timeLimit: nbme25Info.timeLimit,
    questions: nbme25Questions,
  },
];

export type { Question };
