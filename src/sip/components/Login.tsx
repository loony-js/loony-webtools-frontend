import React, { useState } from "react"
import { useSoftphone } from "../../context/SoftPhoneContext"
import { CallState } from "../types/softphone"

export const LoginForm: React.FC = () => {
  const { initialize, callState, error } = useSoftphone()

  const [config, setConfig] = useState({
    websocketUrl: "ws://10.140.186.48:8088/ws",
    sipUri: "sip:1000@10.46.25.48",
    password: "password",
    displayName: "1000",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await initialize(config)
  }

  const isConnecting = callState === CallState.REGISTERING

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-loony-darker)] p-4">
      <div className="w-full max-w-md bg-[var(--color-loony-dark)] border border-[#4d4d4d] rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white text-center">
          SIP Phone Login
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* WebSocket URL */}
          <div>
            <label className="block text-sm mb-1">WebSocket URL</label>
            <input
              type="text"
              value={config.websocketUrl}
              onChange={(e) =>
                setConfig({ ...config, websocketUrl: e.target.value })
              }
              placeholder="wss://server:7443"
              disabled={isConnecting}
              required
              className="w-full px-3 py-2 rounded-md bg-[var(--color-loony-darker)] border border-[#4d4d4d] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-loony-primary)] disabled:opacity-60"
            />
          </div>

          {/* SIP URI */}
          <div>
            <label className="block text-sm mb-1">SIP URI</label>
            <input
              type="text"
              value={config.sipUri}
              onChange={(e) => setConfig({ ...config, sipUri: e.target.value })}
              placeholder="sip:user@domain"
              disabled={isConnecting}
              required
              className="w-full px-3 py-2 rounded-md bg-[var(--color-loony-darker)] border border-[#4d4d4d] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-loony-primary)] disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={config.password}
              onChange={(e) =>
                setConfig({ ...config, password: e.target.value })
              }
              disabled={isConnecting}
              required
              className="w-full px-3 py-2 rounded-md bg-[var(--color-loony-darker)] border border-[#4d4d4d] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-loony-primary)] disabled:opacity-60"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm mb-1">
              Display Name (optional)
            </label>
            <input
              type="text"
              value={config.displayName}
              onChange={(e) =>
                setConfig({ ...config, displayName: e.target.value })
              }
              disabled={isConnecting}
              className="w-full px-3 py-2 rounded-md bg-[var(--color-loony-darker)] border border-[#4d4d4d] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-loony-primary)] disabled:opacity-60"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isConnecting}
            className="w-full py-2.5 rounded-md bg-button-green-DEFAULT text-white font-medium hover:bg-button-green-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConnecting ? "Connecting..." : "Login"}
          </button>

          {/* Status */}
          <div className="text-center text-sm">
            Status:{" "}
            <span
              className={`font-medium ${
                callState === CallState.REGISTERED
                  ? "text-green-400"
                  : callState === CallState.REGISTERING
                    ? "text-yellow-400"
                    : "text-gray-500"
              }`}
            >
              {callState}
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
