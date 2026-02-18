import { parseLeaseDocument } from "./lease-parser";
import { analyzeLeaseRisks } from "./risk-analyzer";
import { writePlainEnglish } from "./plain-writer";
import { db } from "../db";
import { scans } from "../db/schema";
import { eq } from "drizzle-orm";
import type { LeaseReport, ScanStatus } from "shared/types";

async function updateScanStatus(scanId: string, status: ScanStatus) {
  await db.update(scans).set({ status }).where(eq(scans.id, scanId));
}

export async function runLeaseAnalysis(
  scanId: string,
  rawText: string
): Promise<LeaseReport> {
  try {
    // Stage 1: Parse
    await updateScanStatus(scanId, "parsing");
    const parsed = await parseLeaseDocument(rawText);

    // Stage 2: Analyze risks
    await updateScanStatus(scanId, "analyzing");
    const risks = await analyzeLeaseRisks(parsed);

    // Stage 3: Plain English
    await updateScanStatus(scanId, "writing");
    const report = await writePlainEnglish(risks, scanId);

    // Save results
    await db
      .update(scans)
      .set({
        status: "complete",
        overallScore: report.overallScore,
        reportJson: JSON.stringify(report),
        completedAt: new Date(),
      })
      .where(eq(scans.id, scanId));

    return report;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    await db
      .update(scans)
      .set({ status: "failed", errorMessage: message })
      .where(eq(scans.id, scanId));
    throw error;
  }
}
