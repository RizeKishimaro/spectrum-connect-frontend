"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import * as JsSIP from "jssip"
import type { RTCSession, SessionDirection } from "jssip/lib/RTCSession"
import { useSelector } from "react-redux"
import { ReducersTypes, RootState } from "@/redux/store/store"
import axiosClient from "@/hooks/axiosClient"
import {
  setPhoneState,
  setPhoneNumber,
  setCallStartTime,
  setCallEndReason,
  resetCallData,
} from "@/redux/actions/phoneSlice"
import { useDispatch } from "react-redux"
import { JSSIPSessionFailed } from "@/types/jssip"
import { causes } from "jssip/lib/Constants"

type PhoneState = "disconnected" | "connected" | "ringing" | "oncall" | "onhold" | "calling" | "failed"

interface CallHistoryItem {
  number: string
  type: "outbound" | "inbound" | "missed"
  time: string
  duration: string
}

interface Contact {
  name: string
  number: string
}

interface WebPhoneContextType {
  phoneState: PhoneState
  phoneNumber: string
  setPhoneNumber: (number: string) => void
  isMuted: boolean
  isSpeaker: boolean
  makeCall: () => void
  answerCall: () => void
  hangupCall: () => void
  holdCall: () => void
  transferCall: () => void
  toggleMute: () => void
  toggleSpeaker: () => void
  handleKeypadClick: (digit: string) => void
  dialContact: (number: string) => void
  getStatusColor: () => string
  getStatusText: () => string
  handleSendDTMF: () => void
}

