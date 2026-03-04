import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react"
import {
  CallState,
  CallSession,
  SoftphoneConfig,
  SoftphoneContextType,
} from "../sip/types/softphone"
import { SIPService } from "../sip/services/SIPService"

// State type for reducer
type SoftphoneState = {
  callState: CallState
  currentSession: CallSession | null
  error: string | null
}

// Action types
type SoftphoneAction =
  | {
      type: "SET_STATE"
      payload: { state: CallState; session?: CallSession | null }
    }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }

// Reducer for state management
const softphoneReducer = (
  state: SoftphoneState,
  action: SoftphoneAction,
): SoftphoneState => {
  switch (action.type) {
    case "SET_STATE":
      return {
        ...state,
        callState: action.payload.state,
        currentSession:
          action.payload.session !== undefined
            ? action.payload.session
            : state.currentSession,
      }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

// Create context
const SoftphoneContext = createContext<SoftphoneContextType | undefined>(
  undefined,
)

// Provider component
export const SoftphoneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(softphoneReducer, {
    callState: CallState.IDLE,
    currentSession: null,
    error: null,
  })

  const sipServiceRef = useRef<SIPService | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize SIP service
  const initialize = useCallback(
    async (config: SoftphoneConfig): Promise<void> => {
      if (audioRef.current) {
        dispatch({ type: "CLEAR_ERROR" })

        const sipService = new SIPService({
          onStateChange: (newState: CallState, session?: CallSession) => {
            console.log(newState, session)
            dispatch({
              type: "SET_STATE",
              payload: { state: newState, session },
            })
          },
          onError: (error: string) => {
            console.log(error)
            dispatch({ type: "SET_ERROR", payload: error })
          },
          onIncomingCall: (session: CallSession) => {
            // Handle incoming call notification
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Incoming Call", {
                body: `Call from: ${session.remoteDisplayName || session.remoteIdentity}`,
                icon: "/phone-icon.png",
              })
            }
          },
          onIncomingAudio: (audio: any) => {
            if (audioRef.current) {
              console.log(audio.getTracks())
              console.log(audio.getAudioTracks())
              console.log(audio, "On incoming audio")
              console.log(audioRef, "audioRef")
              audioRef.current.srcObject = audio
              audioRef.current
                .play()
                .catch((err) => console.log("Autoplay blocked:", err))
            }
          },
        })

        sipServiceRef.current = sipService
        await sipService.initialize(config)
      }
    },
    [audioRef.current],
  )

  // Register
  const register = useCallback(() => {
    // JsSIP auto-registers on start, but we can implement manual registration if needed
  }, [])

  // Unregister
  const unregister = useCallback(() => {
    sipServiceRef.current?.unregister()
  }, [])

  // Make call
  const makeCall = useCallback(async (target: string): Promise<void> => {
    sipServiceRef.current?.makeCall(target)
  }, [])

  // Answer call
  const answerCall = useCallback(() => {
    sipServiceRef.current?.answerCall()
  }, [])

  // Hangup
  const hangup = useCallback(() => {
    sipServiceRef.current?.hangup()
  }, [])

  // Hold
  const holdCall = useCallback(() => {
    sipServiceRef.current?.hold()
  }, [])

  // Unhold
  const unholdCall = useCallback(() => {
    sipServiceRef.current?.unhold()
  }, [])

  // Mute
  const mute = useCallback(() => {
    sipServiceRef.current?.mute()
  }, [])

  // Unmute
  const unmute = useCallback(() => {
    sipServiceRef.current?.unmute()
  }, [])

  // Send DTMF
  const sendDTMF = useCallback((tone: string) => {
    sipServiceRef.current?.sendDTMF(tone)
  }, [])

  // Transfer call
  const transferCall = useCallback((target: string) => {
    sipServiceRef.current?.transferCall(target)
  }, [])

  const value: SoftphoneContextType = {
    ...state,
    initialize,
    register,
    unregister,
    makeCall,
    answerCall,
    hangup,
    holdCall,
    unholdCall,
    mute,
    unmute,
    sendDTMF,
    transferCall,
  }
  return (
    <SoftphoneContext.Provider value={value}>
      <audio ref={audioRef} autoPlay playsInline />
      {children}
    </SoftphoneContext.Provider>
  )
}

// Custom hook for using the context
export const useSoftphone = (): SoftphoneContextType => {
  const context = useContext(SoftphoneContext)
  if (!context) {
    throw new Error("useSoftphone must be used within a SoftphoneProvider")
  }
  return context
}
