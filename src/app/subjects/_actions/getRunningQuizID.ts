"use server";

import { db } from "@/db";
import { grades, quizzes } from "@/db/schema";
import { and, eq, isNull, lt, sql } from "drizzle-orm";

export async function getRunningQuizID(
  subjectId: number,
): Promise<number | null> {
  const runningQuiz = await db
    .select({
      quizId: quizzes.id,
    })
    .from(quizzes)
    .leftJoin(grades, eq(grades.quizID, quizzes.id))
    .where(
      and(
        eq(quizzes.subjectID, subjectId),
        lt(
          sql`CURRENT_TIMESTAMP`,
          sql`${quizzes.createdAt} + (${quizzes.time} || ' minutes')::interval`,
        ),
        isNull(grades.id),
      ),
    )
    .limit(1);

  return runningQuiz.length > 0 ? runningQuiz[0].quizId : null;
}
