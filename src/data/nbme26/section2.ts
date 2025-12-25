import { Question } from "./types";

export const section2Questions: Question[] = Array.from({ length: 50 }, (_, i) => ({
  id: 51 + i,
  stem: `A ${20 + Math.floor(Math.random() * 60)}-year-old ${i % 2 === 0 ? 'woman' : 'man'} presents with symptoms consistent with a ${['cardiovascular', 'pulmonary', 'gastrointestinal', 'neurological', 'endocrine'][i % 5]} condition. After thorough evaluation, the most appropriate diagnosis is made. Question ${51 + i} of Section 2.`,
  options: [
    { label: "A", text: "Option A - Diagnostic possibility 1" },
    { label: "B", text: "Option B - Diagnostic possibility 2" },
    { label: "C", text: "Option C - Diagnostic possibility 3" },
    { label: "D", text: "Option D - Diagnostic possibility 4" },
    { label: "E", text: "Option E - Diagnostic possibility 5" },
  ],
  correctAnswer: ["A", "B", "C", "D", "E"][i % 5],
  explanation: `This is a placeholder question for Section 2, Question ${51 + i}. The correct answer demonstrates understanding of the clinical scenario presented.`,
  educationalObjective: `Educational objective for question ${51 + i} - understanding clinical reasoning and diagnosis.`,
  ...(i % 8 === 0 ? { image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop", imageCaption: "Clinical image for question " + (51 + i) } : {})
}));
