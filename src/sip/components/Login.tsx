import React, { useState } from "react"
import { useSoftphone } from "../../context/SoftPhoneContext"
import { CallState } from "../types/softphone"
import "../sip.css"

export const LoginForm: React.FC = () => {
  const { initialize, callState, error } = useSoftphone()
  const [config, setConfig] = useState({
    websocketUrl: "ws://10.189.194.48:8088/ws",
    sipUri: "sip:1000@10.189.194.48",
    password: "password",
    displayName: "1000",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await initialize(config)
  }

  const isConnecting = callState === CallState.REGISTERING

  return (
    <div className="softphone-login">
      <h2>SIP Phone Login</h2>

      {error && <div className="error-message">Error: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>WebSocket URL:</label>
          <input
            type="text"
            value={config.websocketUrl}
            onChange={(e) =>
              setConfig({ ...config, websocketUrl: e.target.value })
            }
            placeholder="wss://server:7443"
            disabled={isConnecting}
            required
          />
        </div>

        <div className="form-group">
          <label>SIP URI:</label>
          <input
            type="text"
            value={config.sipUri}
            onChange={(e) => setConfig({ ...config, sipUri: e.target.value })}
            placeholder="sip:user@domain"
            disabled={isConnecting}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            disabled={isConnecting}
            required
          />
        </div>

        <div className="form-group">
          <label>Display Name (optional):</label>
          <input
            type="text"
            value={config.displayName}
            onChange={(e) =>
              setConfig({ ...config, displayName: e.target.value })
            }
            disabled={isConnecting}
          />
        </div>

        <button type="submit" disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Login"}
        </button>

        <div className="status">
          Status:{" "}
          <span className={`status-${callState.toLowerCase()}`}>
            {callState}
          </span>
        </div>
      </form>
    </div>
  )
}
