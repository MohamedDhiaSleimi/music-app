import type { RecommendationHit } from "../../types/recommendation.types";

interface Props {
  item: RecommendationHit;
  accent?: string;
}

export function RecommendationCard({ item, accent }: Props) {
  const subtitle = item.artists || "Suggested for you";
  const badge = item.year ? `${item.year}` : item.popularity ? `Pop ${item.popularity}` : "New";
  const matchScore =
    typeof item.distance === "number"
      ? Math.max(0, Number((100 - item.distance * 10).toFixed(1)))
      : null;

  return (
    <div className="min-w-[220px] bg-gradient-to-br from-white/70 to-white/30 backdrop-blur rounded-2xl border border-white/40 shadow-lg p-4 hover:-translate-y-1 transition">
      <div
        className="h-32 rounded-xl mb-4 relative overflow-hidden"
        style={{
          background: accent || "linear-gradient(135deg, #7c3aed, #22d3ee)",
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        {matchScore !== null && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/80 text-xs font-semibold text-gray-800">
            Match {matchScore}%
          </div>
        )}
        <div className="absolute bottom-3 left-3 text-white/90">
          <p className="text-xs uppercase tracking-wide">Recommended</p>
          <p className="text-lg font-bold leading-tight">{badge}</p>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{subtitle}</p>
    </div>
  );
}
