import { ChevronDown, Plus, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import DirectMessageItem from "./DirectMessageItem";
import { useDirectMessagesByWorkspace } from "@/hooks/api/useDirectMessages";
import { useLocation } from "react-router-dom";
import type { DirectMessage } from "@/types/chat";

export default function DirectMessagesList() {
  const workspaceId = useLocation().pathname.split("/")[2];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data, isLoading } = useDirectMessagesByWorkspace(workspaceId);

  // Updated to use DirectMessage type and pass otherUser to DirectMessageItem
  const directMessages = useMemo(() => {
    if (!Array.isArray(data?.data?.directMessages)) return [];
    return data.data.directMessages as DirectMessage[];
  }, [data?.data?.directMessages]);

  // Show loading state when data is being loaded
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <ChevronDown className="size-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">
              Direct Messages
            </h4>
            <Loader2 className="size-3 animate-spin text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 p-1">
              <div className="size-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state when no direct messages are available
  if (directMessages.length === 0 && !isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <ChevronDown className="size-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">
              Direct Messages
            </h4>
            <span className="text-xs text-gray-400">(0)</span>
          </div>
          <div className="flex items-center gap-1">
            <Plus className="size-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
        </div>
        <div className="text-xs text-gray-500 p-2 text-center">
          No direct messages yet
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between gap-2 mb-4",
          isCollapsed && "mb-0"
        )}
      >
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 -mx-1 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronDown
            className={cn(
              "size-4 text-gray-500 transition-transform duration-200",
              isCollapsed && "rotate-[-90deg]"
            )}
          />
          <h4 className="text-sm font-medium text-gray-700">Direct Messages</h4>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">
              ({directMessages.length})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Plus className="size-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>
      <div
        className={cn(
          "space-y-2 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        )}
      >
        {directMessages.map((dm) => (
          <DirectMessageItem key={dm.id} directMessage={dm} />
        ))}
      </div>
    </div>
  );
}
