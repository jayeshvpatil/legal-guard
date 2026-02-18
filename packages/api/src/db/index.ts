import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";

const dbPath = process.env.DATABASE_URL || "./data/legalguard.db";
const dir = dirname(dbPath);

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle(sqlite, { schema });
