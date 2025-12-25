import { Question } from "./types";
import { section1Questions } from "./section1";
import { section2Questions } from "./section2";
import { section3Questions } from "./section3";
import { section4Questions } from "./section4";

export type { Question };

export const nbme26AllQuestions: Question[] = [
  ...section1Questions,
  ...section2Questions,
  ...section3Questions,
  ...section4Questions,
];

export const nbme26Info = {
  title: "NBME 26",
  section: "Full Exam - 4 Sections",
  totalQuestions: 200,
  timeLimit: 240, // 4 hours for full exam
};

export { section1Questions, section2Questions, section3Questions, section4Questions };
