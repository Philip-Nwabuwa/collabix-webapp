// User-related types for the application
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  online: boolean;
  lastSeen: Date;
}