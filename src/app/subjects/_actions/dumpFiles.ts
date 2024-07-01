"use server";

import { db } from "@/db";
import { embeddings, InsertEmbedding, materials } from "@/db/schema";
import { utapi } from "@/server/uploadthing";
import { auth } from "@clerk/nextjs/server";
import { processPDF } from "../[subjectID]/actions";
import { revalidatePath } from "next/cache";

export async function dumpFiles(formData: FormData) {
  const userAuth = auth();
  if (!userAuth.userId) {
    throw new Error("Unauthorized");
  }

  const files = formData.getAll("files") as File[];
  const subjectID = parseInt(formData.get("subjectID") as string);

  const allFilesEmbeddings: InsertEmbedding[] = [];
  await db.transaction(async (tx) => {
    const uploadThingFiles = await utapi.uploadFiles(files);
    let i = 0;
    for (const file of files) {
      const m = await tx
        .insert(materials)
        .values({
          name: file.name,
          subjectID: subjectID,
          url: uploadThingFiles[i].data?.url,
          type: file.type === "application/pdf" ? "pdf" : "image",
        })
        .returning();
      //TODO: handle images
      if (file.type === "application/pdf") {
        const embeddings = await processPDF(file, m[0].id);
        allFilesEmbeddings.push(...embeddings);
      }
      i++;
    }
    await db.insert(embeddings).values(allFilesEmbeddings);
  });
  revalidatePath(`/subjects/${subjectID}`);
}
