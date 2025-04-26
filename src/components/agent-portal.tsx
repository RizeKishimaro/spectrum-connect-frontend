import { useState } from "react"
import { AgentSidebar } from "@/components/agent-sidebar"
import { HomeScreen } from "@/components/home-screen"
import { RecentCalls } from "@/components/recent-calls"
import { AccountManagement } from "@/components/account-management"
import { Settings } from "@/components/settings"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import WebPhone from "@/components/web-phone"
import { Button } from "@/components/ui/button"
import { Menu, Phone } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function AgentPortal() {
  const [currentSection, setCurrentSection] = useState("home")
  const renderContent = () => {
    switch (currentSection) {
      case "recent-calls":
        return <RecentCalls />
      case "account":
        return <AccountManagement />
      case "settings":
        return <Settings />
      case "login":
        return "login"
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="min-h-screen w-screen">
      <AgentSidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <SidebarInset>

        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-3">

            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Big Boi Calls</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Phone className="h-4 w-4" />
                Open Phone
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md p-0 bg-transparent border-none">
              <WebPhone />
            </SheetContent>
          </Sheet>
        </header>
        <main className="py-6 w-full">{renderContent()}</main>
      </SidebarInset>
    </div>
  )
}

