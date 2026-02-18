import { Hono } from "hono";
import { db } from "../db";
import { scans } from "../db/schema";
import { eq } from "drizzle-orm";
import type { LeaseReport } from "shared/types";

const report = new Hono();

report.get("/:id", async (c) => {
  const id = c.req.param("id");

  const record = await db.query.scans.findFirst({
    where: eq(scans.id, id),
  });

  if (!record) {
    return c.json({ error: "Report not found" }, 404);
  }

  if (record.status !== "complete") {
    return c.json(
      { error: "Report not ready", status: record.status },
      202
    );
  }

  if (!record.reportJson) {
    return c.json({ error: "Report data missing" }, 500);
  }

  const reportData: LeaseReport = JSON.parse(record.reportJson);
  return c.json(reportData);
});

export default report;
