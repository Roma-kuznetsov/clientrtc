import { FC, useContext } from "react";
import { IMessage } from "../types/chat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { RoomContext } from "../../context/RoomContext";

export const Chat: FC = ({ }) => {
  const { chat } = useContext(RoomContext)
  console.log(chat)
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {chat.messages ? chat.messages.map((message: IMessage) => <ChatBubble message={message} />) : <ChatBubble newChat={true} />}
      </div>
      <ChatInput />
    </div>
  )
}