import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import upload from "./routes/upload";
import scan from "./routes/scan";
import report from "./routes/report";
import webhook from "./routes/webhook";

// Run migrations on startup
import "./db/migrate";

const app = new Hono();

// Middleware
app.use("/*", cors());
app.use("/*", logger());

// Health check
app.get("/api/health", (c) =>
  c.json({ status: "ok", service: "legalguard-api" })
);

// Routes
app.route("/api/upload", upload);
app.route("/api/scan", scan);
app.route("/api/report", report);
app.route("/api/webhook", webhook);

const port = parseInt(process.env.PORT || "3000");

console.log(`LegalGuard API running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
