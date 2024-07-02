"use server";

import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { OpenEndedType } from "@/types";

export async function GradeOpenEndedQuestions(
  quizzes: (OpenEndedType & { userAnswer: any })[],
) {
  // const model = anthropic("claude-3-5-sonnet-20240620") as any;
  const model = anthropic("claude-3-haiku-20240307");
  // const model = openai("gpt-3.5-turbo");

  const messages: CoreMessage[] = [];
  console.log("quizzes:", quizzes);
  quizzes.map((q, i) => {
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: `this is the user answer: ${q.userAnswer === null || q.userAnswer === undefined || q.userAnswer.trim() === "" ? "I don't know" : q.userAnswer} for question ${i + 1}`,
        },
        {
          type: "text",
          text: `this is the correct answer: ${q.answer} for question ${i}`,
        },
      ],
    });
  });

  const { object } = await generateObject({
    model,
    system: `
        You are an assistant that is grading the user's homework. 
        You have to determine if the user's answers are correct based on the correct answer.
        This is highschool level.
        Do not yap.
        `,
    schema: z.object({
      grades: z
        .array(
          z.object({
            grade: z.number().min(0).max(100),
            correction: z.string().describe(
              // "some correction or tips to give to the student. explain what did the student get wrong. Respond in the student's language",
              "explain what did the student got wrong and correct them. Respond in the student's language. Do not yap. Express yourself with the least amount of tokens. DO NOT say stuff like: 'The correct answer for question 3 is...'",
            ),
          }),
        )
        .describe(
          "the array of grades. same order as the array of question aswers",
        ),
    }),
    messages,
  });

  return object;
}
