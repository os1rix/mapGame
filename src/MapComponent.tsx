import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
// @ts-expect-error: JS file without types
import shape from "./assets/areas/shape_0.js"
// @ts-expect-error: JS file without types
import borders from "./assets/ExampleBorders.js"

const MapComponent: React.FC = () => {
  return (
    <MapContainer
      center={[65.4978, 26.761]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "90vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={shape} />
    </MapContainer>
  )
}

export default MapComponent
