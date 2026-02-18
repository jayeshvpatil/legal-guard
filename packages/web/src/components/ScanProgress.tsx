import { SCAN_STAGES } from "shared/constants";
import type { ScanStatus } from "shared/types";

interface ScanProgressProps {
  status: "uploading" | ScanStatus;
  progress: number;
  error: string | null;
}

export default function ScanProgress({ status, progress, error }: ScanProgressProps) {
  const stage = status === "uploading"
    ? { label: "Uploading your lease...", progress: 10 }
    : SCAN_STAGES[status] || { label: "Processing...", progress: 0 };

  const displayProgress = status === "uploading" ? 10 : progress;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "failed" ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-800">Scan Failed</p>
            <p className="text-slate-500 mt-2">{error || "Something went wrong. Please try again."}</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-800">{stage.label}</p>
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-400 mt-2">{displayProgress}% complete</p>
          </>
        )}
      </div>
    </div>
  );
}
