import React, { useState } from "react"
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
  const hasIncomingCall = callState === CallState.INCOMING_CALL
  const isOnHold = callState === CallState.CALL_ON_HOLD
  const isMuted = currentSession?.isMuted || false

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-md mx-auto border border-[#30363d] rounded-xl p-5 space-y-5">
      {/* Status */}
      <div className="space-y-2 text-center">
        <div className="text-sm text-gray-400">Status</div>

        <div
          className={`inline-block px-3 py-1 rounded-md text-sm font-medium
          ${
            callState === CallState.CALL_CONNECTED
              ? "bg-green-500/10 text-green-400"
              : callState === CallState.INCOMING_CALL
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-gray-500/10 text-gray-400"
          }`}
        >
          {callState}
        </div>

        {currentSession?.remoteDisplayName && (
          <div className="text-gray-200 text-sm">
            {currentSession.remoteDisplayName}
            <div className="text-xs text-gray-500">
              {currentSession.remoteIdentity}
            </div>
          </div>
        )}

        {isInCall && (
          <div className="text-xs text-gray-400">
            {formatDuration(currentSession?.duration)}
          </div>
        )}
      </div>

      {/* Incoming Call */}
      {hasIncomingCall && (
        <div className="flex gap-3">
          <button
            onClick={answerCall}
            className="flex-1 py-2 rounded-md bg-[var(--color-loony-primary)] hover:bg-[var(--color-loony-primaryHover)] text-white"
          >
            Answer
          </button>
          <button
            onClick={hangup}
            className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Reject
          </button>
        </div>
      )}

      {/* Dial */}
      {!hasIncomingCall && (
        <div className="flex gap-2">
          <input
            value={targetNumber}
            onChange={(e) => setTargetNumber(e.target.value)}
            placeholder="Enter number"
            disabled={isInCall}
            className="flex-1 px-3 py-2 rounded-md bg-[var(--color-loony-darker)] border border-[#30363d] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-loony-primary)]"
          />
          <button
            onClick={() => makeCall(targetNumber)}
            disabled={!targetNumber || isInCall}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-900"
          >
            Call
          </button>
        </div>
      )}

      {/* Active Call Controls */}
      {isInCall && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={isMuted ? unmute : mute}
            className={`py-2 rounded-md border border-[#30363d] ${
              isMuted ? "bg-yellow-500/10 text-yellow-400" : "text-gray-300"
            }`}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <button
            onClick={isOnHold ? unholdCall : holdCall}
            className={`py-2 rounded-md border border-[#30363d] ${
              isOnHold ? "bg-yellow-500/10 text-yellow-400" : "text-gray-300"
            }`}
          >
            {isOnHold ? "Resume" : "Hold"}
          </button>

          <button
            onClick={() => setShowDialpad(!showDialpad)}
            className="py-2 rounded-md border border-[#30363d] text-gray-300"
          >
            Keypad
          </button>

          <button
            onClick={() => setShowTransfer(!showTransfer)}
            className="py-2 rounded-md border border-[#30363d] text-gray-300 col-span-2"
          >
            Transfer
          </button>

          <button
            onClick={hangup}
            className="py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Hang Up
          </button>
        </div>
      )}

      {/* Dialpad */}
      {showDialpad && isInCall && (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((k) => (
            <button
              key={k}
              onClick={() => sendDTMF(k.toString())}
              className="py-3 rounded-md bg-[var(--color-loony-darker)] border border-[#30363d] text-gray-200 hover:bg-gray-800"
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {/* Transfer */}
      {showTransfer && isInCall && (
        <div className="space-y-2">
          <input
            value={transferTarget}
            onChange={(e) => setTransferTarget(e.target.value)}
            placeholder="Transfer target"
            className="w-full px-3 py-2 rounded-md bg-[var(--color-loony-darker)] border border-[#30363d] text-gray-200"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                transferCall(transferTarget)
                setShowTransfer(false)
                setTransferTarget("")
              }}
              disabled={!transferTarget}
              className="flex-1 py-2 bg-[var(--color-loony-primary)] text-white rounded-md disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowTransfer(false)}
              className="flex-1 py-2 border border-[#30363d] text-gray-300 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      {callState === CallState.REGISTERED && (
        <button
          onClick={unregister}
          className="w-full py-2 text-sm text-gray-400 hover:text-white dark:bg-button-green-DEFAULT hover:bg-button-green-hover rounded text-white"
        >
          Logout
        </button>
      )}
    </div>
  )
}
