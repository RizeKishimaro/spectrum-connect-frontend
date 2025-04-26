"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, UserCog, SettingsIcon, Home, DoorOpen } from "lucide-react"

interface AgentSidebarProps {
  currentSection: string
  setCurrentSection: (section: string) => void
}

export function AgentSidebar({ currentSection, setCurrentSection }: AgentSidebarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "recent-calls", label: "Recent Calls", icon: Clock },
    { id: "account", label: "Account Management", icon: UserCog },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ]

  return (
    <Sidebar className="block">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Agent" />
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Agent Portal</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setCurrentSection(item.id)}
                isActive={currentSection === item.id}
                tooltip={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs">Agent Status: Available</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

