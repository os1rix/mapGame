import React from "react"
import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet"
import { Feature, Geometry, GeoJsonProperties } from "geojson"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

const smallIcon = new Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [12, 20],
  iconAnchor: [6, 20],
  popupAnchor: [0, -20],
})

interface MapComponentProps {
  currentShape: Feature<Geometry, GeoJsonProperties>[]
  shapeName: string
  currentPoint: [number, number] | null
}

const MapComponent: React.FC<MapComponentProps> = ({
  currentShape,
  shapeName,
  currentPoint,
}) => {
  return (
    <div className="relative">
      {/* THIS COMPONENT CAN BE TURNED ON FOR DEBUGGING PURPOSES */}
      {/* {shapeName && (
        <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded shadow">
          Current Shape: {shapeName}
        </div>
      )} */}
      <MapContainer
        center={[65.4978, 26.761]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentShape.map((shape, index) => (
          <GeoJSON key={`${shapeName}-${index}`} data={shape} />
        ))}
        {currentPoint && <Marker position={currentPoint} icon={smallIcon} />}
      </MapContainer>
    </div>
  )
}

export default MapComponent
