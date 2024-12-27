import React from "react"
import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet"
import { Feature, Geometry, GeoJsonProperties, GeoJsonObject } from "geojson"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
//@ts-expect-error no need for this error
import big_borders from "./assets/maakuntarajat.js"

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
  borders: GeoJsonObject
  rightCountries: Feature<Geometry, GeoJsonProperties>[]
  wrongCountries: Feature<Geometry, GeoJsonProperties>[]
  tileLayerUrl: string
}

const MapComponent: React.FC<MapComponentProps> = ({
  currentShape,
  shapeName,
  currentPoint,
  borders,
  rightCountries,
  wrongCountries,
  tileLayerUrl,
}) => {
  let zoom = 5
  if (currentPoint) {
    zoom = 6.5
  }

  return (
    <div className="relative">
      {/* THIS COMPONENT CAN BE TURNED ON FOR DEBUGGING PURPOSES */}
      {/* {shapeName && (
        <div className="absolute top-20 right-4 z-[1000] bg-white p-2 rounded shadow">
          Current Shape: {shapeName}
        </div>
      )} */}
      <MapContainer
        key={currentPoint ? currentPoint.join(",") : "default"} // Force re-render on currentPoint change
        center={currentPoint || [64.4978, 26.761]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url={tileLayerUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentShape.map((shape, index) => (
          <GeoJSON
            key={`${shapeName}-${index}`}
            data={shape}
            style={() => ({
              color: "black",
              weight: 1.6,
              opacity: 1,
              fillColor: "blue",
              fillOpacity: 0.4,
            })}
          />
        ))}
        {rightCountries.map((shape, index) => (
          <GeoJSON
            key={`${shapeName}-${index}`}
            data={shape}
            style={() => ({
              color: "green",
              weight: 0,
              opacity: 1,
              fillColor: "green",
              fillOpacity: 0.5,
            })}
          />
        ))}
        {wrongCountries.map((shape, index) => (
          <GeoJSON
            key={`${shapeName}-${index}`}
            data={shape}
            style={() => ({
              color: "red",
              weight: 0,
              opacity: 1,
              fillColor: "red",
              fillOpacity: 0.4,
            })}
          />
        ))}
        <GeoJSON
          data={borders}
          style={() => ({
            color: "black",
            weight: 1.6,
            opacity: 0.3,
          })}
        />
        <GeoJSON
          data={big_borders}
          style={() => ({
            color: "black",
            weight: 1.5,
            opacity: 10,
            fillOpacity: 0,
          })}
        />
        {currentPoint && <Marker position={currentPoint} icon={smallIcon} />}
      </MapContainer>
    </div>
  )
}

export default MapComponent
