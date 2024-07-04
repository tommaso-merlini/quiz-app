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

function semanticChunking(text: string, maxWords: number = 100): string[] {
  const sentenceRegex =
    /[^.!?]+(?:[.!?]+(?=\s+[A-Z]|\s*$)|\([^)]*\)|\[[^\]]*\]|(?=\s*$))/g;
  const sentences = text.match(sentenceRegex) || [];
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);

    for (const word of words) {
      if (currentWordCount >= maxWords) {
        chunks.push(currentChunk.join(" ").trim());
        currentChunk = [];
        currentWordCount = 0;
      }

      currentChunk.push(word);
      currentWordCount++;
    }

    // Add a space after each sentence, unless it's the last one
    if (sentence !== sentences[sentences.length - 1]) {
      currentChunk.push(" ");
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" ").trim());
  }

  return chunks;
}

export async function semanticChunkPDF(buffer: Uint8Array): Promise<string[]> {
  const text = await extractTextFromPDF(buffer);
  const chunks = semanticChunking(text);
  return chunks;
}
