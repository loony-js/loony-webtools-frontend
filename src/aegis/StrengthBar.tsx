const STRENGTH_CONFIG = {
  weak: {
    label: "Weak",
    segments: 1,
    color: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
  },
  medium: {
    label: "Medium",
    segments: 2,
    color: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  strong: {
    label: "Strong",
    segments: 4,
    color: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
}

const TOTAL_SEGMENTS = 4

/**
 * StrengthBar
 * @param {string} strength - "weak" | "medium" | "strong"
 */
export default function StrengthBar({ strength = "medium" }) {
  const config = STRENGTH_CONFIG[strength] ?? STRENGTH_CONFIG.medium

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Password strength
        </span>
        <span className={`text-[11px] font-medium ${config.text}`}>
          {config.label}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < config.segments
                ? config.color
                : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
