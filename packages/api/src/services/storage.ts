// Cloudflare R2 storage (S3-compatible)
// Placeholder — requires R2 credentials to be configured

export async function uploadToR2(
  key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<string> {
  // TODO: Implement R2 upload when credentials are configured
  // For now, files are stored locally in ./data/uploads/
  console.log(`[Storage] Would upload ${key} to R2 (${contentType})`);
  return key;
}

export async function getFromR2(key: string): Promise<ArrayBuffer | null> {
  // TODO: Implement R2 download
  console.log(`[Storage] Would download ${key} from R2`);
  return null;
}
