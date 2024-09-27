"use server";

import { GenerateTest } from "@/ai/generateTest";
import getSimilarSubjectEmbeddings from "@/ai/similarSubjectEmbeddings";
import { db } from "@/db";
import { testsTable } from "@/db/schema";
import languages from "@/utils/languages";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { UserContent } from "ai";
import { redirect } from "next/navigation";
import { auth } from "@/components/lucia/auth";

async function imageUrlToUint8Array(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function createTest(fd: FormData) {
  const FormDataSchema = z.object({
    subjectID: z.string(),
    language: z.enum(languages),
    questions: z.string(),
    difficulty: z.enum(["easy", "medium", "hard", "impossible"]),
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

  const { user } = await auth();
  if (!user) {
    throw new Error("shit");
  }

  const embeddings = await getSimilarSubjectEmbeddings(
    validatedData.topic,
    validatedData.subjectID,
  );
  if (embeddings.length === 0) {
    throw new Error("no similar embeddings found");
  }

  const content: UserContent = [];
  for (const embedding of embeddings) {
    console.log(
      `https://bucket-production-b4c5.up.railway.app/uploads/${embedding.id}.png`,
    );
    const image = await imageUrlToUint8Array(
      `https://bucket-production-b4c5.up.railway.app/uploads/${embedding.id}.png`,
    );
    content.push({
      type: "image",
      image,
    });
  }

  const { questions } = await GenerateTest(content, {
    questions: +validatedData.questions,
    language: validatedData.language,
    difficulty: validatedData.difficulty,
    topic: validatedData.topic,
  });
  const [test] = await db
    .insert(testsTable)
    .values({
      id: uuidv4(),
      subjectID: validatedData.subjectID,
      language: validatedData.language,
      difficulty: validatedData.difficulty,
      timeInMinutes: +validatedData.time,
      questionsQty: +validatedData.questions,
      questions,
      topic: validatedData.topic,
    })
    .returning();
  if (!test) {
    throw new Error("shit");
  }

  redirect(`/tests/${test.id}`);
}
