import { examQuestions, examInfo, Question } from "./examQuestions";
import { nbme25Questions, nbme25Info } from "./nbme25";

export interface ExamSectionConfig {
  itemCount: number;
  timeLimitMinutes: number;
}

export interface ExamData {
  id: string;
  title: string;
  section: string;
  totalQuestions: number;
  timeLimit: number;
  sections: ExamSectionConfig[];
  questions: Question[];
}

export const availableExams: ExamData[] = [
  {
    id: "nbme26",
    title: "NBME 26",
    section: examInfo.section,
    totalQuestions: examInfo.totalQuestions,
    timeLimit: examInfo.timeLimit,
    sections: [
      { itemCount: 50, timeLimitMinutes: 60 },
      { itemCount: 50, timeLimitMinutes: 60 },
      { itemCount: 50, timeLimitMinutes: 60 },
      { itemCount: 50, timeLimitMinutes: 60 },
    ],
    questions: examQuestions,
  },
  {
    id: "nbme25",
    title: "NBME 25",
    section: nbme25Info.section,
    totalQuestions: nbme25Info.totalQuestions,
    timeLimit: nbme25Info.timeLimit,
    sections: [{ itemCount: 50, timeLimitMinutes: 60 }],
    questions: nbme25Questions,
  },
];

export type { Question };
