import { useState, useEffect, useRef } from "react"
import * as JsSIP from "jssip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Phone,
  PhoneOff,
  Pause,
  ArrowRightLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  UserPlus,
  Clock,
  Users,
  KeyboardIcon as Keypad,
} from "lucide-react"

export default function WebPhone() {
  // State for the phone
  const [phoneState, setPhoneState] = useState("disconnected") // disconnected, connected, ringing, oncall, onhold
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)
  const [callHistory, setCallHistory] = useState([
    { number: "555-123-4567", type: "outgoing", time: "10:30 AM", duration: "2:45" },
    { number: "555-987-6543", type: "incoming", time: "9:15 AM", duration: "1:20" },
    { number: "555-456-7890", type: "missed", time: "Yesterday", duration: "" },
  ])
  const [contacts, setContacts] = useState([
    { name: "John Smith", number: "555-123-4567" },
    { name: "Jane Doe", number: "555-987-6543" },
    { name: "Alice Johnson", number: "555-456-7890" },
  ])

  // References for JsSIP
  const uaRef = useRef(null)
  const sessionRef = useRef(null)

  // Initialize JsSIP (in a real app, these would come from environment variables)
  useEffect(() => {
    // This is just for demonstration - in a real app you would use actual credentials
    const socket = new JsSIP.WebSocketInterface("wss://sip.example.com")
    const configuration = {
      sockets: [socket],
      uri: "sip:user@example.com",
      password: "password",
    }

    try {
      const ua = new JsSIP.UA(configuration)

      ua.on("registered", () => {
        setPhoneState("connected")
      })

      ua.on("unregistered", () => {
        setPhoneState("disconnected")
      })

      ua.on("registrationFailed", () => {
        setPhoneState("disconnected")
      })

      ua.on("newRTCSession", (data) => {
        const session = data.session
        sessionRef.current = session

        if (session.direction === "incoming") {
          setPhoneState("ringing")
        }

        session.on("accepted", () => {
          setPhoneState("oncall")
        })

        session.on("ended", () => {
          setPhoneState("connected")
          sessionRef.current = null
        })

        session.on("failed", () => {
          setPhoneState("connected")
          sessionRef.current = null
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

  // Phone functions
  const makeCall = () => {
    if (!phoneNumber || !uaRef.current) return

    const options = {
      mediaConstraints: { audio: true, video: false },
    }

    try {
      uaRef.current.call(phoneNumber, options)
      // Add to call history
      const newCall = {
        number: phoneNumber,
        type: "outgoing",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        duration: "--:--",
      }
      setCallHistory([newCall, ...callHistory])
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
        setPhoneState("onhold")
      } else if (phoneState === "onhold") {
        sessionRef.current.unhold()
        setPhoneState("oncall")
      }
    }
  }

  const transferCall = () => {
    if (sessionRef.current && phoneNumber) {
      sessionRef.current.refer(phoneNumber)
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
    // In a real implementation, you would switch audio output here
  }

  const handleKeypadClick = (digit) => {
    setPhoneNumber(phoneNumber + digit)

    // If in a call, send DTMF
    if (sessionRef.current && (phoneState === "oncall" || phoneState === "onhold")) {
      sessionRef.current.sendDTMF(digit)
    }
  }

  const dialContact = (number) => {
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

  // Status text
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
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Web Phone</CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="mb-4">
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="text-lg text-center"
            />
          </div>

          {phoneState === "ringing" && (
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 animate-pulse">
                Incoming Call...
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((digit) => (
              <Button key={digit} variant="outline" className="h-12 text-lg" onClick={() => handleKeypadClick(digit)}>
                {digit}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={phoneState === "oncall" || phoneState === "onhold" ? "destructive" : "default"}
              className="flex flex-col items-center py-2"
              onClick={phoneState === "oncall" || phoneState === "onhold" ? hangupCall : makeCall}
              disabled={phoneState === "disconnected" || (phoneState === "connected" && !phoneNumber)}
            >
              {phoneState === "oncall" || phoneState === "onhold" ? (
                <PhoneOff className="h-5 w-5 mb-1" />
              ) : (
                <Phone className="h-5 w-5 mb-1" />
              )}
              {phoneState === "oncall" || phoneState === "onhold" ? "End" : "Call"}
            </Button>

            <Button
              variant={phoneState === "onhold" ? "secondary" : "outline"}
              className="flex flex-col items-center py-2"
              onClick={holdCall}
              disabled={phoneState !== "oncall" && phoneState !== "onhold"}
            >
              <Pause className="h-5 w-5 mb-1" />
              Hold
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center py-2"
              onClick={transferCall}
              disabled={phoneState !== "oncall" && phoneState !== "onhold"}
            >
              <ArrowRightLeft className="h-5 w-5 mb-1" />
              Transfer
            </Button>

            {phoneState === "ringing" ? (
              <Button
                variant="default"
                className="flex flex-col items-center py-2 bg-green-600 hover:bg-green-700"
                onClick={answerCall}
              >
                <Phone className="h-5 w-5 mb-1" />
                Answer
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex flex-col items-center py-2"
                onClick={toggleMute}
                disabled={phoneState !== "oncall" && phoneState !== "onhold"}
              >
                {isMuted ? <MicOff className="h-5 w-5 mb-1" /> : <Mic className="h-5 w-5 mb-1" />}
                Mute
              </Button>
            )}
          </div>

          <div className="flex justify-center mt-2">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${isSpeaker ? "bg-blue-100" : ""}`}
              onClick={toggleSpeaker}
              disabled={phoneState !== "oncall" && phoneState !== "onhold"}
            >
              {isSpeaker ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Speaker
            </Button>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Tabs defaultValue="keypad" className="w-full">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="keypad" className="flex items-center gap-1">
                <Keypad className="h-4 w-4" />
                Keypad
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="keypad">{/* Keypad is already shown above */}</TabsContent>

            <TabsContent value="contacts">
              <div className="max-h-40 overflow-y-auto">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => dialContact(contact.number)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.number}</div>
                      </div>
                    </div>
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="max-h-40 overflow-y-auto">
                {callHistory.map((call, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => setPhoneNumber(call.number)}
                  >
                    <div>
                      <div className="font-medium">{call.number}</div>
                      <div className="text-sm text-gray-500">
                        {call.time} {call.duration && `• ${call.duration}`}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        call.type === "outgoing"
                          ? "bg-blue-100 text-blue-800"
                          : call.type === "incoming"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {call.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardFooter>
      </Card>
    </div>
  )
}

