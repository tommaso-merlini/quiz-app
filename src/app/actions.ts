"use server";

import { z } from "zod";
import { SourceType } from "./_components/InstantQuizBox";
import { redirect } from "next/navigation";
import qs from "qs";

const dataSchema = z.object({
  language: z.string(),
  difficulty: z.string(),
  time: z.string(),
  questions: z.string(),
  source: z.string().min(1).max(2000),
  sourceType: z.string(),
});

export async function createQuiz(sourceType: SourceType, formData: FormData) {
  const data = {
    language: formData.get("language"),
    difficulty: formData.get("difficulty"),
    time: formData.get("time"),
    questions: formData.get("questions"),
    source: formData.get("source"),
    sourceType,
  };
  console.log(data);
  const validatedFields = dataSchema.safeParse(data);
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const queryString = qs.stringify(validatedFields.data);
  redirect(`/quiz?${queryString}`);
}
