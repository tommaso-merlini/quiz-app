"use server";

import { embeddings, materials, subjects } from "@/db/schema";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { EmbedMany } from "./embedMany";

export default async function getSimilarSubjectEmbeddings(
  prompt: string,
  subjectID: number,
) {
  if (prompt === null || prompt === undefined || prompt.trim() === "") {
    const randomRows = await db
      .select({
        content: embeddings.content,
      })
      .from(embeddings)
      .innerJoin(materials, eq(embeddings.materialID, materials.id))
      .innerJoin(subjects, eq(materials.subjectID, subjects.id))
      .where(eq(subjects.id, subjectID))
      .orderBy(sql`RANDOM()`)
      .limit(10);
    // .orderBy(sql`RANDOM() * ${sql.raw(Math.random().toString())}`);

    console.log("random rows", randomRows);
    return randomRows;
  }

  const res = await EmbedMany([prompt]);

  const similarity = sql<number>`1 - (${cosineDistance(embeddings.vector, res[0])})`;
  const similar = await db
    .select({
      content: embeddings.content,
      similarity,
    })
    .from(embeddings)
    .innerJoin(materials, eq(embeddings.materialID, materials.id))
    .innerJoin(subjects, eq(materials.subjectID, subjects.id))
    .where(and(eq(subjects.id, subjectID), gt(similarity, 0.3)))
    .orderBy((t) => desc(t.similarity))
    .limit(10);

  console.log("similar", similar);
  return similar;
}
