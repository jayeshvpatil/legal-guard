import Anthropic from "@anthropic-ai/sdk";
import type { ParsedLease, RiskAnalysis } from "shared/types";

const client = new Anthropic();

export async function analyzeLeaseRisks(
  parsedLease: ParsedLease
): Promise<RiskAnalysis> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: `You are a tenant-rights risk analyzer. You identify clauses in leases that are potentially harmful, unusual, or one-sided against the tenant.

Common risk categories:
- Excessive fees or penalties
- Unreasonable entry/inspection rights
- Liability waivers favoring landlord
- Restrictive subletting or guest policies
- Automatic renewal traps
- Security deposit abuse
- Maintenance responsibility shifting
- Overly broad noise/behavior clauses
- Early termination penalties
- Waiver of tenant legal rights

IMPORTANT: You are an informational tool. You do NOT provide legal advice. Frame everything as risk highlights and educational summaries.`,
    messages: [
      {
        role: "user",
        content: `Analyze this parsed lease and return the top 5 riskiest clauses for the tenant.

Return ONLY valid JSON with no markdown formatting. Use this exact schema:
{
  "overallScore": number (0-100, where 100 is safest),
  "topRisks": [
    {
      "sectionId": "string",
      "heading": "string",
      "originalText": "string (exact quote from the lease)",
      "riskLevel": "high" | "medium" | "low",
      "riskCategory": "string",
      "riskScore": number (0-100, where 100 is most risky)
    }
  ],
  "summary": "string (2-3 sentence overall assessment)"
}

Return exactly 5 risks sorted by riskScore descending.

PARSED LEASE:
${JSON.stringify(parsedLease, null, 2)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as RiskAnalysis;
}
