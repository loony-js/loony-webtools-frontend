import JsSIP from "jssip"
import { RTCSession } from "jssip/lib/RTCSession"

import { v4 as uuidv4 } from "uuid"
import { CallState, CallSession, SoftphoneConfig } from "../types/softphone"

export type SIPServiceEvents = {
  onStateChange: (state: CallState, session?: CallSession) => void
  onError: (error: string) => void
  onIncomingCall: (session: CallSession) => void
  onIncomingAudio: (audio: any) => void
}

export class SIPService {
  private ua: JsSIP.UA | null = null
  private currentSession: RTCSession | null = null
  //   private currentSession: any | null = null
  private callSession: CallSession | null = null
  private eventHandlers: SIPServiceEvents
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(eventHandlers: SIPServiceEvents) {
    this.eventHandlers = eventHandlers
  }

  public async initialize(config: SoftphoneConfig): Promise<void> {
    try {
      // Create WebSocket interface
      const socket = new JsSIP.WebSocketInterface(config.websocketUrl)

      // JsSIP configuration with production settings
      //   const jssipConfig: JsSIP.UAConfiguration = {
      const jssipConfig: any = {
        sockets: [socket],
        uri: config.sipUri,
        password: config.password,
        display_name: config.displayName,
        register: config.autoRegister ?? true,
        register_expires: 300, // 5 minutes
        connection_recovery_min_interval: 2,
        connection_recovery_max_interval: 30,
        // Additional production settings
        session_timers: true,
        session_expires: 120,
        use_preloaded_route: false,
      }

      // Add ICE servers if provided
      if (config.iceServers) {
        jssipConfig.ice_servers = config.iceServers
      }

      this.ua = new JsSIP.UA(jssipConfig)
      this.setupUAEventHandlers()

      this.ua.start()
      this.eventHandlers.onStateChange(CallState.REGISTERING)
    } catch (error: any) {
      this.eventHandlers.onError(`Initialization failed: ${error.message}`)
      this.eventHandlers.onStateChange(CallState.REGISTRATION_FAILED)
    }
  }

  private setupUAEventHandlers(): void {
    if (!this.ua) return

    // Registration events
    this.ua.on("registered", () => {
      this.reconnectAttempts = 0
      this.eventHandlers.onStateChange(CallState.REGISTERED)
    })

    this.ua.on("unregistered", () => {
      this.eventHandlers.onStateChange(CallState.IDLE)
    })

    this.ua.on("registrationFailed", (data: any) => {
      this.eventHandlers.onError(
        `Registration failed: ${data.cause || "Unknown reason"}`,
      )
      this.eventHandlers.onStateChange(CallState.REGISTRATION_FAILED)

      // Implement reconnection logic
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        setTimeout(() => this.ua?.register(), 5000 * this.reconnectAttempts)
      }
    })

