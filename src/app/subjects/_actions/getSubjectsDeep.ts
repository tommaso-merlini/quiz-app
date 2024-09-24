"use server";

import { db } from "@/db";
import { materialsTable, testsTable, subjectsTable } from "@/db/schema";
import { SubjectWithMaterials } from "@/types";
import { desc, eq, sql } from "drizzle-orm";
export async function getUserSubjectsWithMaterialsAndTestCount(
  userId: string,
): Promise<SubjectWithMaterials[]> {
  const result = await db
    .select({
      subject: subjectsTable,
      material: materialsTable,
      testCount: sql<number>`count(distinct ${testsTable.id})`.as("testCount"),
    })
    .from(subjectsTable)
    .leftJoin(materialsTable, eq(materialsTable.subjectID, subjectsTable.id))
    .leftJoin(testsTable, eq(testsTable.subjectID, subjectsTable.id))
    .where(eq(subjectsTable.userID, userId))
    .groupBy(subjectsTable.id, materialsTable.id)
    .orderBy(desc(subjectsTable.createdAt));

  const subjectsMap = new Map<string, SubjectWithMaterials>();

  for (const row of result) {
    if (!subjectsMap.has(row.subject.id)) {
      subjectsMap.set(row.subject.id, {
        ...row.subject,
        materials: [],
        testCount: row.testCount,
      });
    }

    if (row.material) {
      subjectsMap.get(row.subject.id)!.materials.push(row.material);
    }
  }

  return Array.from(subjectsMap.values());
}
