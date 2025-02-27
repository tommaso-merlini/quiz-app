"use server";

import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { OpenEndedType } from "@/types";
import { google } from "@ai-sdk/google";

export async function GradeOpenEndedQuestions(
  tests: (OpenEndedType & { userAnswer: any })[],
  language: string,
) {
  const model = anthropic("claude-3-5-sonnet-20240620");
  // const model = anthropic("claude-3-haiku-20240307");
  // const model = openai("gpt-4o-mini");
  // const model = google("gemini-1.5-flash-latest");

  const messages: CoreMessage[] = [];
  console.log("tests:", tests);
  tests.map((t, i) => {
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: `this is the user answer for question ${i + 1}: ${t.userAnswer === null || t.userAnswer === undefined || t.userAnswer.trim() === "" ? "No answer provided" : t.userAnswer}`,
        },
        {
          type: "text",
          text: `this is the correct answer (DO NOT GRADE THIS ANSWER, YOU MUST GRADE THE USER ANSWER BASED ON THIS ANSWER) for question ${i}: ${t.answer}`,
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
        LANGUAGE: ${language}
        `,
    schema: z.object({
      grades: z
        .array(
          z.object({
            grade: z.number().min(0).max(100),
            correction: z.string().describe(
              // "some correction or tips to give to the student. explain what did the student get wrong. Respond in the student's language",
              "explain what did the student got wrong and correct them. Do not yap. Express yourself with the least amount of tokens. DO NOT say stuff like: 'The correct answer for question 3 is...'",
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
