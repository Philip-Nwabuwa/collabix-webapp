import React from "react";
import { ChevronDown, Plus, Loader2 } from "lucide-react";
import ChannelListItem from "./ChannelListItem";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AddChannelModal from "./AddChannelModal";
import { useChannels } from "@/hooks/api/useChannels";
import { useLocation } from "react-router-dom";

export default function ChannelList() {
  const workspaceId = useLocation().pathname.split("/")[2];

  const { data: channels, isLoading } = useChannels(workspaceId);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);

  const nonFavoriteChannels = channels?.data.filter(
    (channel: any) => !channel.isFavorite
  );

  const renderChannelWithChildren = (
    channel: any,
    nestingLevel = 0
  ): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    // Render the parent channel
    elements.push(
      <ChannelListItem
        key={channel.id}
        channel={channel}
        nestingLevel={nestingLevel}
      />
    );

    // Always render children (no collapse functionality)
    if (channel.children && channel.children.length > 0) {
      channel.children.forEach((child: any) => {
        elements.push(...renderChannelWithChildren(child, nestingLevel + 1));
      });
    }

    return elements;
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <ChevronDown className="size-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Channels</h4>
            <Loader2 className="size-3 animate-spin text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 p-1">
              <div className="size-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state when no channels are available
  if (channels?.data?.length === 0 && !isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <ChevronDown className="size-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Channels</h4>
            <span className="text-xs text-gray-400">(0)</span>
          </div>
          <div className="flex items-center gap-1">
            <Plus
              className="size-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              onClick={() => setIsAddChannelModalOpen(true)}
            />
          </div>
        </div>
        <div className="text-xs text-gray-500 p-2 text-center">
          No channels available
        </div>
        <AddChannelModal
          open={isAddChannelModalOpen}
          onOpenChange={setIsAddChannelModalOpen}
        />
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
          />{" "}
          <h4 className="text-sm font-medium text-gray-700">Channels</h4>
          <span className="text-xs text-gray-400">
            ({nonFavoriteChannels?.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Plus
            className="size-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            onClick={() => setIsAddChannelModalOpen(true)}
          />
        </div>
      </div>
      <div
        className={cn(
          "space-y-2 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        )}
      >
        {nonFavoriteChannels?.flatMap((channel) =>
          renderChannelWithChildren(channel, 0)
        )}
      </div>

      <AddChannelModal
        open={isAddChannelModalOpen}
        onOpenChange={setIsAddChannelModalOpen}
      />
    </div>
  );
}
