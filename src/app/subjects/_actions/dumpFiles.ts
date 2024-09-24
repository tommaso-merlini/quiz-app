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
  const response: any = await fetch(`${getApiUrl()}/upload`, {
    method: "POST",
    body: newForm,
  });
  console.log("===============");
  console.log(response);
  console.log("===============");

  const json = (await response.json()) as Response;

  const allFilesEmbeddings: InsertEmbedding[] = [];
  await db.transaction(async (tx) => {
    const [material] = await tx
      .insert(materialsTable)
      .values({
        id: json.fileID,
        name: file.name,
        subjectID: subjectID,
      })
      .returning();
    await Promise.all(
      json.pages.map(async (page) => {
        const res: any = await embed(
          `https://bucket-production-b4c5.up.railway.app/uploads/${page.id}.png`,
        );
        allFilesEmbeddings.push({
          id: page.id,
          materialID: material.id,
          vector: res[0].embedding,
          pageNumber: page.index + 1,
        });
      }),
    );

    await tx.insert(embeddingsTable).values(allFilesEmbeddings);
  }); //TODO: se transaction fail allora elimare tutte le immagini appena create da uploadThing
  revalidatePath(`/subjects/${subjectID}`);
}
