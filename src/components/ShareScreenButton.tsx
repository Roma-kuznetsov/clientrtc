import React, { FC } from "react"

export const ShareScreenButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white">
      screen
    </button>
  )
}
