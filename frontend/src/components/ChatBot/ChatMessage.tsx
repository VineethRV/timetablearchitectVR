import React from 'react';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser, timestamp = new Date() }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
        } shadow-sm hover:shadow-md transition-shadow duration-200`}
      >
        <p className="text-sm">{text}</p>
        <span className="text-xs mt-1 transition-opacity">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};