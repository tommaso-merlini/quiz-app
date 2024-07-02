"use server";

import { quizSchema } from "@/app/quizzes/[quizID]/schema";
import { quizzes } from "@/db/schema";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { UserContent, generateObject } from "ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import util from "util";
import { chromeai } from "chrome-ai";

type Options = {
  language: string;
  questions: number;
  difficulty: string;
};

export async function GenerateQuiz(content: UserContent, options: Options) {
  const model = anthropic("claude-3-5-sonnet-20240620");
  // const model = chromeai("text");
  // const model = anthropic("claude-3-haiku-20240307");
  // const model = openai("gpt-4o");

  const { object } = await generateObject({
    model,
    system: `
        You are an assistant that makes quizzes.
        Your job is to make a quiz.
        YOU MUST ASK ${options.questions} questions OR I WILL DIE,
        this means that if the questionTypes array length is not ${options.questions} i will fall off a bridge.
        Respond in the user language.
        Ensure there is a variety in the types of questions provided.
        The user want's quizzes about the text below.
        You don't have to rely solely on the text below, you can take the user prompt as a helpful message to expand on the topic.
        Make sure that for every question you provide, you choose the most correct answer.
        You can invent your own questions based on the topic of the messages (
            Example: if the messages talk about fractions do not only ask theoretical
                questions, make up exercises with fractions
        ).
        Do not limit yourself only to the messages, expand them.
        The user doesn't know what's the context of the message.
        DO NOT HALLUCINATE THE RESPONSES, YOU MUST BE 100% RIGHT WITH THE CORRECTIONS.
        Make sure to understand the question and respond with the correct answer ALWAYS.
        DO NOT ASK QUESTIONS ABOUT THE IMAGES.
        IMPORTANT: YOU HAVE TO THINK LIKE THE USER HAS NOT SEEN AND WILL NOT SEE THE CONTEXT so do not ask questions like "what happened in this example" because the user just doesn't know.
        IMPORTANT: YOU MUST FOLLOW THE USER OPTIONS
        `,
    schema: quizSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            USER OPTIONS:
             - language: ${options.language};
             - difficulty of the questions: ${options.difficulty}
            `,
          },
        ],
      },
      {
        role: "user",
        content,
      },
    ],
  });

  // const { object } = await generateObject({
  //   model,
  //   system: "you are an helpful assistant",
  //   schema: quizSchema,
  //   messages: [
  //     {
  //       role: "user",
  //       content: [
  //         {
  //           type: "text",
  //           text: `
  //             USER OPTIONS:
  //              - language: ${options.language};
  //              - difficulty of the questions: ${options.difficulty}
  //             `,
  //         },
  //       ],
  //     },
  //     {
  //       role: "user",
  //       content,
  //     },
  //   ],
  // });
  // console.log("resp", object);

  console.log("object:", util.inspect(object, false, null, true));
  return object;
}
