interface SafetyScoreProps {
  score: number;
  verdict: string;
}

export default function SafetyScore({ score, verdict }: SafetyScoreProps) {
  const getColor = (s: number) => {
    if (s >= 70) return { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500" };
    if (s >= 40) return { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" };
    return { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500" };
  };

  const getLabel = (s: number) => {
    if (s >= 70) return "Low Risk";
    if (s >= 40) return "Moderate Risk";
    return "High Risk";
  };

  const colors = getColor(score);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Overall Safety Score</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
          {getLabel(score)}
        </span>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <span className={`text-5xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-2xl text-slate-400 mb-1">/100</span>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-slate-600">{verdict}</p>
    </div>
  );
}
