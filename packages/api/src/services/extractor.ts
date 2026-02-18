import pdf from "pdf-parse";
import mammoth from "mammoth";
import { readFileSync } from "fs";

export async function extractText(filePath: string): Promise<string> {
  const ext = filePath.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return extractPdf(filePath);
  }

  if (ext === "docx") {
    return extractDocx(filePath);
  }

  throw new Error(`Unsupported file type: .${ext}`);
}

async function extractPdf(filePath: string): Promise<string> {
  const buffer = readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text;
}

async function extractDocx(filePath: string): Promise<string> {
  const buffer = readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
