import React, { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function AudioSettings() {
  const [devices, setDevices] = useState<{ input: MediaDeviceInfo[]; output: MediaDeviceInfo[] }>({ input: [], output: [] })
  const [inputDeviceId, setInputDeviceId] = useState("")
  const [outputDeviceId, setOutputDeviceId] = useState("")
  const [micVolume, setMicVolume] = useState(80)
  const [speakerVolume, setSpeakerVolume] = useState(70)
  const [noiseSuppression, setNoiseSuppression] = useState(true)
  const [autoGainControl, setAutoGainControl] = useState(true)

  const mediaStreamRef = useRef<MediaStream | null>(null)
  // Default values for resetting
  const defaultSettings = {
    micVolume: 80,
    speakerVolume: 70,
    noiseSuppression: true,
    autoGainControl: true,
  }


  const handleSaveSettings = async () => {
    console.log("Saving and applying settings nya~ 💾✨", {
      inputDeviceId,
      outputDeviceId,
      micVolume,
      speakerVolume,
      noiseSuppression,
      autoGainControl,
    });

    // Stop old stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      // Apply new mic stream with constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: inputDeviceId ? { exact: inputDeviceId } : undefined,
          noiseSuppression,
          autoGainControl,
        },
        video: false,
      });

      // Apply mic volume via gain node
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = micVolume / 100;

      source.connect(gainNode).connect(audioContext.destination);

      mediaStreamRef.current = stream;

      // Apply speaker output
      const audio = new Audio();
      if ("setSinkId" in audio) {
        try {
          await audio.setSinkId(outputDeviceId);
          console.log("Speaker device applied nya~ 🔊");
        } catch (err) {
          console.warn("setSinkId failed:", err);
        }
      } else {
        console.warn("setSinkId is not supported in this browser nya 😿");
      }

      // Optional: You can also play a sound to test output volume
      // audio.src = 'test-sound.mp3';
      // audio.volume = speakerVolume / 100;
      // audio.play();

    } catch (err) {
      console.error("Error applying audio settings nya~ ❌", err);
    }
  };

  const handleResetSettings = () => {
    setMicVolume(defaultSettings.micVolume);
    setSpeakerVolume(defaultSettings.speakerVolume);
    setNoiseSuppression(defaultSettings.noiseSuppression);
    setAutoGainControl(defaultSettings.autoGainControl);

    if (devices.input.length > 0) {
      setInputDeviceId(devices.input[0].deviceId);
    }
    if (devices.output.length > 0) {
      setOutputDeviceId(devices.output[0].deviceId);
    }

    console.log("Settings reset to defaults, nya~ 🔄");
  }


  useEffect(() => {
    const loadDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const initDevices = async () => {
        try {
          // ✨ Ask for mic access first!
          await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

          const allDevices = await navigator.mediaDevices.enumerateDevices();

          const input = allDevices.filter((d) => d.kind === "audioinput");
          const output = allDevices.filter((d) => d.kind === "audiooutput");

          setDevices({ input, output });

          if (input.length > 0 && input[0].deviceId) {
            setInputDeviceId(input[0].deviceId);
          }
          if (output.length > 0 && output[0].deviceId) {
            setOutputDeviceId(output[0].deviceId);
          }
        } catch (err) {
          console.error("Permission error nya~ 😿", err);
        }
      };

      initDevices(); const input = devices.filter((d) => d.kind === "audioinput")
      const output = devices.filter((d) => d.kind === "audiooutput")
      setDevices({ input, output })

      if (input.length > 0) setInputDeviceId(input[0].deviceId)
      if (output.length > 0) setOutputDeviceId(output[0].deviceId)
    }

    loadDevices()
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
      // /* audioContextRef */.current?.close()
    }

  }, [])

  // Handle mic stream and adjustments
  useEffect(() => {
    const setupMic = async () => {
      if (!inputDeviceId) return

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }


      // const audioContext = new AudioContext()
      // const source = audioContext.createMediaStreamSource(stream)
      // const gainNode = audioContext.createGain()
      // gainNode.gain.value = micVolume / 100

      // source.connect(gainNode).connect(audioContext.destination)

      // mediaStreamRef.current = stream
      // audioContextRef.current = audioContext
      // gainNodeRef.current = gainNode
    }

    setupMic()

    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
      // /* audioContextRef */.current?.close()
    }
  }, [inputDeviceId, micVolume, noiseSuppression, autoGainControl])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Settings</CardTitle>
        <CardDescription>Adjust your microphone and speaker preferences~!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Device */}
        <div className="space-y-2">
          <Label>Microphone</Label>
          <Select value={inputDeviceId} onValueChange={setInputDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose microphone" />
            </SelectTrigger>
            <SelectContent>
              {devices.output
                .filter((device) => device.deviceId && device.deviceId !== "")
                .map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || "🔈 Unknown Speaker"}
                  </SelectItem>
                ))}            </SelectContent>
          </Select>
        </div>

        {/* Mic Volume */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Microphone Volume</Label>
            <span className="text-sm">{micVolume}%</span>
          </div>
          <Slider value={[micVolume]} onValueChange={(v) => setMicVolume(v[0])} max={100} step={1} />
        </div>

        {/* Noise Suppression Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Noise Suppression</p>
            <p className="text-sm text-muted-foreground">Remove background noise</p>
          </div>
          <Switch checked={noiseSuppression} onCheckedChange={setNoiseSuppression} />
        </div>

        {/* Auto Gain Control Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Auto Gain Control</p>
            <p className="text-sm text-muted-foreground">Adjust mic volume automatically</p>
          </div>
          <Switch checked={autoGainControl} onCheckedChange={setAutoGainControl} />
        </div>

        {/* Optional: Speaker output (not widely supported by browsers!) */}
        <div className="space-y-2">
          <Label>Speaker</Label>
          <Select value={outputDeviceId} onValueChange={setOutputDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose speaker" />
            </SelectTrigger>
            <SelectContent>
              {devices.output.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || "Unknown Output"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speaker Volume (stub – browser doesn’t give control easily!) */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Speaker Volume</Label>
            <span className="text-sm">{speakerVolume}%</span>
          </div>
          <Slider value={[speakerVolume]} onValueChange={(v) => setSpeakerVolume(v[0])} max={100} step={1} />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleResetSettings}>Reset to Defaults</Button>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>

      </CardContent>
    </Card>
  )
}

