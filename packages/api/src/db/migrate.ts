import { db } from "./index";
import { scans, users } from "./schema";
import { sql } from "drizzle-orm";

// Simple migration: create tables if they don't exist
db.run(sql`CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  upload_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  overall_score REAL,
  report_json TEXT,
  error_message TEXT,
  stripe_payment_id TEXT,
  created_at INTEGER NOT NULL,
  completed_at INTEGER
)`);

db.run(sql`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  scans_remaining INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
)`);

console.log("Database migrated successfully");
