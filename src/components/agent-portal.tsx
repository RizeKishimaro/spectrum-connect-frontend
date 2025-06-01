
"use client"

import { useState } from "react"
import { AgentSidebar } from "@/components/agent-sidebar"
import { HomeScreen } from "@/components/home-screen"
import { RecentCalls } from "@/components/recent-calls"
import { AccountManagement } from "@/components/account-management"
import { Settings } from "@/components/settings"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { WebPhoneUI } from "@/components/web-phone-ui"
import { CallStatusIndicator } from "@/components/call-status-indicator"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logout from "./logout"

export function AgentPortal() {
  const [currentSection, setCurrentSection] = useState("home")
  const [isPhoneOpen, setIsPhoneOpen] = useState(false)

  const renderContent = () => {
    switch (currentSection) {
      case "recent-calls":
        return <RecentCalls />
      case "account":
        return <AccountManagement />
      case "settings":
        return <Settings />
      case "logout":
        return <Logout />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="min-h-screen w-screen bg-inherit">
      <AgentSidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">
              <img src="/logo.png" className="w-10" />
            </h1>
          </div>
          <Sheet open={isPhoneOpen} onOpenChange={setIsPhoneOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Phone className="h-4 w-4" />
                Open Phone
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md p-0 bg-transparent border-none">
              <WebPhoneUI />
            </SheetContent>
          </Sheet>
        </header>
        <main className="py-6 w-full">{renderContent()}</main>
        <CallStatusIndicator />
      </SidebarInset>
    </div>
  )
}

