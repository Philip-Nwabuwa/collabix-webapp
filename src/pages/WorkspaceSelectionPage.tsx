import { useNavigate } from "react-router-dom";
import { WorkspaceSelection } from "@/components/modules/workspace/WorkspaceSelection";
import type { Workspace } from "@/types";

/**
 * WorkspaceSelectionPage - Page component for selecting/creating workspaces after login
 *
 * This page serves as the welcome screen after user authentication, allowing users to:
 * - View and select from their available workspaces
 * - Create new workspaces if none exist
 * - Navigate to the selected workspace's chat interface
 *
 * UX considerations:
 * - Clear visual hierarchy with workspace information
 * - Responsive grid layout for multiple workspaces
 * - Empty state guidance for new users
 * - Loading states and error handling
 * - Accessible navigation and selection
 */
export default function WorkspaceSelectionPage() {
  const navigate = useNavigate();

  // Handle workspace selection and navigation
  const handleWorkspaceSelect = (workspace: Workspace) => {
    // Store selected workspace in session/context for the app to use
    // Navigate to chat interface for the selected workspace
    navigate(`/w/${workspace.id}`, { state: { selectedWorkspace: workspace } });
  };

  return <WorkspaceSelection onWorkspaceSelect={handleWorkspaceSelect} />;
}
