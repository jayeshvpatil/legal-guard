import { Hono } from "hono";
import { nanoid } from "nanoid";
import { db } from "../db";
import { scans } from "../db/schema";
import { mkdirSync, existsSync } from "fs";
import {
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
} from "shared/constants";
import type { UploadResponse } from "shared/types";

const upload = new Hono();

upload.post("/", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"];

  if (!file || !(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return c.json({ error: "File too large. Maximum size is 10MB." }, 400);
  }

  // Validate file type
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return c.json({ error: "Only PDF and DOCX files are supported." }, 400);
  }

  // Save file locally
  const id = nanoid();
  const uploadDir = "./data/uploads";
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = `${uploadDir}/${id}${ext}`;
  const buffer = await file.arrayBuffer();
  await Bun.write(filePath, buffer);

  // Create scan record
  await db.insert(scans).values({
    id,
    uploadPath: filePath,
    originalFilename: file.name,
    status: "pending",
    createdAt: new Date(),
  });

  const response: UploadResponse = {
    id,
    filename: file.name,
    status: "uploaded",
  };

  return c.json(response, 201);
});

export default upload;
