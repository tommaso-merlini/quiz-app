"use server";

import { z } from "zod";
import { quizSchema } from "./app/subjects/[subjectID]/quiz/[quizID]/schema";

export type QuizType = z.infer<typeof quizSchema>;
export type QuizContent = QuizType["questionTypes"];
export type Answer = {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
};
