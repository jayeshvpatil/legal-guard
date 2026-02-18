import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const scans = sqliteTable("scans", {
  id: text("id").primaryKey(),
  uploadPath: text("upload_path").notNull(),
  originalFilename: text("original_filename").notNull(),
  status: text("status", {
    enum: ["pending", "parsing", "analyzing", "writing", "complete", "failed"],
  })
    .notNull()
    .default("pending"),
  overallScore: real("overall_score"),
  reportJson: text("report_json"),
  errorMessage: text("error_message"),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  plan: text("plan", { enum: ["free", "single", "unlimited"] })
    .notNull()
    .default("free"),
  scansRemaining: integer("scans_remaining").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