    // Incoming call handler
    this.ua.on("newRTCSession", (data: any) => {
      const session = data.session

      if (session.direction === "incoming") {
        this.currentSession = session
        this.setupSessionEventHandlers(session)

        // Create call session object
        this.callSession = {
          id: uuidv4(),
          remoteIdentity: session.remote_identity.uri.toString(),
          remoteDisplayName: session.remote_identity.display_name,
          state: CallState.INCOMING_CALL,
          isMuted: true,
          isOnHold: false,
        }

        this.eventHandlers.onIncomingCall(this.callSession)
        this.eventHandlers.onStateChange(
          CallState.INCOMING_CALL,
          this.callSession,
        )
      }

      session.connection.addEventListener("track", (e: RTCTrackEvent) => {
        this.eventHandlers.onIncomingAudio(e.streams[0])
      })
    })
  }

  private setupSessionEventHandlers(session: RTCSession): void {
    // Call progressing
    session.on("progress", () => {
      this.updateCallSession({ state: CallState.CALL_RINGING })
    })

    // Call established
    session.on("confirmed", () => {
      this.updateCallSession({
        state: CallState.CALL_CONNECTED,
        startTime: new Date(),
      })

      // Start duration timer
      this.startDurationTimer()
    })

    // Call ended
    session.on("ended", (data: any) => {
      this.updateCallSession({ state: CallState.CALL_ENDED })
      this.currentSession = null
      this.stopDurationTimer()
    })

    // Call failed
    session.on("failed", (data: any) => {
      this.eventHandlers.onError(`Call failed: ${data.cause || "Unknown"}`)
      this.updateCallSession({ state: CallState.CALL_FAILED })
      this.currentSession = null
      this.stopDurationTimer()
    })

    // Hold events
    session.on("hold", () => {
      this.updateCallSession({ isOnHold: true, state: CallState.CALL_ON_HOLD })
    })

    session.on("unhold", () => {
      this.updateCallSession({
        isOnHold: false,
        state: CallState.CALL_CONNECTED,
      })
    })

    // DTMF received
    session.on("dtmf", (data: any) => {
      console.log("DTMF received:", data.tone)
      // Handle DTMF tones if needed
    })
  }

  private durationInterval: NodeJS.Timeout | null = null

  private startDurationTimer(): void {
    this.durationInterval = setInterval(() => {
      if (this.callSession?.startTime) {
        const duration = Math.floor(
          (Date.now() - this.callSession.startTime.getTime()) / 1000,
        )
        this.updateCallSession({ duration })
      }
    }, 1000)
  }

  private stopDurationTimer(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval)
      this.durationInterval = null
    }
  }

  private updateCallSession(updates: Partial<CallSession>): void {
    if (this.callSession) {
      this.callSession = { ...this.callSession, ...updates }
      this.eventHandlers.onStateChange(this.callSession.state, this.callSession)
    }
  }

  // Public methods for call control
  public makeCall(target: string): void {
    if (!this.ua) {
      this.eventHandlers.onError("Not connected to SIP server")
      return
    }

    const options = {
      mediaConstraints: { audio: true, video: false },
      rtcOfferConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      },
      sessionTimersExpires: 120,
    }

    try {
      const session = this.ua.call(target, options)
      this.currentSession = session
      this.setupSessionEventHandlers(session)

      this.callSession = {
        id: uuidv4(),
        remoteIdentity: target,
        state: CallState.CALL_INITIATED,
        isMuted: true,
        isOnHold: false,
      }

      this.eventHandlers.onStateChange(
        CallState.CALL_INITIATED,
        this.callSession,
      )
    } catch (error: any) {
      this.eventHandlers.onError(`Failed to initiate call: ${error.message}`)
    }
  }

  public answerCall(): void {
    if (this.currentSession) {
      this.currentSession.answer({
        mediaConstraints: { audio: true, video: false },
      })
    }
  }

  public hangup(): void {
    if (this.currentSession) {
      this.currentSession.terminate()
      this.currentSession = null
    }
  }

  public hold(): void {
    this.currentSession?.hold()
  }

  public unhold(): void {
    this.currentSession?.unhold()
  }

  public mute(): void {
    if (this.currentSession?.connection) {
      const senders = this.currentSession.connection.getSenders()
      senders.forEach((sender) => {
        if (sender.track?.kind === "audio") {
          sender.track.enabled = false
          // sender.replaceTrack(null)
          console.log(sender.track.enabled, "trackenabled")
        }
      })
      this.updateCallSession({ isMuted: true })
    }
  }

  public async unmute() {
    if (this.currentSession?.connection) {
      const senders = this.currentSession.connection.getSenders()
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // const audioTrack = stream.getAudioTracks()[0]

      senders.forEach((sender) => {
        if (sender.track?.kind === "audio") {
          sender.track.enabled = true
          // sender.replaceTrack(audioTrack)
          console.log(sender.track.enabled, "trackenabled")
        }
      })
      this.updateCallSession({ isMuted: false })
    }
  }

  public sendDTMF(tone: string): void {
    this.currentSession?.sendDTMF(tone)
  }

  public transferCall(target: string): void {
    if (this.currentSession) {
      // Implement attended or blind transfer based on your needs
      this.currentSession.refer(target)
    }
  }

  public unregister(): void {
    if (this.ua) {
      this.ua.unregister()
      this.ua.stop()
      this.ua = null
    }
    this.currentSession = null
    this.callSession = null
    this.stopDurationTimer()
  }
}
