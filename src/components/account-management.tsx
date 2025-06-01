import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axiosClient from "@/hooks/axiosClient"
import { useSelector } from "react-redux"
import { ReducersTypes } from "@/redux/store/store"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/actions/userAction"

export function AccountManagement() {

  const agent = useSelector((state: ReducersTypes) => state.user.user)
  const [firstName, setFirstName] = useState(agent.user.firstName);
  const [lastName, setLastName] = useState(agent.user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(agent.user.phoneNumber);
  const [sipUname, setSipUname] = useState(agent.user.sipUname);
  const [sipPassword, setSipPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState("/placeholder.svg?height=80&width=80");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("sipUname", sipUname);
    formData.append("sipPassword", sipPassword);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const res = await axiosClient.patch(`/agents/${agent.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Update complete~ 💕", res.data);
      const payload = res.data
      localStorage.setItem("token", payload.access_token)
      localStorage.setItem("user", JSON.stringify(payload.user))
      dispatch(setUser({
        name: payload.user.name,
        id: payload.user.id,
        user: payload.user
      }))
    } catch (err) {
      console.error("Nyaa~ error happened 💔", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };
  return (
    <div className="space-y-6 p-5 h-full">
      <h2 className="text-3xl font-bold tracking-tight">Account Management</h2>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={agent.user.profilePicture ? `${import.meta.env.VITE_APP_API_URL}/${agent.user.profilePicture}` : previewURL} alt="Agent" />
                  <AvatarFallback>AG</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="upload"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button size="sm" onClick={() => document.getElementById("upload")?.click()}>
                    Upload new photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">

                <Label htmlFor="sipUname">SIP Username</Label>
                <Input id="sipUname" value={sipUname} onChange={(e) => setSipUname(e.target.value)} />

              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sipPassword">SIP Password</Label>
                <Input
                  id="sipPassword"
                  type="password"
                  value={sipPassword}
                  onChange={(e) => setSipPassword(e.target.value)}
                />
              </div>

            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit}>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-factor authentication</p>
                  <p className="text-sm text-muted-foreground">Protect your account with 2FA.</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Desktop notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications on your desktop.</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS.</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

