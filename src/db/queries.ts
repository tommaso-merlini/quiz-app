"use server";

import { desc, eq } from "drizzle-orm";
import { db } from ".";
import {
  gradesTable,
  materialsTable,
  subjectsTable,
  testsTable,
  usersTable,
} from "./schema";

export async function getUserByID(id: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  return user;
}

export async function getSubjectByID(id: string) {
  return (
    await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.id, id))
      .limit(1)
  )[0];
}

export async function getTestByID(id: string) {
  return (
    await db.select().from(testsTable).where(eq(testsTable.id, id)).limit(1)
  )[0];
}

export async function getMaterialById(id: string) {
  return (
    await db
      .select()
      .from(materialsTable)
      .where(eq(materialsTable.id, id))
      .limit(1)
  )[0];
}

export async function getUserGrades(userID: string) {
  return await db
    .select({
      grade: gradesTable,
      test: testsTable,
      subject: subjectsTable,
    })
    .from(gradesTable)
    .innerJoin(testsTable, eq(gradesTable.testID, testsTable.id))
    .innerJoin(subjectsTable, eq(testsTable.subjectID, subjectsTable.id))
    .innerJoin(usersTable, eq(subjectsTable.userID, usersTable.id))
    .where(eq(usersTable.id, userID))
    .orderBy(desc(gradesTable.createdAt));
}
