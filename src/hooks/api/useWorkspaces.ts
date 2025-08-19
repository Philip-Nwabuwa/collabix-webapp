import { workspaceApi } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetWorkspaceById() {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      workspaceApi.getWorkspaceById(workspaceId),
  });
}

export function useGetWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceApi.getWorkspaces,
  });
}
