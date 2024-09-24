import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { embeddingsTable, materialsTable, subjectsTable } from "@/db/schema";
import { embed } from "./embedText";

export default async function retrieveEmbeddings(
  prompt: string | undefined,
  subjectID: string,
) {
  if (!prompt) {
    const similar = await db
      .select({
        id: embeddingsTable.id,
      })
      .from(embeddingsTable)
      .innerJoin(
        materialsTable,
        eq(embeddingsTable.materialID, materialsTable.id),
      )
      .innerJoin(subjectsTable, eq(materialsTable.subjectID, subjectsTable.id))
      .where(eq(subjectsTable.id, subjectID))
      .orderBy(sql`RANDOM()`)
      .limit(10);

    console.log("similar no prompt", similar);
    return similar;
  }

  const res: any = await embed(prompt);

  const similarity = sql<number>`1 - (${cosineDistance(embeddingsTable.vector, res[0].embedding)})`;
  const similar = await db
    .select({
      id: embeddingsTable.id,
      similarity,
    })
    .from(embeddingsTable)
    .innerJoin(
      materialsTable,
      eq(embeddingsTable.materialID, materialsTable.id),
    )
    .innerJoin(subjectsTable, eq(materialsTable.subjectID, subjectsTable.id))
    .where(and(eq(subjectsTable.id, subjectID), gt(similarity, 0.2)))
    .orderBy((t) => desc(t.similarity));

  // Shuffle the array randomly
  const shuffled = similar.sort(() => 0.5 - Math.random());

  // Return the first 10 objects (or less if the array has fewer than 10 items)
  return shuffled.slice(0, 10);
}
