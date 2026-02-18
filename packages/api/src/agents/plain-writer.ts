import Anthropic from "@anthropic-ai/sdk";
import type { RiskAnalysis, LeaseReport } from "shared/types";
import { DISCLAIMER } from "shared/constants";

const client = new Anthropic();

export async function writePlainEnglish(
  riskAnalysis: RiskAnalysis,
  reportId: string
): Promise<LeaseReport> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: `You are a plain-language writer who translates legal jargon into simple English that anyone can understand. Write at a 6th-grade reading level. Be direct and specific. Use short sentences.

CRITICAL: This is an informational tool, NOT legal advice.`,
    messages: [
      {
        role: "user",
        content: `Rewrite each risky clause in plain English. For each clause provide:
1. A plain English explanation (2-3 sentences, simple words)
2. Why it matters to the tenant (1-2 sentences)
3. What the tenant can do about it (1-2 actionable sentences)

Also write a one-sentence overall verdict for the lease.

Return ONLY valid JSON with no markdown formatting. Use this exact schema:
{
  "overallScore": number,
  "overallVerdict": "string (one sentence plain English verdict of this lease)",
  "clauses": [
    {
      "sectionId": "string",
      "heading": "string",
      "originalText": "string",
      "plainEnglish": "string",
      "whyItMatters": "string",
      "whatYouCanDo": "string",
      "riskLevel": "high" | "medium" | "low",
      "riskCategory": "string",
      "riskScore": number
    }
  ],
  "disclaimer": "string"
}

RISK ANALYSIS:
${JSON.stringify(riskAnalysis, null, 2)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const result = JSON.parse(text);

  return {
    ...result,
    id: reportId,
    disclaimer: DISCLAIMER,
    createdAt: new Date().toISOString(),
  } as LeaseReport;
}
