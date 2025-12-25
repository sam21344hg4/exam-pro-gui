export interface Question {
  id: number;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  educationalObjective: string;
  image?: string; // Optional image URL for the question
  imageCaption?: string; // Optional caption for the image
}
