"use client"

import { useWebPhone } from "@/contexts/web-phone-context"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneOff } from "lucide-react"

export function CallStatusIndicator() {
  const { phoneState, hangupCall, answerCall } = useWebPhone()

  if (phoneState !== "oncall" && phoneState !== "onhold" && phoneState !== "ringing") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge
        variant="outline"
        className={`
          flex items-center gap-2 px-3 py-2 text-sm font-medium shadow-lg
          ${phoneState === "oncall"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            : phoneState === "onhold"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 animate-pulse"
          }
        `}
      >
        {phoneState === "ringing" ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                answerCall()
              }}
              className="ml-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <Phone className="h-4 w-4" />
            </button>
            <span>Incoming Call</span>
          </>
        ) : (
          <>
            {phoneState === "oncall" ? <Phone className="h-4 w-4" /> : <Phone className="h-4 w-4 animate-pulse" />}
            <span>{phoneState === "oncall" ? "On Call" : "On Hold"}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                hangupCall()
              }}
              className="ml-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <PhoneOff className="h-3 w-3" />
            </button>
          </>
        )}
      </Badge>
    </div>
  )
}

