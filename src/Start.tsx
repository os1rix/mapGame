import React from "react"

const Start = ({ onStartClick }: { onStartClick: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">KARTTAPELI</h1>
      <button
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        onClick={onStartClick}
      >
        PELAA PELIÄ
      </button>
    </div>
  )
}

export default Start
