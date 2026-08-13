export interface Question {
  id: number;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  educationalObjective: string;
  image?: string;
  imageCaption?: string;
  /** Optional StartTest-style sequential item-set metadata. */
  sequentialGroup?: string;
  sequentialIndex?: number;
}
