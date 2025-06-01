import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchOverviewData } from "@/redux/actions/overviewSlice"
import { ReducersTypes } from "@/redux/store/store"
import { Phone, Clock, ThumbsUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"

const shifts = [
  { title: "Morning Shift", start: "08:00", end: "12:00" },
  { title: "Lunch Break", start: "12:00", end: "13:00" },
  { title: "Afternoon Shift", start: "13:00", end: "17:00" }
]
export function HomeScreen() {

  const agent = useSelector((state: ReducersTypes) => state.user.user)
  const { data, loading, error } = useSelector((state: ReducersTypes) => state.overview)
  const dispatch = useDispatch()
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000 * 60)

    return () => clearInterval(timer)
  }, [])

  const getShiftStatus = (start: string, end: string) => {
    const now = currentTime
    const startTime = new Date(now)
    const endTime = new Date(now)

    const [startH, startM] = start.split(":").map(Number)
    const [endH, endM] = end.split(":").map(Number)

    startTime.setHours(startH, startM, 0, 0)
    endTime.setHours(endH, endM, 0, 0)

    if (now >= startTime && now <= endTime) return "Active"
    if (now < startTime) return "Upcoming"
    return "Passed"
  }

  useEffect(() => {
    if (agent?.id) {
      dispatch(fetchOverviewData(agent.id) as any)
    }
  }, [agent?.id, dispatch])


  return (
    <div className="space-y-6 px-6 w-full">
      <h2 className="text-3xl font-bold tracking-tight">Welcome, {agent.name}</h2>
      <p className="text-muted-foreground">Here's an overview of your performance and upcoming tasks.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Volume</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.callVolume ?? "--"}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Call Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.avgCallDuration ?? "--"}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        {/* <Card> */}
        {/*   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"> */}
        {/*     <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle> */}
        {/*     <ThumbsUp className="h-4 w-4 text-muted-foreground" /> */}
        {/*   </CardHeader> */}
        {/*   <CardContent> */}
        {/*     <div className="text-2xl font-bold">{data?.customerSatisfaction ?? "0"}%</div> */}
        {/*   </CardContent> */}
        {/* </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unqiue Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.customersHelped ?? "--"}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your upcoming shifts and breaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shifts.map((shift, idx) => {
                const status = getShiftStatus(shift.start, shift.end)
                const statusClass =
                  status === "Active" ? "text-green-500" :
                    status === "Upcoming" ? "text-muted-foreground" :
                      "text-red-400"
                return (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p className="font-medium">{shift.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {shift.start} - {shift.end}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${statusClass}`}>{status}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        {/* <Card> */}
        {/*   <CardHeader> */}
        {/*     <CardTitle>Team Performance</CardTitle> */}
        {/*     <CardDescription>How your team is performing today</CardDescription> */}
        {/*   </CardHeader> */}
        {/*   <CardContent> */}
        {/*     <div className="space-y-4"> */}
        {/*       <div> */}
        {/*         <div className="flex items-center justify-between"> */}
        {/*           <p className="text-sm font-medium">Call Answer Rate</p> */}
        {/*           <p className="text-sm font-medium">98%</p> */}
        {/*         </div> */}
        {/*         <div className="mt-2 h-2 w-full rounded-full bg-muted"> */}
        {/*           <div className="h-full w-[98%] rounded-full bg-primary"></div> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*       <div> */}
        {/*         <div className="flex items-center justify-between"> */}
        {/*           <p className="text-sm font-medium">First Call Resolution</p> */}
        {/*           <p className="text-sm font-medium">86%</p> */}
        {/*         </div> */}
        {/*         <div className="mt-2 h-2 w-full rounded-full bg-muted"> */}
        {/*           <div className="h-full w-[86%] rounded-full bg-primary"></div> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*       <div> */}
        {/*         <div className="flex items-center justify-between"> */}
        {/*           <p className="text-sm font-medium">Average Wait Time</p> */}
        {/*           <p className="text-sm font-medium">45s</p> */}
        {/*         </div> */}
        {/*         <div className="mt-2 h-2 w-full rounded-full bg-muted"> */}
        {/*           <div className="h-full w-[75%] rounded-full bg-primary"></div> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </CardContent> */}
        {/* </Card> */}
      </div>
    </div>
  )
}

