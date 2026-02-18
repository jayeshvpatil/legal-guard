interface PricingTierProps {
  name: string;
  price: number;
  period?: string;
  description: string;
  features: readonly string[];
  highlighted?: boolean;
  onSelect: () => void;
}

export default function PricingTier({
  name,
  price,
  period,
  description,
  features,
  highlighted,
  onSelect,
}: PricingTierProps) {
  return (
    <div
      className={`
        rounded-2xl p-8 flex flex-col
        ${highlighted
          ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-105"
          : "bg-white text-slate-800 shadow-sm border border-slate-200"
        }
      `}
    >
      <h3 className={`text-lg font-semibold ${highlighted ? "text-emerald-100" : "text-slate-500"}`}>
        {name}
      </h3>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">${price}</span>
        {period && (
          <span className={`text-lg ${highlighted ? "text-emerald-200" : "text-slate-400"}`}>
            /{period}
          </span>
        )}
      </div>

      <p className={`mt-2 ${highlighted ? "text-emerald-100" : "text-slate-500"}`}>
        {description}
      </p>

      <ul className="mt-6 space-y-3 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <svg
              className={`w-5 h-5 shrink-0 mt-0.5 ${highlighted ? "text-emerald-200" : "text-emerald-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`
          mt-8 w-full py-3 px-6 rounded-xl font-semibold transition-all text-center
          ${highlighted
            ? "bg-white text-emerald-600 hover:bg-emerald-50"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
          }
        `}
      >
        {period ? "Start Free Trial" : "Scan Now"}
      </button>
    </div>
  );
}
