// User-related types for the application
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  online: boolean;
  lastSeen: Date;
}
