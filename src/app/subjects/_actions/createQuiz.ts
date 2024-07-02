"use server";

import { GenerateQuiz } from "@/ai/generateQuiz";
import getSimilarSubjectEmbeddings from "@/ai/similarSubjectEmbeddings";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import languages from "@/utils/languages";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createQuiz(fd: FormData) {
  const FormDataSchema = z.object({
    subjectID: z.string(),
    language: z.enum(languages),
    questions: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    topic: z.string(),
    time: z.string(),
  });

  const formDataObject = {
    subjectID: fd.get("subjectID"),
    language: fd.get("language"),
    questions: fd.get("questions"),
    difficulty: fd.get("difficulty"),
    time: fd.get("time"),
    topic: fd.get("topic"),
  };

  const validatedData = FormDataSchema.parse(formDataObject);

  const userAuth = auth();
  if (!userAuth.userId) {
    throw new Error("shit");
  }

  const res = await getSimilarSubjectEmbeddings(
    validatedData.topic,
    +validatedData.subjectID,
  );
  if (res.length === 0) {
    alert("no similar embeddings found");
    return;
  }
  const context: any = [];
  res.map((r) => {
    context.push({
      type: "text",
      text: r.content,
    });
  });

  const { questionTypes } = await GenerateQuiz(context, {
    questions: +validatedData.questions,
    language: validatedData.language,
    difficulty: validatedData.difficulty,
  });
  const q = (
    await db
      .insert(quizzes)
      .values({
        subjectID: +validatedData.subjectID,
        content: questionTypes,
        language: validatedData.language,
        difficulty: validatedData.difficulty,
        time: +validatedData.time,
        questions: +validatedData.questions,
        topic: validatedData.topic,
      })
      .returning()
  )[0];
  if (!q) {
    throw new Error("shit");
  }

  redirect(`/quizzes/${q.id}`);
}
