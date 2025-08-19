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

// Direct message user information for participants
export interface DirectMessageUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY';
}

// Current user specific information for a direct message thread
export interface DirectMessageCurrentUser {
  id: string;
  unreadCount: number;
  lastReadAt: string;
  isMuted: boolean;
}

// Direct message thread/conversation
export interface DirectMessage {
  id: string;
  workspaceId: string;
  lastMessageAt: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  currentUser: DirectMessageCurrentUser;
  otherUser: DirectMessageUser;
}

// API response data structure for direct messages
export interface DirectMessagesData {
  directMessages: DirectMessage[];
  totalCount: number;
  hasMore: boolean;
}
