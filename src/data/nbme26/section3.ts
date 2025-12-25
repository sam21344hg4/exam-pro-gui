import { Question } from "./types";

export const section3Questions: Question[] = Array.from({ length: 50 }, (_, i) => ({
  id: 101 + i,
  stem: `A ${25 + Math.floor(Math.random() * 55)}-year-old ${i % 2 === 0 ? 'man' : 'woman'} presents with symptoms requiring evaluation for a ${['renal', 'hematologic', 'infectious', 'rheumatologic', 'dermatologic'][i % 5]} condition. Clinical assessment reveals findings consistent with the diagnosis. Question ${101 + i} of Section 3.`,
  options: [
    { label: "A", text: "Option A - Treatment or diagnosis 1" },
    { label: "B", text: "Option B - Treatment or diagnosis 2" },
    { label: "C", text: "Option C - Treatment or diagnosis 3" },
    { label: "D", text: "Option D - Treatment or diagnosis 4" },
    { label: "E", text: "Option E - Treatment or diagnosis 5" },
  ],
  correctAnswer: ["A", "B", "C", "D", "E"][i % 5],
  explanation: `This is a placeholder question for Section 3, Question ${101 + i}. The answer reflects appropriate clinical management.`,
  educationalObjective: `Educational objective for question ${101 + i} - understanding pathophysiology and treatment.`,
}));
