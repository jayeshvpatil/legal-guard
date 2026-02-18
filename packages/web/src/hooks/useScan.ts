import { useState, useCallback, useRef } from "react";
import { uploadLease, startScan, getScanStatus } from "../lib/api";
import type { ScanStatus } from "shared/types";

interface ScanState {
  status: "idle" | "uploading" | ScanStatus;
  scanId: string | null;
  progress: number;
  error: string | null;
}

export function useScan() {
  const [state, setState] = useState<ScanState>({
    status: "idle",
    scanId: null,
    progress: 0,
    error: null,
  });
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(
    (id: string) => {
      pollingRef.current = setInterval(async () => {
        try {
          const status = await getScanStatus(id);
          setState((prev) => ({
            ...prev,
            status: status.status,
            progress: status.progress,
          }));

          if (status.status === "complete" || status.status === "failed") {
            stopPolling();
          }
        } catch {
          stopPolling();
          setState((prev) => ({
            ...prev,
            status: "failed",
            error: "Lost connection to server",
          }));
        }
      }, 2000);
    },
    [stopPolling]
  );

  const scan = useCallback(
    async (file: File) => {
      try {
        setState({ status: "uploading", scanId: null, progress: 0, error: null });

        const uploaded = await uploadLease(file);
        setState((prev) => ({
          ...prev,
          scanId: uploaded.id,
          status: "pending",
          progress: 0,
        }));

        await startScan(uploaded.id);
        setState((prev) => ({ ...prev, status: "parsing", progress: 25 }));

        pollStatus(uploaded.id);
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: "failed",
          error: err instanceof Error ? err.message : "Something went wrong",
        }));
      }
    },
    [pollStatus]
  );

  const reset = useCallback(() => {
    stopPolling();
    setState({ status: "idle", scanId: null, progress: 0, error: null });
  }, [stopPolling]);

  return { ...state, scan, reset };
}
