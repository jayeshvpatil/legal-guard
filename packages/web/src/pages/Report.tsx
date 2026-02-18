import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getReport } from "../lib/api";
import SafetyScore from "../components/SafetyScore";
import RiskCard from "../components/RiskCard";
import Disclaimer from "../components/Disclaimer";
import ScanProgress from "../components/ScanProgress";
import type { LeaseReport } from "shared/types";

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<LeaseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchReport() {
      try {
        const data = await getReport(id!);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <ScanProgress status="analyzing" progress={50} error={null} />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-800">Report not found</p>
          <p className="text-slate-500 mt-2">{error || "This report may still be processing."}</p>
          <Link to="/" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-medium">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LG</span>
            </div>
            <span className="font-bold text-xl text-slate-800">LegalGuard</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Report #{id?.slice(0, 8)}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Disclaimer banner */}
        <Disclaimer />

        {/* Safety Score */}
        <SafetyScore score={report.overallScore} verdict={report.overallVerdict} />

        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Top {report.clauses.length} Risky Clauses
          </h2>
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
              {report.clauses.filter((c) => c.riskLevel === "high").length} High
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700">
              {report.clauses.filter((c) => c.riskLevel === "medium").length} Medium
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
              {report.clauses.filter((c) => c.riskLevel === "low").length} Low
            </span>
          </div>
        </div>

        {/* Risk Cards */}
        {report.clauses.map((clause, i) => (
          <RiskCard key={clause.sectionId} clause={clause} index={i} />
        ))}

        {/* Insurance CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <p className="text-lg font-semibold text-emerald-800">
            Protect yourself with tenant insurance
          </p>
          <p className="text-emerald-600 mt-1">
            Coverage starting at $5/month. Covers security deposits, liability, and more.
          </p>
          <button className="mt-4 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
            Learn More
          </button>
        </div>

        {/* Footer disclaimer */}
        <Disclaimer />

        <div className="text-center text-sm text-slate-400 pb-8">
          <Link to="/" className="hover:text-slate-600">Scan another lease</Link>
          <span className="mx-2">&middot;</span>
          <span>LegalGuard &copy; {new Date().getFullYear()}</span>
        </div>
      </main>
    </div>
  );
}
