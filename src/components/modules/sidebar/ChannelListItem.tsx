import { Lock, PencilLine } from "lucide-react";
import { BadgeCount } from "@/components/ui/count";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ItemAction } from "@/components/ui/item-action";
import ItemActions from "@/components/ui/item-action";

interface Channel {
  id: string;
  name: string;
  type: "public" | "private" | "direct";
  members: string[];
  unreadCount: number;
  icon?: string;
  description?: string;
  isActive?: boolean;
  isFavorite?: boolean;
  parentId?: string;
  children?: Channel[];
}

interface ChannelListItemProps {
  channel: Channel;
  nestingLevel?: number;
}

export default function ChannelListItem({
  channel,
  nestingLevel = 0,
}: ChannelListItemProps) {
  const isActive = false;
  const showDraft = false;
  const [_activeChannel, setActiveChannel] = useState<string | null>(null);
  const router = useNavigate();
  const workspaceId = useLocation().pathname.split("/")[2];

  const getChannelIcon = () => {
    if (channel.icon) return channel.icon;
    return channel.type === "private" ? "🔒" : "#";
  };

  const handleChannelClick = () => {
    setActiveChannel(channel.id);
    router(`/w/${workspaceId}/c/${channel.id}`);
  };

  // TODO: Implement handleToggleFavorite, handleChannelSettings, and handleLeaveChannel

  const actions: ItemAction[] = [];

  const indentationPx = nestingLevel * 16; // 16px per level

  return (
    <div
      className={cn(
        "group flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors",
        isActive && "bg-blue-50"
      )}
      style={{ paddingLeft: `${4 + indentationPx}px` }}
      onClick={handleChannelClick}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-fit py-0.5 px-2.5 bg-white rounded-md shadow-sm">
          <span className="text-md">{getChannelIcon()}</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h4
            className={cn(
              "text-xs truncate",
              isActive && "font-medium text-blue-700"
            )}
          >
            {channel.name}
          </h4>
          {channel.description && (
            <p className="text-xs text-gray-500 truncate">
              {channel.description}
            </p>
          )}
        </div>
        {channel.type === "private" && (
          <Lock className="size-3 text-gray-400 flex-shrink-0 mr-2" />
        )}
      </div>
      <div className="flex items-center gap-1">
        <BadgeCount count={channel.unreadCount} />
        {showDraft && (
          <span className="px-1.5 py-0.5 text-[10px] rounded text-yellow-800">
            <PencilLine className="size-3" />
          </span>
        )}
        <ItemActions actions={actions} className="ml-1" />
      </div>
    </div>
  );
}
