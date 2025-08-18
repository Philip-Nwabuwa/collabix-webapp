import type {
  User,
  Channel,
  Message,
  DirectMessage,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Login API functions
export const loginApi = {
  login: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// User API functions
export const userApi = {
  getCurrentUser: (): Promise<ApiResponse<User>> => apiRequest("/users/me"),

  getUsers: (): Promise<ApiResponse<User[]>> => apiRequest("/users"),
};

// Channel API functions
export const channelApi = {
  getChannels: (): Promise<ApiResponse<Channel[]>> => apiRequest("/channels"),

  getChannel: (channelId: string): Promise<ApiResponse<Channel>> =>
    apiRequest(`/channels/${channelId}`),

  createChannel: (data: Partial<Channel>): Promise<ApiResponse<Channel>> =>
    apiRequest("/channels", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Message API functions
export const messageApi = {
  getChannelMessages: (
    channelId: string,
    page = 1
  ): Promise<PaginatedResponse<Message>> =>
    apiRequest(`/channels/${channelId}/messages?page=${page}`),

  getDirectMessages: (
    userId: string,
    page = 1
  ): Promise<PaginatedResponse<Message>> =>
    apiRequest(`/direct-messages/${userId}?page=${page}`),

  sendChannelMessage: (
    channelId: string,
    content: string
  ): Promise<ApiResponse<Message>> =>
    apiRequest(`/channels/${channelId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  sendDirectMessage: (
    recipientId: string,
    content: string
  ): Promise<ApiResponse<Message>> =>
    apiRequest("/direct-messages", {
      method: "POST",
      body: JSON.stringify({ recipientId, content }),
    }),
};

// Direct Messages API functions
export const directMessageApi = {
  getDirectMessageThreads: (): Promise<ApiResponse<DirectMessage[]>> =>
    apiRequest("/direct-messages"),
};
