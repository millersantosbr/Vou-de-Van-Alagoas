"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import type { MapStop } from "@/lib/stops-data"
export type { MapStop }

interface MapComponentProps {
  userLocation: [number, number] | null
  stops: MapStop[]
  selectedStop: MapStop | null
  onMarkerClick?: (stop: MapStop) => void
  isLocked?: boolean
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  stops,
  selectedStop,
  onMarkerClick,
  isLocked = true,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const routeLineRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    // Check if map already initialized
    if (!mapRef.current) {
      const initialCenter: [number, number] = userLocation || [-9.6456, -35.7265] // Maceió coordinates
      const map = L.map("map-container", {
        zoomControl: false,
        dragging: !isLocked,
        touchZoom: !isLocked,
        scrollWheelZoom: !isLocked,
        doubleClickZoom: !isLocked,
      }).setView(initialCenter, 11)

      L.control.zoom({ position: "topright" }).addTo(map)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    }

    const map = mapRef.current

    // Update lock state on existing map instance
    if (isLocked) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.scrollWheelZoom.disable()
      map.doubleClickZoom.disable()
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.scrollWheelZoom.enable()
      map.doubleClickZoom.enable()
    }

    // Clear previous markers
    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    // Clear previous route line
    if (routeLineRef.current) {
      routeLineRef.current.remove()
      routeLineRef.current = null
    }

    // Add User Marker if available
    if (userLocation) {
      const userDivIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-blue-500/25 absolute animate-ping"></div>
            <div class="w-5 h-5 rounded-full bg-[#0038A8] border-2 border-white shadow-md flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const userMarker = L.marker(userLocation, { icon: userDivIcon })
        .addTo(map)
        .bindPopup("<strong>Sua Localização Atual</strong>")

      markersRef.current["user"] = userMarker
    }

    // Add Stop Markers
    const bounds = L.latLngBounds([])
    if (userLocation) bounds.extend(userLocation)

    stops.forEach((stop) => {
      const isSelected = selectedStop?.id === stop.id
      const isTerminal = stop.type === "terminal"
      const isPosto = stop.type === "posto"

      const pinColor = isTerminal ? "#0038A8" : isPosto ? "#002060" : "#D62828"

      const stopDivIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${isSelected ? "scale-125 z-50" : ""}">
            <div class="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white text-white font-bold" 
                 style="background-color: ${pinColor};">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                ${isTerminal 
                  ? '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.2 6 18.2 6H5.8C4.8 6 3.9 6.8 3.6 7.8L2.2 12.8c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>' 
                  : isPosto
                    ? '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/>'
                    : '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
                }
              </svg>
            </div>
            <div class="w-2 h-2 rotate-45 -mt-1 shadow-sm" style="background-color: ${pinColor};"></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42],
      })

      const marker = L.marker([stop.lat, stop.lng], { icon: stopDivIcon })
        .addTo(map)
        .on("click", () => {
          if (onMarkerClick) onMarkerClick(stop)
        })

      bounds.extend([stop.lat, stop.lng])
      markersRef.current[stop.id] = marker
    })

    // Draw route line if userLocation and selectedStop exist
    if (userLocation && selectedStop) {
      const line = L.polyline([userLocation, [selectedStop.lat, selectedStop.lng]], {
        color: "#0038A8",
        weight: 3,
        dashArray: "6, 8",
        opacity: 0.8,
      }).addTo(map)
      routeLineRef.current = line
    }

    // Camera adjustments
    if (selectedStop && userLocation) {
      const routeBounds = L.latLngBounds([userLocation, [selectedStop.lat, selectedStop.lng]])
      map.fitBounds(routeBounds, { padding: [60, 60] })
    } else if (selectedStop) {
      map.flyTo([selectedStop.lat, selectedStop.lng], 14, { duration: 1 })
    } else if (stops.length > 0 && !userLocation) {
      map.fitBounds(bounds, { padding: [40, 40] })
    } else if (userLocation) {
      map.flyTo(userLocation, 12, { duration: 1 })
    }

    return () => {
      // Cleanup on unmount or re-render
    }
  }, [userLocation, stops, selectedStop, onMarkerClick])

  return <div id="map-container" className="h-full w-full relative z-0" />
}

export default MapComponent


