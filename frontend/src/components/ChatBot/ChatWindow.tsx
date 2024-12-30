import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { getMockResponse } from './mockApi';
import { BiBot } from 'react-icons/bi';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false, timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = { text, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);

    try {
      // Get bot response
      const response = await getMockResponse(text);
      
      // Add bot response
      const botMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`fixed bottom-24 right-6 w-96 bg-gray-50 rounded-lg shadow-2xl transition-all duration-300 transform ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}
    >
      <div className="h-[500px] flex flex-col">
        <div className="bg-blue-600 p-4 rounded-t-lg flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <BiBot size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Chat Assistant</h2>
            <p className="text-blue-100 text-sm">Always here to help</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              text={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};