import React, { useEffect } from "react"
import { useSoftphone } from "../context/SoftPhoneContext"
import { LoginForm } from "./components/Login"
import { CallControls } from "./components/CallControls"
import { CallState } from "./types/softphone"
import { SoftphoneProvider } from "../context/SoftPhoneContext"
import "./sip.css"

function Softphone() {
  const { callState, error } = useSoftphone()

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Handle browser tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (callState === CallState.CALL_CONNECTED) {
        e.preventDefault()
        e.returnValue =
          "You have an active call. Are you sure you want to leave?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [callState])

  const isLoggedIn = [
    CallState.REGISTERED,
    CallState.CALL_INITIATED,
    CallState.CALL_RINGING,
    CallState.CALL_CONNECTED,
    CallState.CALL_ON_HOLD,
    CallState.INCOMING_CALL,
  ].includes(callState)

  return (
    <main className="flex-1 min-h-screen ml-64 bg-stone-50 dark:bg-[#212121] text-white pt-16">
      <div className="w-[60%] mx-auto p-4 space-y-6">
        <div className="softphone-container">
          {error && <div className="error-message">Error: {error}</div>}

          {!isLoggedIn ? <LoginForm /> : <CallControls />}
        </div>
      </div>
    </main>
  )
}
export default function SipClient() {
  return (
    <>
      <SoftphoneProvider>
        <Softphone />
      </SoftphoneProvider>
    </>
  )
}
