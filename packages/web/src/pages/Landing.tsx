import { useNavigate } from "react-router-dom";
import UploadZone from "../components/UploadZone";
import ScanProgress from "../components/ScanProgress";
import PricingTier from "../components/PricingTier";
import Disclaimer from "../components/Disclaimer";
import { useScan } from "../hooks/useScan";
import { PRICING } from "shared/constants";

export default function Landing() {
  const navigate = useNavigate();
  const { status, scanId, progress, error, scan, reset } = useScan();

  const isScanning =
    status !== "idle" && status !== "complete" && status !== "failed";

  // Navigate to report when complete
  if (status === "complete" && scanId) {
    navigate(`/report/${scanId}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LG</span>
            </div>
            <span className="font-bold text-xl text-slate-800">LegalGuard</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-800">
              Pricing
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Upload your lease.
          <br />
          <span className="text-emerald-600">Get 5 risky clauses</span> in plain English.
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          AI-powered lease analysis that spots dangerous clauses and explains them
          in words anyone can understand. Know your rights before you sign.
        </p>
      </section>

      {/* Upload / Progress */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 pb-16">
        {isScanning || status === "failed" ? (
          <div>
            <ScanProgress status={status} progress={progress} error={error} />
            {status === "failed" && (
              <div className="text-center mt-4">
                <button
                  onClick={reset}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        ) : (
          <UploadZone onFileSelected={scan} disabled={isScanning} />
        )}
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Drop your lease PDF or DOCX. We never store your documents permanently.",
              },
              {
                step: "2",
                title: "AI Scans",
                desc: "Three AI agents parse, analyze, and translate your lease in under 30 seconds.",
              },
              {
                step: "3",
                title: "Get Results",
                desc: "See the top 5 risky clauses with plain English explanations and action steps.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-700 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="font-semibold text-slate-800 text-lg">{item.title}</h3>
                <p className="text-slate-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">
          Simple, transparent pricing
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingTier
            {...PRICING.single}
            onSelect={() => document.querySelector<HTMLElement>(".cursor-pointer")?.click()}
          />
          <PricingTier
            {...PRICING.unlimited}
            highlighted
            onSelect={() => document.querySelector<HTMLElement>(".cursor-pointer")?.click()}
          />
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm">Encrypted & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Results in ~30 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">10,000+ leases scanned</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Disclaimer />
        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span>LegalGuard &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600">Terms</a>
            <a href="#" className="hover:text-slate-600">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
