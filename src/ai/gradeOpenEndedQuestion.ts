"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export async function GradeOpenEndedQuestion(
  userAnswer: string,
  correctAnswer: string,
) {
  // const model = anthropic("claude-3-5-sonnet-20240620");
  // const model = anthropic("claude-3-haiku-20240307");
  const model = openai("gpt-4o");

  const { object } = await generateObject({
    model,
    system: `
        You are an assistant that is grading the user's homework. 
        You have been provided the correct answer and the answer from the user.
        You have to determine if the user's answer is correct based on the correct answer.
        This is highschool level.
        Do not yap.
        `,
    schema: z.object({
      grade: z.number().min(0).max(100),
      correction: z.string().describe(
        // "some correction or tips to give to the student. explain what did the student get wrong. Respond in the student's language",
        "explain what did the student got wrong and correct them. Respond in the student's language. Do not yap. Express yourself with the least amount of tokens",
      ),
    }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `this is the user answer: ${userAnswer === null || userAnswer === undefined || userAnswer.trim() === "" ? "I don't know" : userAnswer}`,
          },
          {
            type: "text",
            text: `this is the correct answer: ${correctAnswer}`,
          },
        ],
      },
    ],
  });

  return object;
}
