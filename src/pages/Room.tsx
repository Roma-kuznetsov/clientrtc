import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContect";

export const Room: FC = () => {
  const { id } = useParams()
  const { ws } = useContext(RoomContext)
  useEffect(() => {
    ws.emit("join-room", { roomId: id })
  }, [id])
  return (
    <div>
      room{id}
    </div>
  );
};