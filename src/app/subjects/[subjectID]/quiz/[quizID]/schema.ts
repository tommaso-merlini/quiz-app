import { z } from "zod";

export const trueOrFalseSchema = z.object({
  type: z.enum(["trueOrFalse"]),
  topic: z.string().describe(""),
  question: z.string().describe(
    `an interrogative question with a question mark, it can be a total lie or a true fact. 
        DO NOT ALWAYS ASK TRUE QUESTION
        examples:
            - Are dogs reptiles?
            - Are skyscrapers built with mud?
            - Do sharks have legs?
            - Do cats have legs?`,
  ),
  answer: z.enum(["true", "false"]).describe("be 100% precise"),
});

export const informativeTextSchema = z.object({
  title: z.string().min(10).max(50).describe("text title"),
  description: z.string().min(10).max(600).describe("text description"),
  paragraphs: z.array(
    z
      .object({
        title: z.string().min(10).max(50).describe("paragraph title"),
        text: z.string().min(10).max(600).describe("paragraph text"),
      })
      .describe("paragraph object"),
  ),
});

export const multipleChoiceSchema = z.object({
  type: z.enum(["multipleChoice"]),
  topic: z.string(),
  question: z.string(),
  answers: z
    .array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
      }),
    )
    .describe("Only one of the answers must be true")
    .length(4),
});

const columnSchema = z.object({
  name: z
    .string()
    .min(1, "Column name is required")
    .max(50, "Column name must be less than 50 characters"),
  type: z.enum(["string" /* , "number", "boolean" */]).describe("Column type"),
});

export const tableSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be less than 500 characters"),
    columnsTitles: z
      .array(columnSchema)
      .min(1, "At least one column is required")
      .max(6, "No more than 6 columns"),
    rows: z.array(z.record(z.string())).max(5, "No more than 5 rows"),
  })
  .refine(
    (data) => {
      return data.rows.every(
        (row) => Object.keys(row).length === data.columnsTitles.length,
      );
    },
    {
      message:
        "Each row must have the same number of values as there are columns",
      path: ["rows"],
    },
  );

export const openEndedSchema = z.object({
  type: z.enum(["openEnded"]),
  topic: z.string().describe("the topic of the question"),
  question: z.string().describe("the title of the question"),
  answer: z.string().describe("the answer of the question"),
  // maxLength: z
  //   .number()
  //   .describe(
  //     "Maximum number of characters allowed in the textarea to answer the question",
  //   ),
});

export const fillBlanksSchema = z.object({
  paragraphs: z
    .array(
      z
        .array(
          z.object({
            isStaticText: z
              .boolean()
              .describe(
                "true if in the union you fill the static text, false if not",
              ),
            value: z
              .union([
                z
                  .object({
                    text: z.string().describe("this is the static text"),
                  })
                  .describe("static text object"),
                z
                  .object({
                    first: z.object({
                      text: z.string().describe("the first answer of the quiz"),
                      isTrue: z
                        .boolean()
                        .describe("true if the response is true, false if not"),
                    }),
                    second: z.object({
                      text: z
                        .string()
                        .describe("the second answer of the quiz"),
                      isTrue: z
                        .boolean()
                        .describe("true if the response is true, false if not"),
                    }),
                    third: z.object({
                      text: z.string().describe("the third answer of the quiz"),
                      isTrue: z
                        .boolean()
                        .describe("true if the response is true, false if not"),
                    }),
                    fourth: z.object({
                      text: z
                        .string()
                        .describe("the fourth answer of the quiz"),
                      isTrue: z
                        .boolean()
                        .describe("true if the response is true, false if not"),
                    }),
                  })
                  .describe(
                    "this is the hole object, ONLY ONE OPTION CAN BE TRUE",
                  ),
              ])
              .describe(
                "this is a paragraph chunk, it can be either be a static text or an hole object, but not both",
              ),
          }),
        )
        .describe("this is a paragraph, aka array of chunks"),
    )
    .describe("this is an array of paragraphs"),
});

// export const quizSchema = z.object({
//   questionTypes: z.array(
//     z
//       .union([
//         textareaSchema.describe(
//           "open-ended question to the user. THIS IS NOT A QUESTION TO GET THE INTENTION OF THE USER, IT'S ONLY TO QUIZ THEM",
//         ),
//         trueOrFalseSchema.describe("a true/false question"),
//       ])
//       .describe("Use both textareaSchema and trueOrFalseSchema"),
//   ),
// });
export const quizSchema = z.object({
  questionTypes: z.array(
    z
      .union([
        openEndedSchema.describe(
          "mid to long open-ended question to the user. THIS IS NOT A QUESTION TO GET THE INTENTION OF THE USER, IT'S ONLY TO QUIZ THEM",
        ),
        trueOrFalseSchema.describe("a true/false question"),
        multipleChoiceSchema.describe(
          "a multiple choice question where ONLY ONE answer is true",
        ),
      ])
      .describe(
        "You must NOT ony one type of question. For every question you come up choose the best fitting question type. (example: if it's a true/false question choose the trueOrFalseSchema, if it's an open ended question choose the textAreaSchema)",
      ),
  ),
});
