import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatBotIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatBotIcon: React.FC<ChatBotIconProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  );
};