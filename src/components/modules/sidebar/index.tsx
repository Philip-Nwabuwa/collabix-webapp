import {
  Sparkles,
  Mail,
  MessageSquareMore,
  ClipboardList,
  Bookmark,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCount } from "@/components/ui/count";
import type { SidebarItem } from "./SidebarItemComponent";
import Logo from "./Logo";
import ChannelSearch from "./ChannelSearch";
import SidebarItemComponent from "./SidebarItemComponent";
import DirectMessagesList from "./DirectMessagesList";
import ChannelList from "./ChannelList";

const sidebarItems: SidebarItem[] = [
  { icon: Sparkles, label: "Assistant" },
  { icon: ClipboardList, label: "Drafts & Scheduled" },
  { icon: Bookmark, label: "Saved Items" },
  { icon: Mail, label: "Inbox", unreadCount: 100 },
  { icon: MessageSquareMore, label: "Direct Messages", unreadCount: 5 },
];

export default function Sidebar() {
  const pathname = useLocation();
  const workspaceId = pathname.pathname.split("/")[2];
  const draftsCount = 0;
  const savedCount = 0;

  return (
    <div className="bg-gray-100 flex h-full w-64 flex-col px-3 py-4">
      <div className="flex items-center justify-between gap-2 p-1 mb-3">
        <Logo />
        <ChannelSearch />
      </div>

      <div className="flex flex-col gap-1">
        {sidebarItems.map((item, index) => {
          if (item.label === "Saved Items") {
            if (savedCount <= 0) return null;
            return (
              <Link
                key={index}
                to={`/w/${workspaceId}/saved`}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors"
              >
                <item.icon className="size-4 text-gray-600" />
                <p className="text-xs font-semibold text-gray-700">
                  Saved Items
                </p>
                <div className="ml-auto">
                  <BadgeCount count={savedCount} />
                </div>
              </Link>
            );
          }
          if (item.label === "Drafts & Scheduled") {
            if (draftsCount <= 0) return null;
            return (
              <SidebarItemComponent
                key={index}
                item={{
                  icon: ClipboardList,
                  label: "Drafts & Scheduled",
                  unreadCount: draftsCount,
                }}
              />
            );
          }
          return <SidebarItemComponent key={index} item={item} />;
        })}
        <Link
          to={`/w/${workspaceId}/tasks`}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors"
        >
          <ClipboardList className="size-4 text-gray-600" />
          <p className="text-xs font-semibold text-gray-700">Tasks</p>
        </Link>
      </div>

      <div className="flex flex-col gap-6 mt-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* <FavoritesList /> */}
        <ChannelList />
        <DirectMessagesList />
      </div>
    </div>
  );
}
