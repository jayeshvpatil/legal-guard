import Anthropic from "@anthropic-ai/sdk";
import type { ParsedLease } from "shared/types";

const client = new Anthropic();

export async function parseLeaseDocument(
  rawText: string
): Promise<ParsedLease> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a lease document parser. Extract structured information from this lease document.

Return ONLY valid JSON with no markdown formatting. Use this exact schema:
{
  "title": "string - the lease title or type",
  "parties": { "landlord": "string", "tenant": "string" },
  "sections": [
    {
      "id": "string - section number like 1, 2, 3a",
      "heading": "string - section title",
      "content": "string - full section text",
      "clauseCount": number
    }
  ],
  "fullText": "string - complete document text",
  "documentType": "residential" | "commercial" | "unknown"
}

LEASE DOCUMENT:
${rawText}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as ParsedLease;
}
