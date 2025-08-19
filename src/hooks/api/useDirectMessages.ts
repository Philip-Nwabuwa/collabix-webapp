import { useQuery } from "@tanstack/react-query";
import { directMessageApi } from "@/lib/api";
import type { ApiResponse, DirectMessagesData } from "@/types";

// Hook for getting all direct message threads/conversations
export function useDirectMessagesByWorkspace(workspaceId: string) {
  return useQuery<ApiResponse<DirectMessagesData>>({
    queryKey: ["direct-messages", workspaceId],
    queryFn: () => directMessageApi.getDirectMessagesByWorkspace(workspaceId),
  });
}
