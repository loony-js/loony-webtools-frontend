import { useState } from "react"

function StarIcon({ filled }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${filled ? "text-amber-400" : "text-slate-600"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  )
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-slate-600 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
    >
      {/* Banner */}
      <div
        className={`relative h-28 bg-gradient-to-br ${project.bannerBg} flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <span className="text-4xl select-none drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
          {project.icon}
        </span>
        {/* Category badge */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full ${project.categoryColor}`}
        >
          {project.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-1 truncate">
          {project.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-sky-900 border border-sky-700 flex items-center justify-center text-[10px] font-semibold text-sky-300 flex-shrink-0">
              SB
            </div>
            <span className="text-[11px] text-slate-500 truncate max-w-[80px]">
              Sankar Boro
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3">
            {/* Language */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${project.languageDot}`} />
              <span className="text-[11px] text-slate-500">
                {project.language}
              </span>
            </div>
            {/* Stars */}
            <div className="flex items-center gap-1">
              <StarIcon filled />
              <span className="text-[11px] text-slate-500">
                {project.stars}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Updated at ribbon */}
      <div className="px-4 pb-3">
        <span className="text-[10px] text-slate-600">
          Updated {project.updatedAt}
        </span>
      </div>

      {/* Hover shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}

export default function ProjectGallery() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const categories = [
    "All",
    "Security",
    "Audio",
    "Finance",
    "CS",
    "Design",
    "WebRTC",
    "Templates",
    "VoIP",
  ]

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "All" || p.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              My Projects
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {filtered.length} of {projects.length} projects · Sankar Boro
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors duration-200">
            <span className="text-lg leading-none">+</span>
            New project
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  filter === cat
                    ? "bg-white text-slate-900"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-slate-400 text-sm">
              No projects match your search.
            </p>
            <button
              onClick={() => {
                setSearch("")
                setFilter("All")
              }}
              className="mt-3 text-xs text-slate-500 underline hover:text-slate-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
