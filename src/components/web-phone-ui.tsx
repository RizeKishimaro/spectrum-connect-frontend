"use client"

import { useWebPhone } from "@/contexts/web-phone-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  PhoneOff,
  Pause,
  ArrowRightLeft,
  Mic,
  MicOff,
} from "lucide-react"
import { useDispatch } from "react-redux"

export function WebPhoneUI() {
  const {
    phoneState,
    phoneNumber,
    setPhoneNumber,
    isMuted,
    makeCall,
    answerCall,
    hangupCall,
    holdCall,
    transferCall,
    toggleMute,
    handleKeypadClick,
    getStatusColor,
    getStatusText,
  } = useWebPhone()
  const dispatch = useDispatch()

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent p-4">
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
              onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
              placeholder="Enter phone number"
              className="text-lg text-center"
            />
          </div>

          {phoneState === "ringing" && (
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 animate-pulse">
                Incoming Call from {phoneNumber}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((digit) => (
              <Button
                key={digit}
                variant="outline"
                className="h-12 text-lg"
                onClick={() => handleKeypadClick(digit.toString())}
              >
                {digit}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={phoneState === "oncall" || phoneState === "onhold" || phoneState === "calling" || phoneState === "ringing" ? "destructive" : "default"}
              className="flex flex-col items-center py-2"
              onClick={phoneState === "oncall" || phoneState === "onhold" || phoneState === "calling" || phoneState === "ringing" ? hangupCall : makeCall}
              disabled={phoneState === "disconnected" || (phoneState === "connected" && !phoneNumber)}
            >
              {phoneState === "oncall" || phoneState === "onhold" || phoneState === "calling" || phoneState === "ringing" ? (
                <PhoneOff className="h-5 w-5 mb-1" />
              ) : (
                <Phone className="h-5 w-5 mb-1" />
              )}
              {phoneState === "oncall" || phoneState === "onhold" || phoneState === "calling" || phoneState === "ringing" ? "End" : "Call"}
            </Button>
            <Button
              variant={phoneState === "onhold" ? "secondary" : "outline"}
              className="flex flex-row items-center py-2"
              onClick={holdCall}
              disabled={phoneState !== "oncall" && phoneState !== "onhold"}
            >
              <Pause className="h-5 w-5 mb-1" />
              Hold
            </Button>

            <Button
              variant="outline"
              className="flex flex-row items-center py-2"
              onClick={transferCall}
              disabled={phoneState !== "oncall" && phoneState !== "onhold"}
            >
              <ArrowRightLeft className="h-5 w-5 mb-1" />
              Transfer
            </Button>

            {phoneState === "ringing" ? (
              <Button
                variant="default"
                className="flex flex-row items-center py-2 bg-green-600 hover:bg-green-700"
                onClick={answerCall}
              >
                <Phone className="h-5 w-5 mb-1" />
                Answer
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex flex-row items-center py-2"
                onClick={toggleMute}
                disabled={phoneState !== "oncall" && phoneState !== "onhold"}
              >
                {isMuted ? <MicOff className="h-5 w-5 mb-1" /> : <Mic className="h-5 w-5 mb-1" />}
                Mute
              </Button>
            )}
          </div>

        </CardContent>

      </Card>
    </div>
  )
}

