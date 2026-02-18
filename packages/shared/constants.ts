export const DISCLAIMER =
  "DISCLAIMER: LegalGuard is an AI-powered informational tool. It does NOT provide legal advice. Results are for educational purposes only. Always consult a licensed attorney for legal decisions regarding your lease.";

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

export const SCAN_STAGES: Record<string, { label: string; progress: number }> =
  {
    pending: { label: "Queued", progress: 0 },
    parsing: { label: "Reading your lease...", progress: 25 },
    analyzing: { label: "Identifying risky clauses...", progress: 50 },
    writing: { label: "Translating to plain English...", progress: 75 },
    complete: { label: "Report ready!", progress: 100 },
    failed: { label: "Something went wrong", progress: 0 },
  };

export const PRICING = {
  single: {
    name: "Single Scan",
    price: 19,
    description: "One-time lease analysis",
    features: [
      "Top 5 risky clauses identified",
      "Plain English explanations",
      "Overall safety score",
      "Downloadable PDF report",
      "Shareable report link",
    ],
  },
  unlimited: {
    name: "Unlimited Monthly",
    price: 9,
    period: "month",
    description: "Unlimited scans for apartment hunters",
    features: [
      "Everything in Single Scan",
      "Unlimited lease scans",
      "Compare multiple leases",
      "Priority processing",
      "Cancel anytime",
    ],
  },
} as const;
