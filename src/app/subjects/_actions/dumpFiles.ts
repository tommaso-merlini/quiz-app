"use server";

import { embed } from "@/ai/embedText";
import { auth } from "@/components/lucia/auth";
import { db } from "@/db";
import { embeddingsTable, InsertEmbedding, materialsTable } from "@/db/schema";
import { getApiUrl } from "@/utils/getApiUrl";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

type Response = {
  fileID: string;
  pages: [
    {
      id: string;
      index: number;
    },
  ];
};

export async function dumpFiles(formData: FormData) {
  const { user } = await auth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const files = formData.getAll("files") as File[];
  const subjectID = formData.get("subjectID") as string;
  const file = files[0];

  //TODO: FARE LE SEGUENTI COSE PER OGNI FILE
  const newForm = new FormData();
  newForm.append("file", file);
  const response: any = await fetch(
    `https://slaytest-api-production.up.railway.app/upload`,
    {
      method: "POST",
      body: newForm,
    },
  );
  console.log(response.status);
  if (response.status != 200) {
    throw new Error("error converting pdf to images");
  }

  const json = (await response.json()) as Response;

  console.log("immagini fatte");

  await db.transaction(async (tx) => {
    const [material] = await tx
      .insert(materialsTable)
      .values({
        id: json.fileID,
        name: file.name,
        subjectID: subjectID,
      })
      .returning();

    console.log("material creato");
    // await Promise.all(
    //   json.pages.map(async (page) => {
    //     const res: any = await embed(
    //       `https://bucket-production-b4c5.up.railway.app/uploads/${page.id}.png`,
    //     );
    //     allFilesEmbeddings.push({
    //       id: page.id,
    //       materialID: material.id,
    //       vector: res[0].embedding,
    //       pageNumber: page.index + 1,
    //     });
    //   }),

    const chunkSize = 10;
    const chunks: string[] = [];
    let currentChunk = "";
    let chunkCounter = 0;

    json.pages.forEach((page, index) => {
      currentChunk += `https://bucket-production-b4c5.up.railway.app/uploads/${page.id}.png\n`;
      chunkCounter++;

      if (chunkCounter === chunkSize || index === json.pages.length - 1) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
        chunkCounter = 0;
      }
    });

    const embeddingPromises = chunks.map((chunk) => embed(chunk));
    const embeddingResults = await Promise.all(embeddingPromises);

    console.log("embedding fatto");

    const allFilesEmbeddings: InsertEmbedding[] = [];

    embeddingResults.forEach((chunkResult: any, chunkIndex) => {
      chunkResult.forEach((r: any, i: number) => {
        const pageIndex = chunkIndex * chunkSize + i;
        if (pageIndex < json.pages.length) {
          allFilesEmbeddings.push({
            id: json.pages[pageIndex].id,
            materialID: material.id,
            vector: r.embedding,
            pageNumber: json.pages[pageIndex].index + 1,
          });
        }
      });
    });

    await tx.insert(embeddingsTable).values(allFilesEmbeddings);
  }); //TODO: se transaction fail allora elimare tutte le immagini appena create da uploadThing
  revalidatePath(`/subjects/${subjectID}`);
}
