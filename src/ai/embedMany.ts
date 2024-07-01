import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";

export async function EmbedMany(values: string[]) {
  "use server";
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values,
  });
  return embeddings;
}
