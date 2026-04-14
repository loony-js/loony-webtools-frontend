import { useState, useRef, useEffect } from "react"
import Sidebar from "./Sidebar"

const transcripts = [
  "that will cost nine hundred dollars.",
  "my phone number is one eight hundred, four five six, eight nine ten.",
  "the time is six forty five p m.",
  "I live on thirty five lexington avenue",
  "the answer is six point five.",
  "send it to support at help dot com",
  "the options are apple forward slash banana forward slash orange period",
  "i got an x l t shirt",
  "my name is jennifer smith",
  "i want to visit new york city.",
  "i uh said that we can go to the uhmm movies.",
  "its its not that big of uhm a deal",
  "umm i think tomorrow should work",
  "how are you",
  "we can go to the mall park or beach",
  "they entered the room dot dot dot",
  "i heart emoji you period",
  "are you sure question mark",
]

function WaveformBars({ active }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-150 ${
            active ? "bg-emerald-400" : "bg-slate-600"
          }`}
          style={{
            height: active
              ? `${20 + Math.random() * 80}%`
              : `${15 + ((i * 7) % 40)}%`,
            animationDelay: `${i * 40}ms`,
            animation: active
              ? `wave ${0.6 + (i % 3) * 0.2}s ease-in-out infinite alternate`
              : "none",
          }}
        />
      ))}
    </div>
  )
}

function PulseRing({ active }) {
  if (!active) return null
  return (
    <span className="absolute inset-0 rounded-full animate-ping bg-rose-500 opacity-30" />
  )
}

export default function VoiceRecorder() {
  const [wsUrl, setWsUrl] = useState("ws://localhost:2011/ws")
  const [connected, setConnected] = useState(false)
  const [recording, setRecording] = useState(false)
  const [fileName, setFileName] = useState("")
  const [items, setItems] = useState(transcripts)
  const fileRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [items])

  // Simulated waveform animation tick
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!recording) return
    const id = setInterval(() => setTick((t) => t + 1), 120)
    return () => clearInterval(id)
  }, [recording])

  const handleConnect = () => setConnected((c) => !c)
  const handleRecord = () => {
    if (!connected) return
    setRecording((r) => !r)
  }
  const handleFile = (e) => {
    const f = e.target.files[0]
    if (f) setFileName(f.name)
  }

  return (
    <div className="flex-1 flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');
        * { font-family: 'IBM Plex Mono', monospace; }
        @keyframes wave {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .transcript-item {
          animation: fadeSlideIn 0.35s ease forwards;
        }
        .glow-green { box-shadow: 0 0 12px rgba(52, 211, 153, 0.35); }
        .glow-red { box-shadow: 0 0 12px rgba(239, 68, 68, 0.4); }
      `}</style>
      <Sidebar />

      <div className="min-h-screen bg-[#0d0f14] text-white font-mono flex items-center justify-center p-6 w-[100%]">
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');
        * { font-family: 'IBM Plex Mono', monospace; }
        @keyframes wave {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .transcript-item {
          animation: fadeSlideIn 0.35s ease forwards;
        }
        .glow-green { box-shadow: 0 0 12px rgba(52, 211, 153, 0.35); }
        .glow-red { box-shadow: 0 0 12px rgba(239, 68, 68, 0.4); }
      `}</style>

        <div className="w-full max-w-2xl flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-1">
                System Interface
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Voice Recorder
              </h1>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs tracking-widest uppercase font-medium transition-all duration-500 ${
                connected
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/40 glow-green"
                  : "border-rose-500/30 text-rose-400 bg-rose-950/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-rose-500"} ${connected ? "animate-pulse" : ""}`}
              />
              {connected ? "Connected" : "Disconnected"}
            </div>
          </div>

          {/* Connection Panel */}
          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">
              WebSocket Endpoint
            </p>
            <div className="flex gap-3">
              <input
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                className="flex-1 bg-[#0d0f14] border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-slate-500 transition-colors placeholder:text-slate-600"
                placeholder="ws://localhost:2011/ws"
              />
              <button
                onClick={handleConnect}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${
                  connected
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                    : "bg-white text-black hover:bg-slate-200"
                }`}
              >
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>

          {/* Recording Panel */}
          <div className="bg-[#13161e] border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Record Button */}
              <button
                onClick={handleRecord}
                disabled={!connected}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  !connected
                    ? "bg-slate-800 cursor-not-allowed opacity-40"
                    : recording
                      ? "bg-rose-500 hover:bg-rose-600 glow-red"
                      : "bg-white hover:bg-slate-100"
                }`}
              >
                {connected && recording && <PulseRing active={recording} />}
                {recording ? (
                  <span className="w-4 h-4 rounded-sm bg-white z-10" />
                ) : (
                  <svg
                    className="w-5 h-5 text-black z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6.364 9.182a.75.75 0 0 1 .75.75A7.002 7.002 0 0 1 12.75 17.93V20h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5v-2.07A7.002 7.002 0 0 1 4.886 10.93a.75.75 0 0 1 1.5 0 5.5 5.5 0 0 0 11 0 .75.75 0 0 1 .978-.748z" />
                  </svg>
                )}
              </button>

              {/* Status + Waveform */}
              <div className="flex-1">
                <p
                  className={`text-xs font-medium tracking-widest uppercase mb-2 ${recording ? "text-rose-400" : "text-slate-500"}`}
                >
                  {recording ? "● Recording..." : "Not Recording"}
                </p>
                <WaveformBars active={recording} key={tick} />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFile}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs hover:border-slate-500 hover:text-slate-200 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {fileName ? (
                  <span className="max-w-[100px] truncate text-emerald-400">
                    {fileName}
                  </span>
                ) : (
                  "Upload Audio"
                )}
              </button>
            </div>
          </div>

          {/* Transcript Panel */}
          <div className="bg-[#13161e] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase text-slate-500">
                  Transcript
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 rounded-full px-2 py-0.5">
                  {items.length}
                </span>
              </div>
              <button
                onClick={() => setItems([])}
                className="text-[10px] tracking-widest uppercase text-slate-600 hover:text-rose-400 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="h-64 overflow-y-auto px-5 py-4 flex flex-col gap-1.5 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-xs text-center gap-2 py-10">
                  <svg
                    className="w-8 h-8 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  No transcripts yet
                </div>
              ) : (
                items.map((text, i) => (
                  <div
                    key={i}
                    className="transcript-item flex items-start gap-3 group"
                  >
                    <span className="text-[10px] text-slate-700 w-5 text-right flex-shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
