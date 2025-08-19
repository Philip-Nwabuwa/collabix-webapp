import type {
  User,
  Channel,
  Message,
  ApiResponse,
  PaginatedResponse,
  LoginResponse,
  WorkspaceListResponse,
  Workspace,
  CreateWorkspaceData,
  DirectMessagesData,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Token refresh state management to handle concurrent requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

// Callback for token updates - to be set by AuthContext
let onTokenRefresh: ((token: string) => void) | null = null;

// Function to set the token refresh callback (called by AuthContext)
export function setTokenRefreshCallback(callback: (token: string) => void) {
  onTokenRefresh = callback;
}

function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      acc[decodeURIComponent(name)] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);

  const tokenValue = cookies["auth_token"];
  if (!tokenValue) return null;

  try {
    return JSON.parse(tokenValue);
  } catch {
    return tokenValue;
  }
}

// Update token in cookie with fresh expiration
function setAuthToken(token: string): void {
  if (typeof document === "undefined") return;
  
  const expires = new Date(Date.now() + 20 * 60 * 1000).toUTCString(); // 20 minutes for buffer
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `auth_token=${encodeURIComponent(JSON.stringify(token))}; path=/; samesite=lax${secure}; expires=${expires}`;
}

// Process failed queue after successful token refresh
function processFailedQueue(error: unknown, token?: string) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

// Refresh token function
async function refreshAccessToken(): Promise<string> {
  try {
    console.debug("Attempting token refresh...");
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Token refresh failed with status: ${response.status}`);
      throw new APIError(
        `Token refresh failed: ${response.status}`,
        null,
        response.status
      );
    }

    const data: ApiResponse<{ accessToken: string }> = await response.json();
    
    if (!data.success) {
      console.error("Token refresh response unsuccessful:", data.message);
      throw new APIError(data.message || "Token refresh failed", data, response.status);
    }

    const newToken = data.data.accessToken;
    console.debug("Token refresh successful, updating cookie...");
    setAuthToken(newToken);
    
    // Notify AuthContext about token update
    if (onTokenRefresh) {
      onTokenRefresh(newToken);
    }
    
    return newToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    // If refresh fails, redirect to login page
    if (typeof window !== "undefined") {
      console.debug("Redirecting to login due to refresh failure");
      // Use replace to prevent back button returning to protected content
      window.location.replace("/login");
    }
    throw error;
  }
}

class APIError extends Error {
  data: unknown;
  status: number;

  constructor(message: string, data: unknown, status: number) {
    super(message);
    this.name = "APIError";
    this.data = data;
    this.status = status;
  }
}

// Generic API request function with error handling and token refresh
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
  isRetry: boolean = false
): Promise<T> {
  const token = getAuthToken();
  
  // Add Authorization header if token exists
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle successful response
  if (response.ok) {
    return response.json();
  }

  // Handle error response
  try {
    const errorData = await response.json();
    
    // Check if this is a token expiry error and we haven't already retried
    if (!isRetry && 
        errorData.success === false && 
        errorData.message === "Access token expired") {
      
      // Handle concurrent refresh requests
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          // Retry the original request with the new token
          return apiRequest<T>(endpoint, {
            ...options,
            headers: {
              ...options?.headers,
              Authorization: `Bearer ${newToken}`,
            },
          }, true);
        });
      }

      // Start token refresh process
      isRefreshing = true;
      
      try {
        const newToken = await refreshAccessToken();
        processFailedQueue(null, newToken);
        isRefreshing = false;
        
        // Retry the original request with the new token
        return apiRequest<T>(endpoint, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Bearer ${newToken}`,
          },
        }, true);
      } catch (refreshError) {
        processFailedQueue(refreshError);
        isRefreshing = false;
        throw refreshError;
      }
    }

    // Throw the original error if it's not a token expiry or if refresh failed
    throw new APIError(
      errorData.message || `API Error: ${response.status}`,
      errorData,
      response.status
    );
  } catch (parseError) {
    if (parseError instanceof APIError) {
      throw parseError;
    }
    // If response body is not valid JSON, fall back to generic error
    throw new APIError(
      `API Error: ${response.status} ${response.statusText}`,
      null,
      response.status
    );
  }
}

// Login API functions
export const loginApi = {
  login: (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    }),
};

// User API functions
export const userApi = {
  getCurrentUser: (): Promise<ApiResponse<User>> => apiRequest("/users/me"),

  getUsers: (): Promise<ApiResponse<User[]>> => apiRequest("/users"),
};

// Channel API functions
export const channelApi = {
  getWorkspaceChannels: (
    workspaceId: string
  ): Promise<ApiResponse<Channel[]>> => {
    return apiRequest(`/workspaces/${workspaceId}/channels`, {
      credentials: "include",
    });
  },

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
  getDirectMessagesByWorkspace: (
    workspaceId: string
  ): Promise<ApiResponse<DirectMessagesData>> => {
    return apiRequest(`/workspaces/${workspaceId}/direct-messages`, {
      credentials: "include",
    });
  },
};

// Workspace API functions
export const workspaceApi = {
  getWorkspaces: (): Promise<WorkspaceListResponse> => {
    return apiRequest("/workspaces", {
      credentials: "include",
    });
  },

  getWorkspaceById: (workspaceId: string): Promise<ApiResponse<Workspace>> => {
    return apiRequest(`/workspaces/${workspaceId}`, {
      credentials: "include",
    });
  },

  createWorkspace: (
    data: CreateWorkspaceData
  ): Promise<ApiResponse<Workspace>> => {
    return apiRequest("/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });
  },

  selectWorkspace: (workspaceId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest(`/workspaces/${workspaceId}/select`, {
      method: "POST",
      credentials: "include",
    });
  },
};
