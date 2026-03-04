import React, { useState, useRef } from "react"
import { useSoftphone } from "../../context/SoftPhoneContext"
import { CallState } from "../types/softphone"

export const CallControls: React.FC = () => {
  const {
    callState,
    currentSession,
    makeCall,
    answerCall,
    hangup,
    holdCall,
    unholdCall,
    mute,
    unmute,
    sendDTMF,
    transferCall,
    unregister,
  } = useSoftphone()

  const [targetNumber, setTargetNumber] = useState("")
  const [showDialpad, setShowDialpad] = useState(false)
  const [transferTarget, setTransferTarget] = useState("")
  const [showTransfer, setShowTransfer] = useState(false)

  const isInCall = callState === CallState.CALL_CONNECTED
  const isRinging = callState === CallState.CALL_RINGING
  const hasIncomingCall = callState === CallState.INCOMING_CALL
  const isOnHold = callState === CallState.CALL_ON_HOLD
  const isMuted = currentSession?.isMuted || false

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleDTMF = (tone: string) => {
    sendDTMF(tone)
  }

  const handleTransfer = () => {
    if (transferTarget) {
      transferCall(transferTarget)
      setShowTransfer(false)
      setTransferTarget("")
    }
  }

  return (
    <div className="softphone-call-controls">
      {/* Status Display */}
      <div className="call-status">
        <div className="status-badge" data-state={callState}>
          {callState}
        </div>
        {currentSession?.remoteDisplayName && (
          <div className="remote-party">
            {currentSession.remoteDisplayName}
            <small>{currentSession.remoteIdentity}</small>
          </div>
        )}
        {currentSession?.duration !== undefined && isInCall && (
          <div className="call-duration">
            Duration: {formatDuration(currentSession.duration)}
          </div>
        )}
      </div>

      {/* Main Call Controls */}
      <div className="control-buttons">
        {hasIncomingCall ? (
          <>
            <button className="btn-answer" onClick={answerCall}>
              Answer
            </button>
            <button className="btn-reject" onClick={hangup}>
              Reject
            </button>
          </>
        ) : (
          <>
            <div className="dial-section">
              <input
                type="text"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                placeholder="Enter number"
                disabled={isInCall || hasIncomingCall}
              />
              <button
                className="btn-call"
                onClick={() => makeCall(targetNumber)}
                disabled={!targetNumber || isInCall || hasIncomingCall}
              >
                Call
              </button>
            </div>

            {isInCall && (
              <div className="active-call-controls">
                <button
                  className={`btn-control ${isMuted ? "active" : ""}`}
                  onClick={isMuted ? unmute : mute}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>

                <button
                  className={`btn-control ${isOnHold ? "active" : ""}`}
                  onClick={isOnHold ? unholdCall : holdCall}
                >
                  {isOnHold ? "Resume" : "Hold"}
                </button>

                <button
                  className="btn-control"
                  onClick={() => setShowDialpad(!showDialpad)}
                >
                  Keypad
                </button>

                <button
                  className="btn-control"
                  onClick={() => setShowTransfer(!showTransfer)}
                >
                  Transfer
                </button>

                <button className="btn-hangup" onClick={hangup}>
                  Hang Up
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialpad */}
      {showDialpad && isInCall && (
        <div className="dialpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
            <button
              key={key}
              className="dialpad-key"
              onClick={() => handleDTMF(key.toString())}
            >
              {key}
            </button>
          ))}
        </div>
      )}

      {/* Transfer Dialog */}
      {showTransfer && isInCall && (
        <div className="transfer-dialog">
          <input
            type="text"
            value={transferTarget}
            onChange={(e) => setTransferTarget(e.target.value)}
            placeholder="Enter target number"
          />
          <button onClick={handleTransfer} disabled={!transferTarget}>
            Transfer
          </button>
          <button onClick={() => setShowTransfer(false)}>Cancel</button>
        </div>
      )}

      {/* Logout Button */}
      {callState === CallState.REGISTERED && (
        <button className="btn-logout" onClick={unregister}>
          Logout
        </button>
      )}
    </div>
  )
}
