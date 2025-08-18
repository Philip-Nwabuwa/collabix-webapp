// Chat-related types for channels, messages, and direct messaging
export interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId?: string;
  recipientId?: string;
  createdAt: Date;
  updatedAt: Date;
  edited: boolean;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}