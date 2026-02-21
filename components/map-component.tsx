"use client"

import type React from "react"

import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapComponentProps {
  userLocation: [number, number]
  nearbyStops: Array<{
    id: string
    name: string
    lat: number
    lng: number
    cities?: string[]
  }>
  onMarkerClick?: (stop: any) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, nearbyStops, onMarkerClick }) => {
  useEffect(() => {
    // Create custom icons
    const userIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="background-image: url('/user-location-pin.svg'); 
                    background-size: contain; 
                    background-repeat: no-repeat;
                    width: 32px; 
                    height: 32px;">
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -38],
    })

    const terminalIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="background-image: url('/terminal-location-pin.svg'); 
                    background-size: contain; 
                    background-repeat: no-repeat;
                    width: 32px; 
                    height: 32px;">
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -38],
    })

    // Create special bus station icon
    const busStationIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="background-image: url('/bus-station-pin.svg'); 
                    background-size: contain; 
                    background-repeat: no-repeat;
                    width: 42px; 
                    height: 42px;">
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -48],
    })

    const map = L.map("map")

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Add user location marker
    const userMarker = L.marker(userLocation, {
      icon: userIcon,
    })
      .addTo(map)
      .bindPopup("Sua localização")

    // Add terminal markers
    const stopMarkers = nearbyStops.map((stop) => {
      const popupContent = `
        <a href="https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="maps-link">
          <svg xmlns="http://www.w3.org/2000/svg" 
               width="16" 
               height="16" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               style="display: inline-block; vertical-align: middle; margin-right: 4px;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Abrir no Mapa
        </a>
      `

      // Check if this is the bus station (using the specific coordinates)
      const isBusStation = stop.lat === -9.645624511262968 && stop.lng === -35.72649554680165

      const marker = L.marker([stop.lat, stop.lng], {
        icon: isBusStation ? busStationIcon : terminalIcon,
      })
        .addTo(map)
        .bindPopup(popupContent)

      // Add click event to marker
      marker.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(stop)
        }
      })

      return marker
    })

    // Create a group of all markers
    const group = new L.featureGroup([userMarker, ...stopMarkers])

    // Fit the map to show all markers
    map.fitBounds(group.getBounds().pad(0.1))

    return () => {
      map.remove()
    }
  }, [userLocation, nearbyStops, onMarkerClick])

  return <div id="map" style={{ height: "100%", width: "100%" }} />
}

export default MapComponent

