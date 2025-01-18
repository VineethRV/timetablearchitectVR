import React from 'react';
import { Message } from '../types';
import { LinkButton } from './LinkButton';
import { FileDownload } from './FileDownload';
import { Instructions } from './Instructions';

export const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
  switch (message.type) {
    case 'text':
      return <p className="text-sm">{message.text}</p>;
      
    case 'link':
      return (
        <div>
          <p className="text-sm">{message.text}</p>
          <LinkButton url={message.url} buttonText={message.buttonText} />
        </div>
      );
      
    case 'file':
      return (
        <div>
          <p className="text-sm">{message.text}</p>
          <FileDownload fileName={message.fileName} fileUrl={message.fileUrl} />
        </div>
      );
      
    case 'instructions':
      return (
        <div>
          {/* <Instructions title={message.title} steps={message.steps} /> */}
        </div>
      );
  }
};