import React from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import geojsonData from "./assets/ExampleBorders.geojson"

const MapComponent: React.FC = () => {
  return (
    <MapContainer
      center={[61.4978, 23.761]}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "calc(100vh - 100px)", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geojsonData} />
    </MapContainer>
  )
}

export default MapComponent
