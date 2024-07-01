"use server";

import { EmbedMany } from "@/ai/embedMany";
import { InsertEmbedding } from "@/db/schema";

export async function processText(text: string, materialID: number) {
  if (!text) {
    throw new Error("shit");
  }
  const words = text.split(/\s+/);
  const NUMBER_OF_WORDS = 700;
  const chunks = [];
  for (let i = 0; i < words.length; i += NUMBER_OF_WORDS) {
    chunks.push(words.slice(i, i + 700).join(" "));
  }
  const vectors = (await EmbedMany(chunks)) as number[][];
  const e: InsertEmbedding[] = [];
  for (let i = 0; i < chunks.length; i++) {
    e.push({
      materialID,
      vector: vectors[i],
      content: chunks[i],
    });
  }
  return e;
}
