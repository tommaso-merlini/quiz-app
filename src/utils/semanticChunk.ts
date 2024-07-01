"use server";
import * as pdfjsLib from "pdfjs-dist";

async function extractTextFromPDF(buffer: Uint8Array): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item: any) => "str" in item)
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + " ";
  }

  return fullText;
}

function semanticChunking(
  text: string,
  minChunkSize: number = 100,
  maxChunkSize: number = 500,
): string[] {
  // Regex migliorata per gestire meglio le parentesi e altri casi speciali
  const sentenceRegex =
    /[^.!?]+(?:[.!?]+(?=\s+[A-Z]|\s*$)|\([^)]*\)|\[[^\]]*\]|(?=\s*$))/g;
  const sentences = text.match(sentenceRegex) || [];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxChunkSize) {
      currentChunk += sentence + " ";
    } else {
      if (currentChunk.length >= minChunkSize) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence + " ";
    }
  }

  if (currentChunk.length >= minChunkSize) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function semanticChunkPDF(buffer: Uint8Array): Promise<string[]> {
  const text = await extractTextFromPDF(buffer);
  const chunks = semanticChunking(text);
  return chunks;
}
