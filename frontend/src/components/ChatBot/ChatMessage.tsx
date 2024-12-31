import React from "react";
import { Message } from "./types";
import { MessageContent } from "./MessageContent/MessageContent";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.isUser ? "justify-end" : "justify-start"
      } group`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          message.isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
        } shadow-sm hover:shadow-md transition-shadow duration-200`}
      >
        <MessageContent message={message} />
        <span className="text-xs mt-2 transition-opacity">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
