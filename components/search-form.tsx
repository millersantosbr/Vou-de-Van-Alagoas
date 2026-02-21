"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Bus, Train, TramFrontIcon as Tram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchForm() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [transportType, setTransportType] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${transportType}`)
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Find Your Route</CardTitle>
        <CardDescription>Search by route number, stop name, or destination</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="route" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="route">Route</TabsTrigger>
            <TabsTrigger value="stop">Stop</TabsTrigger>
            <TabsTrigger value="trip">Trip Planner</TabsTrigger>
          </TabsList>
          <TabsContent value="route">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter route number or name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={transportType} onValueChange={setTransportType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Transport Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bus">
                      <div className="flex items-center">
                        <Bus className="mr-2 h-4 w-4" />
                        Bus
                      </div>
                    </SelectItem>
                    <SelectItem value="train">
                      <div className="flex items-center">
                        <Train className="mr-2 h-4 w-4" />
                        Train/Metro
                      </div>
                    </SelectItem>
                    <SelectItem value="tram">
                      <div className="flex items-center">
                        <Tram className="mr-2 h-4 w-4" />
                        Tram
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="stop">
            <form className="space-y-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <Input type="text" placeholder="Enter stop name or ID" className="w-full" />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Find Stop
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="trip">
            <form className="space-y-4">
              <div className="grid gap-4">
                <Input type="text" placeholder="From: Starting point" />
                <Input type="text" placeholder="To: Destination" />
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Select defaultValue="now">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Departure Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Leave Now</SelectItem>
                      <SelectItem value="depart">Depart At</SelectItem>
                      <SelectItem value="arrive">Arrive By</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="w-full sm:w-auto">
                    Plan Trip
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

