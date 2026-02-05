"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Filter,
  Layers,
  Navigation,
  Zap,
  MapPin,
  Battery,
  Clock,
  ChevronRight,
} from "lucide-react"
import { mockStations } from "@/lib/data/stations"

const statusColors = {
  online: "bg-primary text-primary-foreground",
  offline: "bg-destructive text-destructive-foreground",
  maintenance: "bg-warning text-warning-foreground",
  "coming-soon": "bg-muted text-muted-foreground",
}

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  const filteredStations = mockStations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || station.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selected = selectedStation
    ? mockStations.find((s) => s.id === selectedStation)
    : null

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Sidebar */}
      <div className="flex w-[360px] flex-col rounded-lg border border-border bg-card">
        {/* Search & Filters */}
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Station List */}
        <div className="flex-1 overflow-y-auto">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className={`cursor-pointer border-b border-border p-4 transition-colors hover:bg-secondary/50 ${
                selectedStation === station.id ? "bg-secondary/50" : ""
              }`}
              onClick={() => setSelectedStation(station.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{station.name}</h3>
                    <Badge
                      className={`text-xs ${statusColors[station.status as keyof typeof statusColors]}`}
                    >
                      {station.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{station.address}</p>
                  <p className="text-sm text-muted-foreground">{station.city}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {station.connectors.length} connectors
                </span>
                <span className="flex items-center gap-1">
                  <Battery className="h-3 w-3" />
                  {station.connectors.filter((c) => c.status === "available").length} available
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="border-t border-border p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-semibold text-foreground">{filteredStations.length}</p>
              <p className="text-xs text-muted-foreground">Stations</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-primary">
                {filteredStations.filter((s) => s.status === "online").length}
              </p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">
                {filteredStations.reduce((acc, s) => acc + s.connectors.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Connectors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-card">
        {/* Map Placeholder with Morocco map */}
        <div className="absolute inset-0 bg-secondary/30">
          <svg
            viewBox="0 0 800 600"
            className="h-full w-full"
            style={{ opacity: 0.1 }}
          >
            {/* Morocco simplified outline */}
            <path
              d="M200,100 L400,80 L550,120 L600,200 L580,350 L500,450 L350,500 L200,480 L150,350 L180,200 Z"
              fill="currentColor"
              className="text-foreground"
            />
          </svg>
          
          {/* Station markers */}
          {filteredStations.map((station, index) => {
            // Distribute stations across the map area
            const x = 150 + (index % 5) * 120 + Math.random() * 40
            const y = 100 + Math.floor(index / 5) * 100 + Math.random() * 40
            const isSelected = selectedStation === station.id
            
            return (
              <div
                key={station.id}
                className={`absolute cursor-pointer transition-transform ${
                  isSelected ? "scale-125 z-10" : "hover:scale-110"
                }`}
                style={{ left: `${x}px`, top: `${y}px` }}
                onClick={() => setSelectedStation(station.id)}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    station.status === "online"
                      ? "bg-primary text-primary-foreground"
                      : station.status === "offline"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-warning text-warning-foreground"
                  } ${isSelected ? "ring-4 ring-primary/30" : ""}`}
                >
                  <Zap className="h-4 w-4" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="h-10 w-10">
            <span className="text-lg font-bold">+</span>
          </Button>
          <Button size="icon" variant="secondary" className="h-10 w-10">
            <span className="text-lg font-bold">-</span>
          </Button>
          <Button size="icon" variant="secondary" className="h-10 w-10">
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Station Panel */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-border bg-card p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{selected.name}</h3>
                  <Badge
                    className={statusColors[selected.status as keyof typeof statusColors]}
                  >
                    {selected.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selected.address}, {selected.city}
                </p>
              </div>
              <Button size="sm">
                <Navigation className="mr-2 h-4 w-4" />
                Directions
              </Button>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-4">
              {selected.connectors.map((connector) => (
                <div
                  key={connector.id}
                  className={`rounded-lg border p-3 ${
                    connector.status === "available"
                      ? "border-primary/50 bg-primary/10"
                      : connector.status === "charging"
                        ? "border-chart-3/50 bg-chart-3/10"
                        : "border-border bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {connector.type}
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        connector.status === "available"
                          ? "bg-primary/20 text-primary"
                          : connector.status === "charging"
                            ? "bg-chart-3/20 text-chart-3"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {connector.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {connector.power} kW
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {selected.coordinates.lat.toFixed(4)}, {selected.coordinates.lng.toFixed(4)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                24/7 Available
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
