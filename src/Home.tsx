import DesktopLeftNavbar from "./navbar/HomeLeftNavbar"
import { BlogPostCard } from "loony-ui"
import { useNavigate } from "react-router"

const cards = [
  {
    id: 1,
    title: "Aegis",
    route: "aegis",
    description:
      "Never forget your username and password. We store them securely.",
  },
  {
    id: 2,
    title: "Voice Streaming",
    route: "voiceStreaming",
    description: "Stream audio data.",
  },
  {
    id: 3,
    title: "Trading",
    route: "trading",
    description: "Stocks and Market trading view.",
  },
  {
    id: 4,
    title: "Algorithms",
    route: "algorithms",
    description: "Visual representation of algorithms.",
  },
  {
    id: 4,
    title: "Colors",
    route: "colors",
    description: "Visual representation of css colors.",
  },
  {
    id: 5,
    title: "Web Video Call",
    route: "videoCall",
    description: "Video call using WebRTC",
  },
  {
    id: 6,
    title: "Web Templates",
    route: "webTemplates",
    description: "Web Teamplates",
  },
  {
    id: 7,
    title: "SIP Client",
    route: "sipClient",
    description: "SIP Client for VoIP communication",
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
      <div className="bg-loony-dark p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {cards.map((card) => {
            return (
              <BlogPostCard
                key={card.id}
                navigate={() => navigate(`/${card.route}`, { replace: true })}
                image=""
                node={card}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
