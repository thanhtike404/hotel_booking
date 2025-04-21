"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icon
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapProps {
  center: [number, number]
  name: string
  location: string
}

export default function Map({ center, name, location }: MapProps) {
  useEffect(() => {
    // Fix for map container not rendering properly
    const container = document.getElementById('map-container')
    if (container) {
      container.style.height = '300px'
      container.style.width = '100%'
    }
  }, [])

  return (
    <div id="map-container">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={icon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{name}</p>
              <p>{location}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}