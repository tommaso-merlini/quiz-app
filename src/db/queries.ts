"use server";

import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { grades, materials, quizzes, subjects, users } from "./schema";

export async function getUserByAuthID(authID: string) {
  return (
    await db.select().from(users).where(eq(users.authID, authID)).limit(1)
  )[0];
}

export async function getSubjectByID(id: number) {
  return (
    await db.select().from(subjects).where(eq(subjects.id, id)).limit(1)
  )[0];
}

export async function getQuizById(id: number) {
  return (
    await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1)
  )[0];
}

export async function getMaterialById(id: number) {
  return (
    await db.select().from(materials).where(eq(materials.id, id)).limit(1)
  )[0];
}

export async function getUserGrades(userID: number) {
  return await db
    .select({
      grade: grades,
      quiz: {
        id: quizzes.id,
        content: quizzes.content,
        language: quizzes.language,
        difficulty: quizzes.difficulty,
        time: quizzes.time,
        topic: quizzes.topic,
        questions: quizzes.questions,
      },
      subject: {
        id: subjects.id,
        name: subjects.name,
      },
    })
    .from(grades)
    .innerJoin(quizzes, eq(grades.quizID, quizzes.id))
    .innerJoin(subjects, eq(quizzes.subjectID, subjects.id))
    .innerJoin(users, eq(subjects.userID, users.id))
    .where(eq(users.id, userID))
    .orderBy(desc(grades.createdAt));
}
