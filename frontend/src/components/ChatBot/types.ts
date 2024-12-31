export interface BaseMessage {
  id: string;
  timestamp: Date;
  isUser: boolean;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  text: string;
}

export interface LinkButtonMessage extends BaseMessage {
  type: 'link';
  text: string;
  url: string;
  buttonText: string;
}

export interface FileDownloadMessage extends BaseMessage {
  type: 'file';
  text: string;
  fileName: string;
  fileUrl: string;
}

export interface InstructionsMessage extends BaseMessage {
  type: 'instructions';
  title: string;
  steps: string[];
}

export type Message = TextMessage | LinkButtonMessage | FileDownloadMessage | InstructionsMessage;