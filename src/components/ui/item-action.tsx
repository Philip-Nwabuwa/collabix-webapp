import {
  MoreVertical,
  Star,
  StarOff,
  Settings,
  Trash2,
  UserMinus,
  MessageSquareOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ItemAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive";
  shortcut?: string;
}

interface ItemActionsProps {
  actions: ItemAction[];
  className?: string;
  size?: "sm" | "md";
  side?: "top" | "right" | "bottom" | "left";
}

export default function ItemActions({
  actions,
  className,
  size = "sm",
  side = "right",
}: ItemActionsProps) {
  const buttonSize = size === "sm" ? "size-4" : "size-5";
  const iconSize = size === "sm" ? "size-3" : "size-4";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            // Base styles
            "hover:bg-gray-200 rounded transition-all duration-200 flex items-center justify-center",
            "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            // Small and medium screens: always visible for better mobile/tablet experience
            "opacity-100 sm:opacity-100 md:opacity-100",
            // Large screens and up: hidden by default, show on group hover
            "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:group-hover:w-4 lg:group-hover:opacity-100",
            buttonSize,
            className
          )}
          onClick={(e) => e.stopPropagation()}
          // Add touch event handlers for better mobile experience
          onTouchStart={(e) => e.stopPropagation()}
        >
          <MoreVertical className={cn("text-gray-500", iconSize)} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align="start"
        className="w-48"
        onCloseAutoFocus={(e: any) => e.preventDefault()}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isDestructive = action.variant === "destructive";

          return (
            <div key={index}>
              <DropdownMenuItem
                onClick={(e: any) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                variant={action.variant}
                className="cursor-pointer"
              >
                <Icon className="size-4" />
                <span>{action.label}</span>
                {action.shortcut && (
                  <span className="ml-auto text-xs text-gray-400">
                    {action.shortcut}
                  </span>
                )}
              </DropdownMenuItem>
              {/* Add separator before destructive actions */}
              {isDestructive && index < actions.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Preset action creators for common use cases
export const createFavoriteAction = (
  isFavorite: boolean,
  onToggle: () => void
): ItemAction => ({
  label: isFavorite ? "Remove from favorites" : "Add to favorites",
  icon: isFavorite ? StarOff : Star,
  onClick: onToggle,
  shortcut: "⌘F",
});

export const createChannelActions = (
  isFavorite: boolean,
  onToggleFavorite: () => void,
  onSettings?: () => void,
  onLeave?: () => void
): ItemAction[] => [
  createFavoriteAction(isFavorite, onToggleFavorite),
  ...(onSettings
    ? [
        {
          label: "Channel settings",
          icon: Settings,
          onClick: onSettings,
        },
      ]
    : []),
  ...(onLeave
    ? [
        {
          label: "Leave channel",
          icon: Trash2,
          onClick: onLeave,
          variant: "destructive" as const,
        },
      ]
    : []),
];

export const createDirectMessageActions = (
  isFavorite: boolean,
  onToggleFavorite: () => void,
  onClose?: () => void,
  onBlock?: () => void
): ItemAction[] => [
  createFavoriteAction(isFavorite, onToggleFavorite),
  ...(onClose
    ? [
        {
          label: "Close conversation",
          icon: MessageSquareOff,
          onClick: onClose,
        },
      ]
    : []),
  ...(onBlock
    ? [
        {
          label: "Block user",
          icon: UserMinus,
          onClick: onBlock,
          variant: "destructive" as const,
        },
      ]
    : []),
];
