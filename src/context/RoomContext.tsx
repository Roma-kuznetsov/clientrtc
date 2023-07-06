import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "../reducers/peerReducer";
import { addPeerAction, removePeerAction } from "../reducers/peerActions";
import { IMessage } from "../components/types/chat";
import { chatReducer } from "../reducers/chatReducer";
import { addHistoryAction, addMessageAction, toggleChatAction } from "../reducers/chatActions";

let WS;
let PEER_SERVER = { host: "peerjs-q12f.onrender.com", port: 443, secure: true };
if (process.env.NODE_ENV === 'production') {
    WS = "https://serverrtc.onrender.com"
} else {
    WS = "http://localhost:8080";
}

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export const RoomProvider: React.FC<any> = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const [roomId, setRoomId] = useState<string>();
    const [chat, chatDispatch] = useReducer(chatReducer, {
        messages: [],
        isChatOpen: false
    });

    const enterRoom = ({ roomId }: { roomId: "string" }) => {
        console.log({ roomId });
        navigate(`/room/${roomId}`);
    };
    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log({ participants });
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerAction(peerId));
    };

    const switchStream = (stream: MediaStream) => {
        setStream(stream);
        setScreenSharingId(me?.id || "");
        Object.values(me?.connections).forEach((connection: any) => {
            const videoTrack = stream
                ?.getTracks()
                .find((track) => track.kind === "video");
            console.log(connection[0].peerConnection.getSenders()[1]);
            connection[0].peerConnection
                .getSenders()[1]
                .replaceTrack(videoTrack)
                .catch((err: any) => console.error(err));
        });
    };

    const shareScreen = () => {
        if (screenSharingId) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then(switchStream);
        } else {
            navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
        }
    };
    const sendMessage = (message: string) => {
        const messageData: IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author: me?.id
        }
        chatDispatch(addMessageAction(messageData));
        ws.emit("send-message", roomId, messageData)
    }
    const addMessage = (message: IMessage) => {
        chatDispatch(addMessageAction(message));
    }
    const addHistory = (messages: IMessage[]) => {
        chatDispatch(addHistoryAction(messages));
    }
    const toggleChat = () => {
        chatDispatch(toggleChatAction(!chat.isChatOpen));
    }
    useEffect(() => {
        const meId = uuidV4();

        const peer = new Peer(meId, PEER_SERVER);
        setMe(peer);

        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setStream(stream);
                });
        } catch (err: any) {
            console.log(err); /* handle the error */
            if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
                //required track is missing 
            } else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
                //webcam or mic are already in use 
            } else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
                //constraints can not be satisfied by avb. devices 
            } else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
                //permission denied in browser 
            } else if (err.name == "TypeError" || err.name == "TypeError") {
                //empty constraints object 
            } else {
                //other errors 

            }
        }

        ws.on("room-created", enterRoom);
        ws.on("get-users", getUsers);
        ws.on("user-disconnected", removePeer);
        ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
        ws.on("user-stopped-sharing", () => setScreenSharingId(""));
        ws.on("add-message", addMessage)
        ws.on("get-messages", addHistory)
        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("user-started-sharing");
            ws.off("user-stopped-sharing");
            ws.off("user-joined");
            ws.off("add-message")
            ws.off("get-messages")
        };
    }, []);

    useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", { peerId: screenSharingId, roomId });
        } else {
            ws.emit("stop-sharing");
        }
    }, [screenSharingId, roomId]);

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

    console.log({ peers });

    return (
        <RoomContext.Provider
            value={{
                ws,
                me,
                stream,
                peers,
                shareScreen,
                setRoomId,
                screenSharingId,
                sendMessage,
                chat,
                toggleChat,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
