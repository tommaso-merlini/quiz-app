"use server";

import { z } from "zod";
import { quizSchema } from "./app/quizzes/[quizID]/schema";
import { SelectMaterial, SelectSubject } from "./db/schema";

export type QuizType = z.infer<typeof quizSchema>;
export type QuizContent = QuizType["questionTypes"];
export type Answer = {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
};
export type SubjectWithMaterials = SelectSubject & {
  materials: SelectMaterial[];
  quizCount: number;
};
