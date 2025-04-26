import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Phone } from "lucide-react"

export function RecentCalls() {
  const callHistory = [
    {
      id: 1,
      callerId: "555-123-4567",
      callerName: "John Smith",
      duration: "4:32",
      timestamp: "Today, 10:30 AM",
      status: "completed",
    },
    {
      id: 2,
      callerId: "555-987-6543",
      callerName: "Jane Doe",
      duration: "2:15",
      timestamp: "Today, 9:45 AM",
      status: "completed",
    },
    {
      id: 3,
      callerId: "555-456-7890",
      callerName: "Alice Johnson",
      duration: "0:45",
      timestamp: "Today, 9:15 AM",
      status: "missed",
    },
    {
      id: 4,
      callerId: "555-789-0123",
      callerName: "Bob Williams",
      duration: "5:20",
      timestamp: "Yesterday, 4:30 PM",
      status: "completed",
    },
    {
      id: 5,
      callerId: "555-234-5678",
      callerName: "Carol Brown",
      duration: "3:10",
      timestamp: "Yesterday, 2:15 PM",
      status: "completed",
    },
    {
      id: 6,
      callerId: "555-345-6789",
      callerName: "David Miller",
      duration: "1:05",
      timestamp: "Yesterday, 11:30 AM",
      status: "transferred",
    },
    {
      id: 7,
      callerId: "555-456-7890",
      callerName: "Emma Wilson",
      duration: "6:45",
      timestamp: "2 days ago",
      status: "completed",
    },
    {
      id: 8,
      callerId: "555-567-8901",
      callerName: "Frank Thomas",
      duration: "2:30",
      timestamp: "2 days ago",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Recent Calls</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search calls..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Button>
            <Phone className="mr-2 h-4 w-4" />
            Make Call
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Call History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller ID</TableHead>
                <TableHead>Caller Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callHistory.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.callerId}</TableCell>
                  <TableCell>{call.callerName}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>{call.timestamp}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        call.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : call.status === "missed"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      }
                    >
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                      <span className="sr-only">Call back</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

