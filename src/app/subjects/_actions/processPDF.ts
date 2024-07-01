import { InsertEmbedding } from "@/db/schema";
import { EmbedMany } from "@/ai/embedMany";
import { semanticChunkPDF } from "@/utils/semanticChunk";

export async function processPDF(pdf: File, materialID: number) {
  "use server";
  if (!pdf || !materialID) {
    throw new Error("no pdf of material id provided");
  }
  const arrayBuffer = await pdf.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Use semanticChunkPDF, but add cleaning step
  const dirtyPages = await semanticChunkPDF(buffer);
  const cleanedPages = dirtyPages.map(cleanText);

  const vectors = (await EmbedMany(cleanedPages)) as number[][];
  const e: InsertEmbedding[] = [];
  for (let i = 0; i < cleanedPages.length; i++) {
    e.push({
      materialID,
      vector: vectors[i],
      content: cleanedPages[i],
    });
  }
  return e;
}

const cleanText = (text: string) => {
  return text
    .replace(/\x00/g, "") // Remove null bytes
    .replace(/[\x01-\x1F\x7F-\x9F]/g, "") // Remove other control characters
    .replace(/\uFFFD/g, "") // Remove replacement character
    .trim();
};
