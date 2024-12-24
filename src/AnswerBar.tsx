import React from "react"

const AnswerBar = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-white shadow-md">
      <form className="flex justify-center">
        <input
          type="text"
          placeholder="_ _ _ _ _ _"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </form>
    </div>
  )
}

export default AnswerBar
