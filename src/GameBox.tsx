import { useState, useEffect } from "react"
import { Feature, Geometry, GeoJsonProperties } from "geojson"
import AnswerBar from "./AnswerBar"
import MapComponent from "./MapComponent"
//@ts-expect-error works just fine :D
import csvData from "./assets/Coordinates_with_shapes.js"

// import bordersData from "./assets/BordersReOrder.js" // Import borders data
//@ts-expect-error works just fine :D
import bordersData from "./assets/Filtered_Borders_More_Than_25_Coordinates.js"

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
  const [attempts, setAttempts] = useState<number>(0)

  const [selectedCountries, setSelectedCountries] = useState<Set<number>>(
    new Set()
  ) // Track selected countries
  const [rightCountries, setRightCountries] = useState<
    Feature<Geometry, GeoJsonProperties>[]
  >([])
  const [wrongCountries, setWrongCountries] = useState<
    Feature<Geometry, GeoJsonProperties>[]
  >([])
  const [answered, setAnswered] = useState<boolean>(true)
  const [tileLayerUrl, setTileLayerUrl] = useState<string>(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
  )

  useEffect(() => {
    // Parse the CSV data
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
    console.log(parsedData)
  }, [])

  const showRandomShape = async () => {
    // Ensure the country hasn't been selected yet
    if (selectedCountries.size >= countryData.length) {
      setFeedbackVisible(true)
      setFeedback("Nice job!\nReload the page to play again!")
      setTimeout(() => {
        setFeedbackVisible(false)
      }, 4000)
      return
    }
    if (!answered) {
      setFeedbackVisible(true)
      setFeedback("Try to guess first!")
      setTimeout(() => {
        setFeedbackVisible(false)
      }, 3000)
      return
    }
    setAnswered(false)
    setAttempts(0)
    setGuess("")

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
      console.log(selectedCountry)
    } catch (error) {
      console.error("Error loading shapes:", error)
    }
  }

  const handleGuess = () => {
    if (selectedCountries.size >= countryData.length) {
      setFeedbackVisible(true)
      setFeedback("Nice job!\nReload the page to play again!")
      setTimeout(() => {
        setFeedbackVisible(false)
      }, 4000)
      return
    }
    setAttempts((prev) => prev + 1)
    if (
      guess.trim().toLowerCase() ===
      currentCountry?.country.trim().toLowerCase()
    ) {
      setFeedback("Correct!")
      if (!answered) {
        setRightCountries((prev) => [...prev, ...currentShape])
      }
      setAnswered(true)
    } else {
      if (attempts == 1) {
        // Check if it's the second attempt
        setFeedback(`The town is ${currentCountry?.country}.`)
        setWrongCountries((prev) => [...prev, ...currentShape])
        setAnswered(true)
        console.log(wrongCountries)
      } else if (attempts > 1) {
        setFeedback(`The town is ${currentCountry?.country}.`)
      } else {
        setFeedback("Try again!")
      }
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

  const changeTileLayer = () => {
    setTileLayerUrl((prevUrl) =>
      prevUrl ===
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
    )
  }

  return (
    <div className="grid grid-cols-1">
      <div className="flex-[1_1_100%] overflow-hidden">
        <MapComponent
          currentShape={currentShape}
          shapeName={shapeName}
          currentPoint={currentPoint}
          borders={bordersData}
          wrongCountries={wrongCountries}
          rightCountries={rightCountries}
          tileLayerUrl={tileLayerUrl}
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
        <div className="fixed left-1/2 bottom-32 transform -translate-x-1/2 w-full max-w-xs z-[11000] bg-white p-2 rounded shadow flex justify-between">
          <div className="text-black text-sm py-2 px-3 mx-1 rounded">
            {`Counter: ${selectedCountries.size}/${countryData.length}`}
          </div>
          <button
            onClick={changeTileLayer}
            className="bg-purple-500 hover:bg-purple-700 text-sm text-white font-bold py-2 px-3 mx-1 rounded"
          >
            Change Map Layer
          </button>
        </div>
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