const WebPhoneContext = createContext<WebPhoneContextType | undefined>(undefined)
export function WebPhoneProvider({ children }: { children: React.ReactNode }) {
  const ringtone = new Audio("/sounds/ringtone.mp3")
  ringtone.loop = true
  ringtone.volume = 1.0 // or adjust to taste 🍬
  //
  const agent = useSelector((state: ReducersTypes) => state.user.user.user)
  const { phoneState, phoneNumber, callStartTime } = useSelector(
    (state: RootState) => state.phone
  )
  const dispatch = useDispatch()
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)

  const callStartTimeRef = useRef<number | null>(null)
  const phoneNumberRef = useRef(phoneNumber)

  const uaRef = useRef<JsSIP.UA | null>(null)
  const sessionRef = useRef<RTCSession | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)


  const saveCallLog = async (
    type: "outgoing" | "incoming" | "missed",
    number: string,
    start: number,
    end: number,
    result: causes
  ) => {
    const durationSeconds = Math.floor((end - start) / 1000);
    const time = new Date(start).toISOString();

    const body = {
      callerId: type === "outgoing" ? agent.sipUname : number, // mapping based on direction~
      calleeId: type === "outgoing" ? number : agent.sipUname,
      direction: type === "outgoing" ? "outbound".toUpperCase() : "inbound".toUpperCase(),
      status: result.toUpperCase(),
      agentId: agent.id,
      systemId: agent.systemCompanyId,
      hungUpBy: type === "outgoing" ? "Agent" : "User",
      duration: durationSeconds,
    };

    try {
      await axiosClient.post("/call-logs", body);
      console.log("Call log saved~! 💾💕");
    } catch (err) {
      console.error("Failed to save call log~! 😭", err);
    }
  };

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio()
      audio.autoplay = true
      audioRef.current = audio
      document.body.appendChild(audio)
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current && document.body.removeChild(audioRef.current)
      }
    }
  }, [])
  useEffect(() => {
    phoneNumberRef.current = phoneNumber
    console.log(phoneNumberRef.current)
  }, [phoneNumber])

  // Initialize JsSIP
  useEffect(() => {
    const socket = new JsSIP.WebSocketInterface(`${import.meta.env.VITE_APP_WEBSOCKET_PROTOCOL}://${import.meta.env.VITE_APP_WEBSOCKET_HOST}:${import.meta.env.VITE_APP_WEBSOCKET_PORT}${import.meta.env.VITE_APP_WEBSOCKET_PATH}`)
    const configuration = {
      sockets: [socket],
      uri: `sip:${agent.sipUname}@${import.meta.env.VITE_APP_WEBSOCKET_HOST}:${import.meta.env.VITE_APP_WEBSOCKET_PORT}`,
      password: agent.sipPassword,
    }

    try {
      const ua = new JsSIP.UA(configuration)

      ua.on("registered", () => {
        dispatch(setPhoneState("connected"))
      })

      ua.on("unregistered", () => {
        dispatch(setPhoneState("disconnected"))
      })

      ua.on("registrationFailed", () => {
        dispatch(setPhoneState("disconnected"))
      })

      ua.on("newRTCSession", (data) => {
        callStartTimeRef.current = Date.now()
        const session: RTCSession = data.session
        sessionRef.current = session

        if (session.direction === "incoming") {
          const number = session.remote_identity.uri.user
          console.log("Incoming call from:", number)

          dispatch(setPhoneNumber(number))
          dispatch(setPhoneState("ringing"))

          // 🐱 Play ringtone~
          ringtone.play().catch((err) => {
            console.warn("Autoplay failed~ 💔", err)
          })

          // 💔 Stop ringtone when answered or ended
          const stopRingtone = () => {
            ringtone.pause()
            ringtone.currentTime = 0
          }

          session.on("accepted", stopRingtone)
          session.on("ended", stopRingtone)
          session.on("failed", stopRingtone)
        }


        // Set up audio handling for the session
        session.on("peerconnection", (e) => {
          const peerconnection = e.peerconnection

          // When remote stream is added, connect it to the audio element
          peerconnection.addEventListener("track", (event) => {
            if (event.track.kind === "audio" && audioRef.current) {
              const remoteStream = new MediaStream()
              remoteStream.addTrack(event.track)
              audioRef.current.srcObject = remoteStream
              audioRef.current.play().catch((error) => {
                console.error("Error playing audio:", error)
              })
            }
          })
        })

        session.on("accepted", () => {
          dispatch(setPhoneState("oncall"))
          callStartTimeRef.current = Date.now()
        })


        session.on("ended", (e) => {
          dispatch(setPhoneState("connected"))
          sessionRef.current = null
          dispatch(setCallEndReason("completed"))

          if (audioRef.current) audioRef.current.srcObject = null

          // Save call log only for completed ones
          if (callStartTimeRef.current) {
            const direction: SessionDirection = session.direction
            saveCallLog(session.direction, phoneNumberRef.current, callStartTimeRef.current, Date.now(), "connected")
          } else {
            console.log("not saving")
          }
        })

        session.on("failed", (error: JSSIPSessionFailed) => {
          console.log("Call failed:", error)
          dispatch(setPhoneState("connected"))
          sessionRef.current = null
          setCallEndReason("failed")

          if (audioRef.current) audioRef.current.srcObject = null

          // Save failed call log
          if (callStartTimeRef.current) saveCallLog(session.direction, phoneNumberRef.current, callStartTimeRef.current, Date.now(), error.cause)
        })


        session.on("failed", () => {
          dispatch(setPhoneState("connected"))
          sessionRef.current = null

          // Clear the audio stream when call fails
          if (audioRef.current) {
            audioRef.current.srcObject = null
          }
        })
      })

      uaRef.current = ua
      ua.start()

      return () => {
        if (ua) {
          ua.stop()
        }
      }
    } catch (error) {
      console.error("JsSIP initialization error:", error)
    }
  }, [])



  const makeCall = () => {
    if (!phoneNumber || !uaRef.current) return

    const options = {
      mediaConstraints: { audio: true, video: false },
    }

    try {
      uaRef.current.call(phoneNumber, options)
      dispatch(setPhoneState("calling"))
      // Add to call history
    } catch (error) {
      console.error("Call error:", error)
    }
  }

  const answerCall = () => {
    if (sessionRef.current) {
      const options = {
        mediaConstraints: { audio: true, video: false },
      }
      sessionRef.current.answer(options)
      callStartTimeRef.current = Date.now()
    }
  }

  const hangupCall = () => {
    if (sessionRef.current) {
      sessionRef.current.terminate()
    }
  }

  const holdCall = () => {
    if (sessionRef.current) {
      if (phoneState === "oncall") {
        sessionRef.current.hold()
        dispatch(setPhoneState("onhold"))
      } else if (phoneState === "onhold") {
        sessionRef.current.unhold()
        dispatch(setPhoneState("oncall"))
      }
    }
  }

  const transferCall = () => {
    if (sessionRef.current && phoneNumber) {

      dispatch(setCallEndReason("transferred"))
      sessionRef.current.refer(phoneNumber)
    }
  }
  const handleSendDTMF = () => {
    if (sessionRef.current && phoneNumber) {
      sessionRef.current.sendDTMF(phoneNumber)
    }
  }

  const toggleMute = () => {
    if (sessionRef.current) {
      if (isMuted) {
        sessionRef.current.unmute()
      } else {
        sessionRef.current.mute()
      }
      setIsMuted(!isMuted)
    }
  }

  const toggleSpeaker = () => {
    setIsSpeaker(!isSpeaker)

    // Control the audio output device if supported by the browser
    if (audioRef.current && "setSinkId" in HTMLMediaElement.prototype) {
      try {
        // TypeScript doesn't recognize setSinkId by default, so we need to cast
        ; (audioRef.current as any).setSinkId(isSpeaker ? "default" : "speaker").catch((error: any) => {
          console.error("Error switching audio output:", error)
        })
      } catch (error) {
        console.error("Error switching audio output:", error)
      }
    }
  }

  const handleKeypadClick = (digit: string) => {
    dispatch(setPhoneNumber(phoneNumber + digit))
  }

  const dialContact = (number: string) => {
    setPhoneNumber(number)
    makeCall()
  }

  // Status indicator color
  const getStatusColor = () => {
    switch (phoneState) {
      case "connected":
        return "bg-green-500"
      case "disconnected":
        return "bg-red-500"
      case "ringing":
        return "bg-yellow-500"
      case "oncall":
        return "bg-blue-500"
      case "onhold":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (phoneState) {
      case "connected":
        return "Ready"
      case "disconnected":
        return "Offline"
      case "ringing":
        return "Ringing"
      case "oncall":
        return "On Call"
      case "onhold":
        return "On Hold"
      case "calling":
        return "Calling"
      case "failed":
        return "Call Failed"
      default:
        return "Unknown"
    }
  }
  const value = {
    phoneState,
    phoneNumber,
    setPhoneNumber,
    isMuted,
    isSpeaker,
    makeCall,
    answerCall,
    hangupCall,
    holdCall,
    transferCall,
    toggleMute,
    toggleSpeaker,
    handleKeypadClick,
    dialContact,
    getStatusColor,
    getStatusText,
    handleSendDTMF
  }

  return <WebPhoneContext.Provider value={value}>{children}</WebPhoneContext.Provider>
}

export function useWebPhone() {
  const context = useContext(WebPhoneContext)
  if (context === undefined) {
    throw new Error("useWebPhone must be used within a WebPhoneProvider")
  }
  return context
}

