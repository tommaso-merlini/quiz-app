"use server";

import { db } from "@/db";
import { getTestByID } from "@/db/queries";
import {
  gradesTable as gradesTable,
  InsertGrade,
  testsTable,
} from "@/db/schema";
import { redirect } from "next/navigation";
import { Answer, OpenEndedType } from "@/types";
import { and, eq, lt, sql } from "drizzle-orm";
import { GradeOpenEndedQuestions } from "@/ai/gradeOpenEndedQuestions";
import { v4 as uuidv4 } from "uuid";

export async function GetGrade(userAnswers: any[], testID: string) {
  const test = await getTestByID(testID);
  const grade: InsertGrade = {
    id: uuidv4(),
    testID,
    answers: [],
  };
  const questions = test.questions;
  const r: (OpenEndedType & { userAnswer: any })[] = [];
  questions.map((q, i) => {
    if (q.type === "openEnded") {
      r.push({
        ...q,
        userAnswer: userAnswers[i],
      });
    }
  });
  const { grades } = await GradeOpenEndedQuestions(r, test.language);
  let gradesIndex = 0;

  const correctionPromises = questions.map(async (question, index) => {
    let userAnswer = userAnswers[index];
    if (
      userAnswer === undefined ||
      userAnswer === null ||
      userAnswer.trim() === ""
    ) {
      userAnswer = "No answer provided";
    }

    let answer: Answer;

    switch (question.type) {
      case "openEnded":
        answer = {
          isCorrect: grades[gradesIndex].grade >= 60,
          userAnswer: userAnswer,
          correctAnswer: grades[gradesIndex].correction,
        };
        gradesIndex++;
        break;
      case "trueOrFalse":
        answer = {
          isCorrect: userAnswer === question.answer,
          userAnswer: userAnswer,
          correctAnswer: question.answer,
        };
        break;
      case "multipleChoice":
        const correctAnswerIndex = question.answers.findIndex(
          (a) => a.isCorrect,
        );
        answer = {
          isCorrect: userAnswer === correctAnswerIndex.toString(),
          userAnswer:
            question.answers[+userAnswer]?.text || "No answer provided",
          correctAnswer: question.answers[correctAnswerIndex].text,
        };
        break;
      default:
        answer = {
          isCorrect: false,
          userAnswer: "Unexpected question type",
          correctAnswer: "Unexpected question type",
        };
    }

    return { index, answer };
  });

  const corrections = await Promise.all(correctionPromises);

  // Sort corrections based on their original index
  corrections.sort((a, b) => a.index - b.index);

  // Add sorted corrections to the grade object
  grade.answers = corrections.map((c) => c.answer);

  const resp = await db.insert(gradesTable).values(grade).returning();
  redirect(`/grades/${resp[0].id}`);
}

export async function isRunningTest(testID: string): Promise<boolean> {
  const runningTest = await db
    .select({
      id: testsTable.id,
    })
    .from(testsTable)
    .where(
      and(
        eq(testsTable.id, testID),
        lt(
          sql`CURRENT_TIMESTAMP`,
          sql`${testsTable.createdAt} + (${testsTable.timeInMinutes} || ' minutes')::interval`,
        ),
      ),
    )
    .limit(1);

  return runningTest.length > 0;
}
