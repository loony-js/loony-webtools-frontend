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

export default function ProjectCard({ project, navigate }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={navigate}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-slate-600 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
    >
      {/* Banner */}
      <div
        className={`relative h-48 bg-gradient-to-br ${project.bannerBg} flex items-center justify-center overflow-hidden`}
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
      <div className="p-4 bg-card-top">
        <h3 className="text-sm font-semibold text-white mb-1 truncate">
          {project.title}
        </h3>
        <p className="text-sm text-text-primary leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-sky-900 border border-sky-700 flex items-center justify-center text-[10px] font-semibold text-sky-300 flex-shrink-0">
              SB
            </div>
            <span className="text-[11px] text-text-primary truncate max-w-[80px]">
              Sankar Boro
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3">
            {/* Language */}
            {/* <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${project.languageDot}`} />
              <span className="text-[11px] text-slate-500">
                {project.language}
              </span>
            </div> */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-text-primary">
                Updated {project.updatedAt}
              </span>
            </div>

            {/* Stars */}
            {/* <div className="flex items-center gap-1">
              <StarIcon filled />
              <span className="text-[11px] text-slate-500">
                {project.stars}
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Updated at ribbon */}
      {/* <div className="px-4 pb-3 bg-card-top">
        <span className="text-[10px] text-slate-600">
          Updated {project.updatedAt}
        </span>
      </div> */}

      {/* Hover shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}
