import React, { useState } from 'react';
import { ChatBotIcon } from './ChatBotIcon';
import { ChatWindow } from './ChatWindow';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatWindow isOpen={isOpen} />
      <ChatBotIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </>
  );
};