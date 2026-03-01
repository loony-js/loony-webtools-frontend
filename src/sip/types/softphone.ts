// Call states for proper state management
export enum CallState {
  IDLE = "IDLE",
  REGISTERING = "REGISTERING",
  REGISTERED = "REGISTERED",
  REGISTRATION_FAILED = "REGISTRATION_FAILED",
  CALL_INITIATED = "CALL_INITIATED",
  CALL_RINGING = "CALL_RINGING",
  CALL_CONNECTED = "CALL_CONNECTED",
  CALL_ON_HOLD = "CALL_ON_HOLD",
  CALL_ENDED = "CALL_ENDED",
  CALL_FAILED = "CALL_FAILED",
  INCOMING_CALL = "INCOMING_CALL",
}

export interface SoftphoneConfig {
  websocketUrl: string
  sipUri: string
  password: string
  displayName?: string
  autoRegister?: boolean
  iceServers?: RTCIceServer[]
}

export interface CallSession {
  id: string
  remoteIdentity: string
  remoteDisplayName?: string
  state: CallState
  startTime?: Date
  duration?: number
  isMuted: boolean
  isOnHold: boolean
}

export interface SoftphoneContextType {
  // State
  callState: CallState
  currentSession: CallSession | null
  error: string | null

  // Actions
  initialize: (config: SoftphoneConfig) => Promise<void>
  register: () => void
  unregister: () => void
  makeCall: (target: string) => Promise<void>
  answerCall: () => void
  hangup: () => void
  holdCall: () => void
  unholdCall: () => void
  mute: () => void
  unmute: () => void
  sendDTMF: (tone: string) => void
  transferCall: (target: string) => void
}
