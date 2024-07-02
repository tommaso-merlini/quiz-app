"use server";

import { db } from "@/db";
import { materials, quizzes, subjects } from "@/db/schema";
import { SubjectWithMaterials } from "@/types";
import { desc, eq, sql } from "drizzle-orm";
export async function getUserSubjectsWithMaterialsAndQuizCount(
  userId: number,
): Promise<SubjectWithMaterials[]> {
  const result = await db
    .select({
      subject: subjects,
      material: materials,
      quizCount: sql<number>`count(distinct ${quizzes.id})`.as("quizCount"),
    })
    .from(subjects)
    .leftJoin(materials, eq(materials.subjectID, subjects.id))
    .leftJoin(quizzes, eq(quizzes.subjectID, subjects.id))
    .where(eq(subjects.userID, userId))
    .groupBy(subjects.id, materials.id)
    .orderBy(desc(subjects.createdAt));

  const subjectsMap = new Map<number, SubjectWithMaterials>();

  for (const row of result) {
    if (!subjectsMap.has(row.subject.id)) {
      subjectsMap.set(row.subject.id, {
        ...row.subject,
        materials: [],
        quizCount: row.quizCount,
      });
    }

    if (row.material) {
      subjectsMap.get(row.subject.id)!.materials.push(row.material);
    }
  }

  return Array.from(subjectsMap.values());
}
