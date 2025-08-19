import { BadgeCount } from "@/components/ui/count";
import { PencilLine } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ItemActions, { type ItemAction } from "@/components/ui/item-action";
import { formatDate } from "@/lib/formatDate";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { DirectMessage } from "@/types/chat";

export default function DirectMessageItem({
  directMessage,
}: {
  directMessage: DirectMessage;
}) {
  const router = useNavigate();
  const workspaceId = useLocation().pathname.split("/")[2];
  const [_activeDirectMessage, setActiveDirectMessage] = useState<string | null>(
    null
  );
  const isActive = false;
  const showDraft = false;

  const other = directMessage.otherUser;

  // Defensive: fallback to first participant for name display
  const displayName = other?.name || "Unknown";

  // Defensive: fallback to avatarUrl if available
  const avatarUrl = other?.avatarUrl || null;

  // Defensive: fallback to status if available
  const status = other?.status || "OFFLINE";

  const handleConversationClick = () => {
    if (!directMessage.id) return;
    setActiveDirectMessage(directMessage.id);
    router(`/w/${workspaceId}/d/${directMessage.id}`);
  };

  // TODO: Implement handleToggleFavorite, handleCloseConversation, and handleBlockUser

  const actions: ItemAction[] = [];

  const formatLastMessageTime = (time?: Date | string) => {
    if (!time) return "";

    const dateObj = typeof time === "string" ? new Date(time) : time;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return formatDate(dateObj);
  };

  return (
    <div
      className={`group flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors ${
        isActive ? "bg-blue-50" : ""
      }`}
      onClick={handleConversationClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={avatarUrl || undefined}
              alt={displayName || "User avatar"}
            />
            <AvatarFallback className="bg-gray-300 text-gray-600">
              {(displayName || "?")
                .split(" ")
                .filter(Boolean)
                .map((word) => word[0].toUpperCase())
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              status === "ONLINE" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs truncate ${
                isActive ? "font-medium text-blue-700" : "font-medium"
              }`}
            >
              {displayName}
            </h4>
            {directMessage.lastMessageAt && (
              <span className="text-xs text-gray-400 flex-shrink-0">
                {formatLastMessageTime(directMessage.lastMessageAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <BadgeCount count={directMessage.currentUser.unreadCount ?? 0} />
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
