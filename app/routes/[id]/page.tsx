import Link from "next/link"
import { ArrowLeft, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimetableHeader } from "@/components/timetable-header"

export default function RoutePage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the route data based on the ID
  const route = {
    id: params.id,
    number: "42",
    name: "Central Station - University",
    type: "Bus",
    color: "bg-blue-500",
    stops: [
      { id: "1", name: "Central Station", time: "5:00 AM - 11:30 PM" },
      { id: "2", name: "City Hall", time: "5:05 AM - 11:35 PM" },
      { id: "3", name: "Market Square", time: "5:10 AM - 11:40 PM" },
      { id: "4", name: "Library", time: "5:15 AM - 11:45 PM" },
      { id: "5", name: "Science Park", time: "5:20 AM - 11:50 PM" },
      { id: "6", name: "University", time: "5:25 AM - 11:55 PM" },
    ],
    schedule: [
      { id: "1", departure: "5:00 AM", arrival: "5:25 AM", frequency: "Every 10 min" },
      { id: "2", departure: "6:00 AM", arrival: "6:25 AM", frequency: "Every 8 min" },
      { id: "3", departure: "7:00 AM", arrival: "7:25 AM", frequency: "Every 5 min" },
      { id: "4", departure: "8:00 AM", arrival: "8:25 AM", frequency: "Every 5 min" },
      { id: "5", departure: "9:00 AM", arrival: "9:25 AM", frequency: "Every 8 min" },
      { id: "6", departure: "10:00 AM", arrival: "10:25 AM", frequency: "Every 10 min" },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <TimetableHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${route.color}`}
            >
              {route.number}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{route.name}</h1>
              <p className="text-muted-foreground">{route.type}</p>
            </div>
          </div>

          <Tabs defaultValue="timetable" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="stops">Stops</TabsTrigger>
              <TabsTrigger value="map">Route Map</TabsTrigger>
            </TabsList>

            <TabsContent value="timetable" className="space-y-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Weekday Schedule</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Departure</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {route.schedule.map((time) => (
                      <TableRow key={time.id}>
                        <TableCell className="font-medium">{time.departure}</TableCell>
                        <TableCell>{time.arrival}</TableCell>
                        <TableCell>{time.frequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Earlier Times
                </Button>
                <Button variant="outline">
                  Later Times
                  <Clock className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="stops" className="space-y-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Route Stops</h2>
                <div className="space-y-4">
                  {route.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-start">
                      <div className="relative mr-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${route.color}`}
                        >
                          {index + 1}
                        </div>
                        {index < route.stops.length - 1 && (
                          <div className={`absolute top-8 left-1/2 w-0.5 h-12 -translate-x-1/2 ${route.color}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="font-medium">{stop.name}</div>
                        <div className="text-sm text-muted-foreground">{stop.time}</div>
                        <Button variant="ghost" size="sm" className="mt-1 h-8 px-2">
                          <MapPin className="mr-1 h-3 w-3" />
                          View Stop
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="map">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Route Map</h2>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Route map visualization would be displayed here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

