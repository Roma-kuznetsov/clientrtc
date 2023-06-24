import React, { createContext, useEffect, useState, useReducer } from 'react';
import socketIOClient from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import Peer from 'peerjs';
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from './peerReducer';
import { addPeerAction, removePeerAction } from './peerActions';
let WS;
if (process.env.NODE_ENV === 'production') {
  WS = "https://serverrtc-production.up.railway.app"
}else{
  WS = 'http://localhost:8080';
}

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS)

interface Props {
  children: React.ReactNode
}

export const RoomProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId })
    navigate(`/room/${roomId}`)
  }

  const getUsers = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
    console.log(roomId, participants)
  }
  const removePeer = (peerId:string) =>{
    dispatch(removePeerAction(peerId))
  }

  useEffect(() => {
    const meId = uuidV4()
    const peer = new Peer(meId)
    setMe(peer)
    try {
      navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then((stream) => {
          setStream(stream)
        })
    } catch (error) {
      console.log(error)
    }
    ws.on("user-disconnected",removePeer)
    ws.on("room-created", enterRoom)
    ws.on("get-users", getUsers)
  }, [])

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on("user-joined", ({ peerId }) => {
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  console.log({ peers })
  return (
    <RoomContext.Provider value={{ ws, me, stream, peers }}>{children}</RoomContext.Provider>
  )
}