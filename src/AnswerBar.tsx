import React from "react"

interface AnswerBarProps {
  guess: string
  setGuess: (value: string) => void
  handleGuess: () => void
  showRandomShape: () => void
}

const AnswerBar: React.FC<AnswerBarProps> = ({
  guess,
  setGuess,
  handleGuess,
  showRandomShape,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleGuess()
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-white shadow-md">
      <div className="flex justify-between mb-2">
        <button
          onClick={showRandomShape}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Show Random Country
        </button>
        <button
          onClick={handleGuess}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Guess
        </button>
      </div>
      <form className="flex justify-center" onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Guess the country"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </form>
    </div>
  )
}

export default AnswerBar
