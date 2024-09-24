"use server";

import { z } from "zod";
import { openEndedSchema, testSchema } from "./app/tests/[testID]/schema";
import { SelectMaterial, SelectSubject } from "./db/schema";

export type Answer = {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
};
export type SubjectWithMaterials = SelectSubject & {
  materials: SelectMaterial[];
  testCount: number;
};

export type OpenEndedType = z.infer<typeof openEndedSchema>;
export type TestSchema = z.infer<typeof testSchema>;
export type QuestionsSchema = TestSchema["questions"];
