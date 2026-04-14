import { Search } from "lucide-react"

// Strength config
const STRENGTH = {
  strong: {
    label: "Strong",
    color: "bg-emerald-500",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    segments: 4,
  },
  medium: {
    label: "Medium",
    color: "bg-amber-400",
    dot: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    segments: 2,
  },
  weak: {
    label: "Weak",
    color: "bg-red-500",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    segments: 1,
  },
}

// Avatar color map
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function PasswordCard({ entry, selected, onClick }) {
  const str = STRENGTH[entry.strength] ?? STRENGTH.medium
  const avatarColor = getAvatarColor(entry.name)

  return (
    <button
      onClick={() => onClick(entry)}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border transition-all duration-150 text-left group ${
        selected
          ? "border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-900/20"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 ${avatarColor}`}
      >
        {entry.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {entry.name}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
          {entry.username}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`w-2 h-2 rounded-full ${str.dot}`} title={str.label} />
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          {entry.updatedAt}
        </span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-150 ${
            selected
              ? "text-violet-400 translate-x-0.5"
              : "text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5"
          }`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>
    </button>
  )
}

export default function PasswordList({ entries = [], selectedId, onSelect }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950 w-450">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-base font-semibold text-zinc-900 dark:text-white flex-1">
            All items
          </h1>
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search…"
              className="pl-7 pr-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/40 transition-all w-40"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 w-240 mx-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 gap-2">
              <svg
                className="w-10 h-10 opacity-40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
              <p className="text-sm">No passwords yet</p>
            </div>
          ) : (
            entries.map((entry) => (
              <PasswordCard
                key={entry.id}
                entry={entry}
                selected={selectedId === entry.id}
                onClick={onSelect}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
