import { Question } from "./types";

export const section4Questions: Question[] = Array.from({ length: 50 }, (_, i) => ({
  id: 151 + i,
  stem: `A ${30 + Math.floor(Math.random() * 50)}-year-old ${i % 2 === 0 ? 'woman' : 'man'} is evaluated for a ${['psychiatric', 'obstetric', 'pediatric', 'surgical', 'pharmacologic'][i % 5]} concern. After comprehensive workup, the appropriate management is determined. Question ${151 + i} of Section 4.`,
  options: [
    { label: "A", text: "Option A - Management approach 1" },
    { label: "B", text: "Option B - Management approach 2" },
    { label: "C", text: "Option C - Management approach 3" },
    { label: "D", text: "Option D - Management approach 4" },
    { label: "E", text: "Option E - Management approach 5" },
  ],
  correctAnswer: ["A", "B", "C", "D", "E"][i % 5],
  explanation: `This is a placeholder question for Section 4, Question ${151 + i}. Understanding the clinical context guides the correct answer.`,
  educationalObjective: `Educational objective for question ${151 + i} - clinical decision-making skills.`,
}));
