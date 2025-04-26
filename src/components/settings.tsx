import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AudioSettings } from "./audio-settings"
import { NotificationSettings } from "./notification-settings"

export function Settings() {

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight ms-4">Settings</h2>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <RadioGroup defaultValue="system" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {["default", "red", "green", "blue", "purple"].map((color) => (
                    <div
                      key={color}
                      className={`h-8 w-full rounded-md cursor-pointer border-2 ${color === "default"
                        ? "bg-primary border-primary"
                        : `bg-${color}-500 border-transparent hover:border-${color}-600`
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontScale">Font Size</Label>
                  <span className="text-sm">100%</span>
                </div>
                <Slider id="fontScale" defaultValue={[100]} max={150} min={75} step={5} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reduce animations</p>
                  <p className="text-sm text-muted-foreground">Minimize motion effects</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout</CardTitle>
              <CardDescription>Customize the layout of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="density">Interface Density</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger id="density">
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show call timer</p>
                  <p className="text-sm text-muted-foreground">Display call duration in real-time</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact sidebar</p>
                  <p className="text-sm text-muted-foreground">Use icons-only sidebar by default</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <NotificationSettings />

        </TabsContent>

        <TabsContent value="audio" className="space-y-4 mt-4">
          <AudioSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

