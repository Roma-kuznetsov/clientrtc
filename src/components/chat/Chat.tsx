import { FC } from "react";
import { iMessage } from "../types/chat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export const Chat: FC = ({ }) => {
  const messages: iMessage[] = [
    {
      content: "MESSAGE",
      author: "test",
      timestamp: "111111111"
    },
    {
      content: "MESSAGE 2",
      author: "test",
      timestamp: "111111111"
    }
  ]
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {messages.map((message) => <ChatBubble message={message} />)}
      </div>
      <ChatInput />
    </div>
  )
}