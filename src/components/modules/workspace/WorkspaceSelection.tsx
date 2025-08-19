import { useState } from "react";
import { Building, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Workspace } from "@/types";
import { Loading } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CreateWorkspace } from "./CreateWorkspace";
import ServerErrorPage from "@/pages/ServerErrorPage";
import { useGetWorkspaces } from "@/hooks/api/useWorkspaces";

interface WorkspaceSelectionProps {
  onWorkspaceSelect: (workspace: Workspace) => void;
}

export function WorkspaceSelection({
  onWorkspaceSelect,
}: WorkspaceSelectionProps) {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: workspacesResponse,
    isLoading,
    error,
    refetch,
  } = useGetWorkspaces();

  const workspaces = workspacesResponse?.data || [];

  // Handle workspace selection with loading state
  const handleWorkspaceClick = async (workspace: Workspace) => {
    try {
      onWorkspaceSelect(workspace);
    } catch (error) {
      console.error("Failed to select workspace:", error);
      onWorkspaceSelect(workspace);
    }
  };

  // Handle successful workspace creation
  const handleWorkspaceCreated = () => {
    setShowCreateForm(false);
    refetch(); // Refresh the workspace list
  };

  // Determine member role badge variant for visual hierarchy
  const getRoleVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Render loading state with proper accessibility
  if (isLoading) {
    return <Loading aria-label="Loading workspaces" />;
  }

  // Render error state with retry option
  if (error) {
    return <ServerErrorPage />;
  }

  // Show create workspace form if user chooses to create
  if (showCreateForm) {
    return (
      <CreateWorkspace
        onWorkspaceCreated={handleWorkspaceCreated}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  // Empty state - no workspaces exist
  if (workspaces.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center">
        <div className="container mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: content */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground mb-8">
                <span>Confirmed as</span>
                <span className="font-medium text-foreground">
                  {user?.email}
                </span>
                <button className="underline decoration-dotted underline-offset-4 opacity-70 hover:opacity-100">
                  Change
                </button>
              </div>
              <h1 className="text-5xl font-bold tracking-tight leading-tight">
                Create a new Orbit workspace
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Orbit gives your team a home – a place where they can talk and
                work together. To create a new workspace, click on the button
                below.
              </p>
              <div className="mt-8">
                <Button
                  onClick={() => setShowCreateForm(true)}
                  size="lg"
                  className="h-12 px-6"
                >
                  Create a workspace
                </Button>
              </div>
              <div className="mt-6 flex items-start gap-3">
                <Checkbox id="marketing-opt-in" />
                <Label
                  htmlFor="marketing-opt-in"
                  className="text-sm text-muted-foreground"
                >
                  It’s okay to send me marketing communications about Orbit. I
                  can unsubscribe at any time.
                </Label>
              </div>
              <p className="mt-8 text-xs leading-5 text-muted-foreground">
                By continuing, you’re agreeing to our main services agreement,
                user terms of service and supplemental terms. Additional
                disclosures are available in our privacy policy and cookie
                policy.
              </p>
            </div>
            {/* Right: simple illustrative blocks */}
            <div className="hidden lg:block w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-[4/3] rounded-2xl bg-primary/10" />
                <div className="aspect-[4/3] rounded-2xl bg-emerald-100/60" />
                <div className="col-span-2 aspect-[16/9] rounded-2xl bg-violet-100/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main workspace selection interface
  return (
    <div className="min-h-screen bg-background">
      {/* Centered header */}
      <div className="container max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Building className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Choose a workspace to continue or create a new one
        </p>
      </div>

      {/* Workspace list */}
      <div className="container max-w-4xl mx-auto px-4 pb-12 space-y-4">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 cursor-pointer transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-ring"
            onClick={() => handleWorkspaceClick(workspace)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleWorkspaceClick(workspace);
              }
            }}
            aria-label={`Select ${workspace.name} workspace`}
          >
            <div className="flex items-center gap-4 min-w-0">
              {workspace.logoUrl ? (
                <Avatar className="h-14 w-14 rounded-xl overflow-hidden">
                  <img
                    src={workspace.logoUrl}
                    alt={`${workspace.name} logo`}
                    className="object-cover"
                  />
                </Avatar>
              ) : (
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold truncate">
                    {workspace.name}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {workspace._count.members} members
                </div>
              </div>
              <div className="flex items-center -space-x-2">
                {/* {memberAvatars.slice(0, 4).map((avatar, index) => (
              <Avatar key={index} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={avatar} alt={`Member ${index + 1}`} />
                <AvatarFallback className="text-xs">M{index + 1}</AvatarFallback>
              </Avatar>
            ))}
            {memberAvatars.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-medium">
                  +{memberAvatars.length - 4}
                </span>
              </div>
            )} */}
              </div>
            </div>
            <Badge variant={getRoleVariant(workspace.memberRole)}>
              {workspace.memberRole === "owner" && (
                <Crown className="w-3 h-3 mr-1" />
              )}
              {workspace.memberRole}
            </Badge>
          </div>
        ))}

        {/* Create workspace CTA below list */}
        <div className="flex justify-center pt-4">
          <Button onClick={() => setShowCreateForm(true)} variant="outline">
            <Building className="w-4 h-4 mr-2" />
            Create Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
