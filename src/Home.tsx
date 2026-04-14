import DesktopLeftNavbar from "./navbar/HomeLeftNavbar"
import { BlogPostCard } from "loony-ui"
import { useNavigate } from "react-router"
import ProjectCard from "./ProjectCard"

const projects = [
  {
    id: 1,
    title: "Aegis",
    route: "aegis",
    description: "Authentication & access control system",
    category: "Security",
    categoryColor: "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30",
    icon: "🛡",
    bannerBg: "from-violet-950 to-slate-900",
    updatedAt: "2d ago",
    language: "Go",
    languageDot: "bg-cyan-400",
    stars: 4,
  },
  {
    id: 2,
    title: "Voice Streaming",
    route: "voiceStreaming",
    description: "Real-time audio capture & streaming pipeline",
    category: "Audio",
    categoryColor:
      "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
    icon: "🎙",
    bannerBg: "from-emerald-950 to-slate-900",
    updatedAt: "5d ago",
    language: "Rust",
    languageDot: "bg-orange-400",
    stars: 7,
  },
  // {
  //   id: 3,
  //   title: "Trading",
  //   route: "trading",
  //   description: "Algorithmic trading engine & market data feeds",
  //   category: "Finance",
  //   categoryColor: "bg-green-500/20 text-green-300 ring-1 ring-green-500/30",
  //   icon: "📈",
  //   bannerBg: "from-green-950 to-slate-900",
  //   updatedAt: "1w ago",
  //   language: "Python",
  //   languageDot: "bg-blue-400",
  //   stars: 12,
  // },
  {
    id: 4,
    title: "Algorithms",
    route: "algorithms",
    description: "Data structures, sorting & graph traversal",
    category: "CS",
    categoryColor: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30",
    icon: "⚡",
    bannerBg: "from-amber-950 to-slate-900",
    updatedAt: "3d ago",
    language: "C++",
    languageDot: "bg-pink-400",
    stars: 9,
  },
  {
    id: 5,
    title: "Colors",
    route: "colors",
    description: "Color theory, palettes & accessibility tooling",
    category: "Design",
    categoryColor: "bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/30",
    icon: "🎨",
    bannerBg: "from-pink-950 to-slate-900",
    updatedAt: "6d ago",
    language: "TypeScript",
    languageDot: "bg-blue-500",
    stars: 5,
  },
  {
    id: 6,
    title: "Web Video Call",
    route: "videoCall",
    description: "Peer-to-peer video calling via browser APIs",
    category: "WebRTC",
    categoryColor: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30",
    icon: "📹",
    bannerBg: "from-sky-950 to-slate-900",
    updatedAt: "2w ago",
    language: "JavaScript",
    languageDot: "bg-yellow-400",
    stars: 15,
  },
  {
    id: 7,
    title: "Web Templates",
    route: "webTemplates",
    description: "Reusable HTML/CSS layouts & component starters",
    category: "Templates",
    categoryColor: "bg-slate-400/20 text-slate-300 ring-1 ring-slate-400/30",
    icon: "🗂",
    bannerBg: "from-slate-800 to-slate-900",
    updatedAt: "4d ago",
    language: "HTML",
    languageDot: "bg-orange-500",
    stars: 3,
  },
  {
    id: 8,
    title: "SIP Client",
    route: "sipClient",
    description: "SIP-based VoIP client with call management",
    category: "VoIP",
    categoryColor: "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30",
    icon: "📞",
    bannerBg: "from-rose-950 to-slate-900",
    updatedAt: "1w ago",
    language: "Kotlin",
    languageDot: "bg-purple-400",
    stars: 6,
  },
]

export default function Home({ appContext, mobileNavOpen }: any) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-row flex-1">
      <DesktopLeftNavbar
        appContext={appContext}
        mobileNavOpen={mobileNavOpen}
      />
      <div className="bg-layout-body p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {projects.map((project) => {
            return (
              <ProjectCard
                key={project.id}
                navigate={() =>
                  navigate(`/${project.route}`, { replace: true })
                }
                image=""
                project={project}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
