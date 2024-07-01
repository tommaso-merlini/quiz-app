"use server";

import { eq } from "drizzle-orm";
import { db } from ".";
import { materials, quizzes, subjects, users } from "./schema";

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
