"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

const agents = [
  {
    id: "agent-001",
    name: "John Doe",
    sipUname: "john.doe",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1234567890",
    status: "AVAILABLE",
    systemCompany: "Acme Inc",
  },
  {
    id: "agent-002",
    name: "Jane Smith",
    sipUname: "jane.smith",
    firstName: "Jane",
    lastName: "Smith",
    phoneNumber: "+0987654321",
    status: "BUSY",
    systemCompany: "Acme Inc",
  },
  {
    id: "agent-003",
    name: "Mike Johnson",
    sipUname: "mike.johnson",
    firstName: "Mike",
    lastName: "Johnson",
    phoneNumber: "+1122334455",
    status: "OFFLINE",
    systemCompany: "TechCorp",
  },
  {
    id: "agent-004",
    name: "Sarah Williams",
    sipUname: "sarah.williams",
    firstName: "Sarah",
    lastName: "Williams",
    phoneNumber: "+5566778899",
    status: "AVAILABLE",
    systemCompany: "TechCorp",
  },
  {
    id: "agent-005",
    name: "David Brown",
    sipUname: "david.brown",
    firstName: "David",
    lastName: "Brown",
    phoneNumber: "+1231231234",
    status: "RINGING",
    systemCompany: "GlobalTel",
  },
]

export function AgentTable() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500"
      case "BUSY":
        return "bg-red-500"
      case "RINGING":
        return "bg-yellow-500"
      case "OFFLINE":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleEdit = (agent: any) => {
    setSelectedAgent(agent)
    setIsEditDialogOpen(true)
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SIP Username</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell>{agent.sipUname}</TableCell>
                <TableCell>{agent.phoneNumber}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                </TableCell>
                <TableCell>{agent.systemCompany}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(agent)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>Update agent information and settings.</DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input id="firstName" defaultValue={selectedAgent.firstName} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input id="lastName" defaultValue={selectedAgent.lastName} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sipUname" className="text-right">
                  SIP Username
                </Label>
                <Input id="sipUname" defaultValue={selectedAgent.sipUname} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Phone Number
                </Label>
                <Input id="phoneNumber" defaultValue={selectedAgent.phoneNumber} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedAgent.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="BUSY">Busy</SelectItem>
                    <SelectItem value="RINGING">Ringing</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Select defaultValue={selectedAgent.systemCompany}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acme Inc">Acme Inc</SelectItem>
                    <SelectItem value="TechCorp">TechCorp</SelectItem>
                    <SelectItem value="GlobalTel">GlobalTel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
