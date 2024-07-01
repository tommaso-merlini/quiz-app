"use server";

import { GradeOpenEndedQuestion } from "@/ai/gradeOpenEndedQuestion";
import { db } from "@/db";
import { getQuizById } from "@/db/queries";
import { grades, InsertGrade } from "@/db/schema";
import { quizSchema } from "./schema";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Answer } from "@/types";

type QuizType = z.infer<typeof quizSchema>["questionTypes"][number];

export async function GetGrade(
  userAnswers: any[],
  quizID: number,
  subjectID: number,
) {
  const quiz = await getQuizById(quizID);
  const grade: InsertGrade = {
    quizID,
    answers: [],
  };
  const questions: QuizType[] = quiz.content as QuizType[];

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
        const resp = await GradeOpenEndedQuestion(userAnswer, question.answer);
        console.log("grade: ", resp);
        answer = {
          isCorrect: resp.grade >= 60,
          userAnswer: userAnswer,
          correctAnswer: resp.correction,
        };
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

  await db.insert(grades).values(grade).returning();
  redirect(`/subjects/${subjectID}/quiz/${quizID}/grades`);
}
