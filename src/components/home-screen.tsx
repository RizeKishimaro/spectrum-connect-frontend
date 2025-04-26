import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Clock, ThumbsUp, Users } from "lucide-react"

export function HomeScreen() {
  return (
    <div className="space-y-6 px-6 w-full">
      <h2 className="text-3xl font-bold tracking-tight">Welcome, Agent</h2>
      <p className="text-muted-foreground">Here's an overview of your performance and upcoming tasks.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Volume</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Call Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <p className="text-xs text-muted-foreground">-12s from average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers Helped</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your upcoming shifts and breaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Morning Shift</p>
                  <p className="text-sm text-muted-foreground">8:00 AM - 12:00 PM</p>
                </div>
                <div className="text-sm text-green-500 font-medium">Active</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Lunch Break</p>
                  <p className="text-sm text-muted-foreground">12:00 PM - 1:00 PM</p>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Upcoming</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Afternoon Shift</p>
                  <p className="text-sm text-muted-foreground">1:00 PM - 5:00 PM</p>
                </div>
                <div className="text-sm text-muted-foreground font-medium">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>How your team is performing today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Call Answer Rate</p>
                  <p className="text-sm font-medium">98%</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[98%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">First Call Resolution</p>
                  <p className="text-sm font-medium">86%</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[86%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Average Wait Time</p>
                  <p className="text-sm font-medium">45s</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[75%] rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

