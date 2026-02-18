import { Hono } from "hono";
import { db } from "../db";
import { scans } from "../db/schema";
import { eq } from "drizzle-orm";
import { runLeaseAnalysis } from "../agents/pipeline";
import { extractText } from "../services/extractor";
import type { ScanResponse, ScanStatusResponse } from "shared/types";
import { SCAN_STAGES } from "shared/constants";

const scan = new Hono();

// Start a scan
scan.post("/", async (c) => {
  const { id } = await c.req.json<{ id: string }>();

  if (!id) {
    return c.json({ error: "Scan ID is required" }, 400);
  }

  const record = await db.query.scans.findFirst({
    where: eq(scans.id, id),
  });

  if (!record) {
    return c.json({ error: "Scan not found" }, 404);
  }

  if (record.status !== "pending") {
    return c.json({ error: "Scan already started" }, 400);
  }

  // Run pipeline in background (don't await)
  extractText(record.uploadPath).then((text) => {
    runLeaseAnalysis(id, text).catch((err) => {
      console.error(`Scan ${id} failed:`, err);
    });
  });

  const response: ScanResponse = {
    scanId: id,
    status: "parsing",
  };

  return c.json(response, 202);
});

// Get scan status
scan.get("/:id/status", async (c) => {
  const id = c.req.param("id");

  const record = await db.query.scans.findFirst({
    where: eq(scans.id, id),
  });

  if (!record) {
    return c.json({ error: "Scan not found" }, 404);
  }

  const stage = SCAN_STAGES[record.status];

  const response: ScanStatusResponse = {
    scanId: id,
    status: record.status as ScanStatusResponse["status"],
    progress: stage?.progress ?? 0,
  };

  return c.json(response);
});

export default scan;
