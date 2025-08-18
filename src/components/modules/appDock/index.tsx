import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BellOff,
  LogOut,
  Pause,
  Settings,
  User,
  UserRoundCheck,
} from "lucide-react";
import placeholderImage from "/dashboard-preview.png";
import DockItem from "./DockItem";

export default function AppDock() {
  const pathname = useLocation();
  const router = useNavigate();
  const activeWorkspaceId = (() => {
    // Match /w/<workspaceId>
    const match = pathname.pathname.match(/^\/w\/([^/]+)/);
    return match ? match[1] : undefined;
  })();

  // TODO: Replace with real workspaces from API/store
  const dockItems = [
    { id: "yrgGdg234j", label: "Workspace 1", imageSrc: placeholderImage },
  ];

  return (
    <aside aria-label="Application Dock" className="h-full w-16">
      <div className="h-screen flex flex-col items-start justify-between">
        <div className="flex flex-col items-center gap-2 my-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {dockItems.map((item) => {
            const isActive = activeWorkspaceId === item.id;
            return (
              <div key={item.id} className="flex items-center gap-2">
                {isActive ? (
                  <div className="h-8 w-[3px] rounded-br-full rounded-tr-full bg-black/90" />
                ) : (
                  <div className="h-8 w-[3px] rounded-br-full rounded-tr-full bg-transparent" />
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={`/w/${item.id}`}>
                      <DockItem
                        label={item.label}
                        imageSrc={item.imageSrc}
                        active={isActive}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </div>
            );
          })}

          <Tooltip>
            <TooltipTrigger asChild>
              <DockItem label="New" className="bg-gray-100 ml-2.5">
                <Plus className="h-6 w-6 text-black/80" />
              </DockItem>
            </TooltipTrigger>
            <TooltipContent side="right">New</TooltipContent>
          </Tooltip>
        </div>

        <div className="ml-2.5 my-4">
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Profile"
                    className="grid place-items-center rounded-full shadow-sm backdrop-blur transition-transform duration-200 ease-out hover:scale-[1.05] active:scale-95"
                  >
                    <Avatar className="size-10">
                      <AvatarImage src={placeholderImage} alt="User" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
            <PopoverContent side="right" align="start" className="w-64 p-0">
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={placeholderImage} alt="User" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      Ada Lovelace
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      ada@example.com
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="p-2 space-y-1">
                {/* Set a status sub-popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent">
                      <span className="flex items-center gap-2">
                        <UserRoundCheck className="size-4" /> Set a status
                      </span>
                      <span className="text-xs text-muted-foreground">⌘K</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    className="w-72 p-0"
                  >
                    <div className="p-2">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { emoji: "🍔", label: "Lunch" },
                          { emoji: "🏖️", label: "Vacation" },
                          { emoji: "🤒", label: "Out sick" },
                          { emoji: "💻", label: "Heads down" },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            className="flex items-center gap-2 rounded-md border px-2 py-2 text-sm hover:bg-accent"
                          >
                            <span className="text-base">{preset.emoji}</span>
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs text-muted-foreground mb-1">
                          Custom status
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="What’s your status?"
                            className="flex-1 rounded-md border px-2 py-2 text-sm bg-background"
                          />
                          <Button size="sm" className="px-3">
                            Set
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Do Not Disturb with durations */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent">
                      <span className="flex items-center gap-2">
                        <Pause className="size-4" /> Do not disturb
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    className="w-60 p-1"
                  >
                    <div className="flex flex-col">
                      {[
                        { label: "For 30 minutes", value: 30 },
                        { label: "For 1 hour", value: 60 },
                        { label: "Until tomorrow", value: 60 * 24 },
                        { label: "For a week", value: 60 * 24 * 7 },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          className="text-left rounded-md px-2 py-2 text-sm hover:bg-accent"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Notification preferences */}
                <button className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent">
                  <BellOff className="size-4" /> Notification preferences
                </button>

                {/* Profile and Settings link to routes */}
                <button
                  onClick={() => router("/settings/profile")}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                >
                  <User className="size-4" /> Profile
                </button>
                <button
                  onClick={() => router("/settings")}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                >
                  <Settings className="size-4" /> Settings
                </button>
              </div>
              <Separator />
              <div className="p-2">
                <Button variant="destructive" className="w-full justify-start">
                  <LogOut className="size-4" /> Sign out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </aside>
  );
}
