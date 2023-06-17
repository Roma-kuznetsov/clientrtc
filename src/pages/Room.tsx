import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContect";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";

export const Room: FC = () => {
  const { id } = useParams()
  const { ws, me, stream, peers } = useContext(RoomContext)
  useEffect(() => {
    console.log(me)
    if (me) ws.emit("join-room", { roomId: id, peerId: me._id })
  }, [id, me, ws, stream])
  return (
    <>
      <h1>roomID : {id}</h1>

      {Object.values(peers as PeerState).map((peer) => (
        <div><VideoPlayer stream={peer.stream} /></div>
      ))}
    </>
  );
};