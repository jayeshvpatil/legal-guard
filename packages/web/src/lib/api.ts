import type {
  UploadResponse,
  ScanResponse,
  ScanStatusResponse,
  LeaseReport,
} from "shared/types";

const API_BASE = "/api";

export async function uploadLease(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Upload failed");
  }

  return res.json();
}

export async function startScan(id: string): Promise<ScanResponse> {
  const res = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Scan failed to start");
  }

  return res.json();
}

export async function getScanStatus(id: string): Promise<ScanStatusResponse> {
  const res = await fetch(`${API_BASE}/scan/${id}/status`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to get status");
  }

  return res.json();
}

export async function getReport(id: string): Promise<LeaseReport> {
  const res = await fetch(`${API_BASE}/report/${id}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to get report");
  }

  return res.json();
}
