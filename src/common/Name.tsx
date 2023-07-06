import { FC, useContext } from "react"
import { RoomContext } from "../context/RoomContext"

export const Name: FC = () => {
  const { userName, setUserName } = useContext(RoomContext)
  return (
    <input className="border rounded-md p-2 h-10 my-2"
      placeholder="Enter your name"
      value={userName}
      onChange={(e) => setUserName(e.target.value)} />
  )
}