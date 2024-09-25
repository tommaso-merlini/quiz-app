"use server";

import { testSchema } from "@/app/tests/[testID]/schema";
import { testsTable } from "@/db/schema";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { UserContent, generateObject } from "ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import util from "util";
import { chromeai } from "chrome-ai";

type Options = {
  language: string;
  questions: number;
  difficulty: string;
  topic: string;
};

export async function GenerateTest(content: UserContent, options: Options) {
  // const model = anthropic("claude-3-5-sonnet-20240620");
  // const model = chromeai("text");
  // const model = anthropic("claude-3-haiku-20240307");
  const model = openai("gpt-4o-mini");
  // const model = google("gemini-1.5-flash");

  const { object } = await generateObject({
    model,
    // system: `
    //     You are an assistant that makes tests.
    //     Your job is to make a test
    //     YOU MUST ASK ${options.questions} questions OR I WILL DIE,
    //     this means that if the questionTypes array length is not ${options.questions} i will fall off a bridge.
    //     Respond in the user language.
    //     Ensure there is a variety in the types of questions provided.
    //     The user want's tests about the text below.
    //     You don't have to rely solely on the text below, you can take the user prompt as a helpful message to expand on the topic.
    //     Make sure that for every question you provide, you choose the most correct answer.
    //     You can invent your own questions based on the topic of the messages (
    //         Example: if the messages talk about fractions do not only ask theoretical
    //             questions, make up exercises with fractions
    //     ).
    //     Do not limit yourself only to the messages, expand them.
    //     The user doesn't know what's the context of the message.
    //     DO NOT HALLUCINATE THE RESPONSES, YOU MUST BE 100% RIGHT WITH THE CORRECTIONS.
    //     Make sure to understand the question and respond with the correct answer ALWAYS.
    //     DO NOT ASK QUESTIONS ABOUT THE IMAGES.
    //     IMPORTANT: YOU HAVE TO THINK LIKE THE USER HAS NOT SEEN AND WILL NOT SEE THE CONTEXT so do not ask questions like "what happened in this example" because the user just doesn't know.
    //     IMPORTANT: YOU MUST FOLLOW THE USER OPTIONS
    //     `,
    // system: `
    //         you are an assistant that reads the content in the images below and creates a test for the user.
    //         FOLLOW THE USER OPTIONS LIKE JESUS FOLLOWED THE HOLY FATHER.
    //         DO NOT HALLUCINATE.
    //
    //         USER OPTIONS:
    //          - language: ${options.language};
    //          - difficulty of the questions: ${options.difficulty}
    //          - topic: ${options.topic || "no spefic topic requested"}
    //          - number of questions: ${options.questions}
    //         `,
    system: `
            You are an AI assistant tasked with analyzing images of the user's notes and creating a test based on the content. Your goal is to understand the context of the notes, generate a relevant test, and evaluate the user's response.

            First, carefully examine the provided images of the user's notes:

            Analyze the content of the images, paying attention to:
            1. The main topics or subjects covered in the notes
            2. Key concepts, definitions, or formulas
            3. Any diagrams, charts, or visual aids
            4. The overall structure and organization of the notes

            Next, generate a test that:
            1. Is directly related to the content in the images
            2. Challenges the user's understanding of the material
            3. Is clear and concise
            4. Can be answered based solely on the information provided in the notes

            TEST CONFIGURATION:
             - language: ${options.language};
             - difficulty and complexity of the questions: ${options.difficulty}
             - topic: ${options.topic || "no spefic topic requested"}
             - number of questions: ${options.questions}
            `,
    schema: testSchema,
    messages: [
      {
        role: "user",
        content,
      },
    ],
  });

  // const { object } = await generateObject({
  //   model,
  //   system: "you are an helpful assistant",
  //   schema: testSchema,
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
