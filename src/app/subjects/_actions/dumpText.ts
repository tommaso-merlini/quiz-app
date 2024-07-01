"use server";

import { db } from "@/db";
import { embeddings, InsertEmbedding, materials } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { processText } from "./processText";

export async function dumpText(formData: FormData) {
  const userAuth = auth();
  if (!userAuth.userId) {
    throw new Error("Unauthorized");
  }

  const text = formData.get("text") as string;
  const name = formData.get("name") as string;
  const subjectID = parseInt(formData.get("subjectID") as string);

  const allFilesEmbeddings: InsertEmbedding[] = [];
  await db.transaction(async (tx) => {
    const m = await tx
      .insert(materials)
      .values({
        name: name,
        subjectID: subjectID,
        type: "text",
      })
      .returning();
    console.log("material:", m);
    const textEmbeddings = await processText(text, m[0].id);
    allFilesEmbeddings.push(...textEmbeddings);
    await db.insert(embeddings).values(allFilesEmbeddings);
  });

  revalidatePath(`/subjects/${subjectID}`);
}
