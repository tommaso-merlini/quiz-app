"use server";

import { db } from "@/db";
import { gradesTable, testsTable } from "@/db/schema";
import { and, eq, isNull, lt, sql } from "drizzle-orm";

export async function getRunningTestID(subjectId: string) {
  const runningTest = await db
    .select({
      testID: testsTable.id,
    })
    .from(testsTable)
    .leftJoin(gradesTable, eq(gradesTable.testID, testsTable.id))
    .where(
      and(
        eq(testsTable.subjectID, subjectId),
        lt(
          sql`CURRENT_TIMESTAMP`,
          sql`${testsTable.createdAt} + (${testsTable.timeInMinutes} || ' minutes')::interval`,
        ),
        isNull(gradesTable.id),
      ),
    )
    .limit(1);

  return runningTest.length > 0 ? runningTest[0].testID : null;
}
