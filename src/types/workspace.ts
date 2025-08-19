// Workspace type definitions and API response interfaces

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: WorkspaceOwner;
  _count: WorkspaceCount;
  memberRole: string;
}

export interface WorkspaceOwner {
  id: string;
  name: string;
  email: string;
}

export interface WorkspaceCount {
  members: number;
  channels: number;
}

export interface WorkspaceListResponse {
  success: boolean;
  message: string;
  data: Workspace[];
}

// Create workspace form data
export interface CreateWorkspaceData {
  name: string;
  description?: string;
  slug?: string;
}

// Workspace selection context
export interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace) => void;
  clearSelectedWorkspace: () => void;
}