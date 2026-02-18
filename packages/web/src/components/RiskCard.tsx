import type { PlainEnglishClause } from "shared/types";

interface RiskCardProps {
  clause: PlainEnglishClause;
  index: number;
}

export default function RiskCard({ clause, index }: RiskCardProps) {
  const riskColors = {
    high: { badge: "bg-red-100 text-red-700", border: "border-red-200" },
    medium: { badge: "bg-amber-100 text-amber-700", border: "border-amber-200" },
    low: { badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-200" },
  };

  const colors = riskColors[clause.riskLevel];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${colors.border} overflow-hidden`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-400">#{index + 1}</span>
          <h3 className="font-semibold text-slate-800">{clause.heading}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
            {clause.riskLevel.toUpperCase()}
          </span>
          <span className="text-xs text-slate-400">{clause.riskCategory}</span>
        </div>
      </div>

      {/* Split view: Original vs Plain English */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div className="p-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Original Legal Text
          </p>
          <p className="text-sm text-slate-600 font-mono leading-relaxed">
            "{clause.originalText}"
          </p>
        </div>
        <div className="p-6">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">
            Plain English
          </p>
          <p className="text-sm text-slate-800 leading-relaxed">
            {clause.plainEnglish}
          </p>
        </div>
      </div>

      {/* Why it matters + What you can do */}
      <div className="px-6 py-4 bg-slate-50 grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Why it matters
          </p>
          <p className="text-sm text-slate-700">{clause.whyItMatters}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            What you can do
          </p>
          <p className="text-sm text-slate-700">{clause.whatYouCanDo}</p>
        </div>
      </div>
    </div>
  );
}
