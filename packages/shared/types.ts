// === Lease Parser Types ===

export interface ParsedLease {
  title: string;
  parties: {
    landlord: string;
    tenant: string;
  };
  sections: LeaseSection[];
  fullText: string;
  documentType: "residential" | "commercial" | "unknown";
}

export interface LeaseSection {
  id: string;
  heading: string;
  content: string;
  clauseCount: number;
}

// === Risk Analyzer Types ===

export interface RiskyClause {
  sectionId: string;
  heading: string;
  originalText: string;
  riskLevel: "high" | "medium" | "low";
  riskCategory: string;
  riskScore: number;
}

export interface RiskAnalysis {
  overallScore: number;
  topRisks: RiskyClause[];
  summary: string;
}

// === Plain English Writer Types ===

export interface PlainEnglishClause {
  sectionId: string;
  heading: string;
  originalText: string;
  plainEnglish: string;
  whyItMatters: string;
  whatYouCanDo: string;
  riskLevel: "high" | "medium" | "low";
  riskCategory: string;
  riskScore: number;
}

export interface LeaseReport {
  id: string;
  overallScore: number;
  overallVerdict: string;
  clauses: PlainEnglishClause[];
  disclaimer: string;
  createdAt: string;
}

// === API Types ===

export interface UploadResponse {
  id: string;
  filename: string;
  status: "uploaded";
}

export interface ScanResponse {
  scanId: string;
  status: ScanStatus;
}

export type ScanStatus =
  | "pending"
  | "parsing"
  | "analyzing"
  | "writing"
  | "complete"
  | "failed";

export interface ScanStatusResponse {
  scanId: string;
  status: ScanStatus;
  progress: number;
}

export interface CheckoutRequest {
  plan: "single" | "unlimited";
  scanId?: string;
}

export interface CheckoutResponse {
  url: string;
}
