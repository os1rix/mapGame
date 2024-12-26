import { useState, useEffect } from "react"
import { Feature, Geometry, GeoJsonProperties } from "geojson"
import AnswerBar from "./AnswerBar"
import MapComponent from "./MapComponent"
//@ts-expect-error works just fine :D
import csvData from "./assets/Coordinates_with_shapes.js"
console.log(csvData)

const shapeFiles = Array.from({ length: 468 }, (_, i) => i).map(
  (num) => () => import(`./assets/areas/shape_${num}.js`)
)

interface CountryData {
  country: string
  coordinates: string
  shapes: number[]
  latLng: [number, number] | undefined
}

const GameBox = () => {
  const [currentShape, setCurrentShape] = useState<
    Feature<Geometry, GeoJsonProperties>[]
  >([])
  const [shapeName, setShapeName] = useState<string>("")
  const [countryData, setCountryData] = useState<CountryData[]>([])
  const [currentCountry, setCurrentCountry] = useState<CountryData | null>(null)
  const [currentPoint, setCurrentPoint] = useState<[number, number] | null>(
    null
  )
  const [guess, setGuess] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [feedbackVisible, setFeedbackVisible] = useState(false)

  const [selectedCountries, setSelectedCountries] = useState<Set<number>>(
    new Set()
  ) // Track selected countries

  useEffect(() => {
    // Parse the CSV data
    console.log(csvData)
    const parsedData = csvData
      .split("\n")
      .slice(1) // Skip header
      .map((line: string) => {
        const [country, coordinates, shapes] = line.split(";")
        return {
          country,
          coordinates,
          shapes: shapes.split(",").map(Number),
          latLng: parseCoordinates(coordinates),
        }
      })
      .filter((data: CountryData) =>
        data.shapes.every((shape) => !isNaN(shape))
      ) // Filter out any invalid entries
    setCountryData(parsedData)
  }, [])

  const showRandomShape = async () => {
    // Ensure the country hasn't been selected yet
    if (selectedCountries.size >= countryData.length) {
      setSelectedCountries(new Set())
    }

    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * countryData.length)
    } while (selectedCountries.has(randomIndex))

    selectedCountries.add(randomIndex)
    setSelectedCountries(new Set(selectedCountries))
    const selectedCountry = countryData[randomIndex]

    try {
      const shapeModules = await Promise.all(
        selectedCountry.shapes.map((shapeIndex) => shapeFiles[shapeIndex]())
      )
      const shapes = shapeModules.map(
        (module) => module.default as Feature<Geometry, GeoJsonProperties>
      )
      setCurrentShape(shapes)
      setShapeName(
        selectedCountry.shapes.map((index) => `shape_${index}`).join(", ")
      )
      setCurrentCountry(selectedCountry)
      setCurrentPoint(selectedCountry.latLng || null)
      setFeedback("")
    } catch (error) {
      console.error("Error loading shapes:", error)
    }
  }

  const handleGuess = () => {
    if (guess.toLowerCase() === currentCountry?.country.trim().toLowerCase()) {
      setFeedback("Correct!")
    } else {
      setFeedback("Try again!")
    }
    setFeedbackVisible(true)
    setTimeout(() => {
      setFeedbackVisible(false)
    }, 3000)
  }

  const parseCoordinates = (
    coordString: string
  ): [number, number] | undefined => {
    try {
      const [lat, lng] = coordString.split(",").map((coord) => {
        const num = parseFloat(coord.match(/\d+\.\d+/)?.[0] || "0")
        return coord.includes("S") || coord.includes("W") ? -num : num
      })
      return [lat, lng]
    } catch (error) {
      console.error("Error parsing coordinates:", error)
      return undefined
    }
  }

  return (
    <div className="relative h-screen flex flex-col">
      <div className="flex-[1_1_100%] overflow-hidden">
        <MapComponent
          currentShape={currentShape}
          shapeName={shapeName}
          currentPoint={currentPoint}
        />
        {feedbackVisible && (
          <div
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 z-[11000] bg-white p-2 rounded shadow`}
          >
            {feedback}
          </div>
        )}
      </div>
      <div className="flex-[0_1_15%] z-[1000]">
        <AnswerBar
          guess={guess}
          setGuess={setGuess}
          handleGuess={handleGuess}
          showRandomShape={showRandomShape}
        />
      </div>
    </div>
  )
}

export default GameBox
