import { useState } from "react"
import Start from "./Start.tsx"
import GameBox from "./GameBox.tsx"

function App() {
  const [showAnswerBar, setShowAnswerBar] = useState(false)

  const handleStartClick = () => {
    setShowAnswerBar(true)
  }

  return (
    <>
      {!showAnswerBar && <Start onStartClick={handleStartClick} />}
      {showAnswerBar && <GameBox />}
    </>
  )
}

export default App
