
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const sounds: Record<string, HTMLAudioElement> = {
  chime: new Audio("/sounds/chime.mp3"),
  bell: new Audio("/sounds/bell.mp3"),
  ping: new Audio("/sounds/ping.mp3"),
}

// Request notification permission on component mount
const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.error("Browser does not support notifications.")
    return
  }

  if (Notification.permission !== "granted") {
    try {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        console.log("Notification permission granted!")
      } else {
        console.log("Notification permission denied.")
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
    }
  }
}

export function NotificationSettings() {
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const [settings, setSettings] = useState({
    callAlerts: true,
    missedCalls: true,
    teamMessages: true,
    announcements: true,
    sound: "chime",
  })

  const handleToggle = (key: keyof typeof settings) => (value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))

    // Example notification trigger
    if (key === "callAlerts" && value) {
      showNotification("Incoming Call", "You have an incoming call!")
    }
    if (key === "missedCalls" && value) {
      showNotification("Missed Call", "You missed a call!")
    }
  }

  const handleSoundChange = (value: string) => {
    setSettings((prev) => ({ ...prev, sound: value }))
  }

  const handleTestSound = () => {
    const sound = settings.sound
    if (sound !== "none" && sounds[sound]) {
      sounds[sound].currentTime = 0
      sounds[sound].play()
    }
  }

  const handleTestNotification = () => {
    showNotification("Test Notification", "This is a test notification!")
  }

  const showNotification = (title: string, message: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/path/to/notification-icon.png", // Optional icon
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings Switches */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Incoming call alerts</p>
            <p className="text-sm text-muted-foreground">Show notification for incoming calls</p>
          </div>
          <Switch checked={settings.callAlerts} onCheckedChange={handleToggle("callAlerts")} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Missed call notifications</p>
            <p className="text-sm text-muted-foreground">Alert when you miss a call</p>
          </div>
          <Switch checked={settings.missedCalls} onCheckedChange={handleToggle("missedCalls")} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Team messages</p>
            <p className="text-sm text-muted-foreground">Notify for new team messages</p>
          </div>
          <Switch checked={settings.teamMessages} onCheckedChange={handleToggle("teamMessages")} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">System announcements</p>
            <p className="text-sm text-muted-foreground">Important updates and announcements</p>
          </div>
          <Switch checked={settings.announcements} onCheckedChange={handleToggle("announcements")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notificationSound">Notification Sound</Label>
          <Select value={settings.sound} onValueChange={handleSoundChange}>
            <SelectTrigger id="notificationSound">
              <SelectValue placeholder="Select sound" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chime">Chime</SelectItem>
              <SelectItem value="bell">Bell</SelectItem>
              <SelectItem value="ping">Ping</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleTestSound}>
            Test Sound 🎧
          </Button>
          <Button variant="secondary" onClick={handleTestNotification}>
            Test Notification 🔔
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

