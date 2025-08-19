import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ChannelListItem from "./ChannelListItem";
import DirectMessageItem from "./DirectMessageItem";

type FavoriteItem = {
  type: "channel" | "directMessage";
  data: any;
  name: string;
  favoritedAt?: Date;
};

export default function FavoritesList() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [combinedFavorites, _setCombinedFavorites] = useState<FavoriteItem[]>(
    []
  );

  if (combinedFavorites.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ChevronDown className="size-4 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">Favorites</h4>
          <Loader2 className="size-3 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  // Don't render if no favorites
  if (combinedFavorites.length === 0) {
    return null;
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
          <h4 className="text-sm font-medium text-gray-700">Favorites</h4>
          <span className="text-xs text-gray-400">
            ({combinedFavorites.length})
          </span>
        </div>
      </div>
      <div
        className={cn(
          "space-y-2 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        )}
      >
        {combinedFavorites.map((item) =>
          item.type === "channel" ? (
            <ChannelListItem
              key={`channel-${item.data.id}`}
              channel={item.data}
              nestingLevel={0}
            />
          ) : (
            <DirectMessageItem
              key={`dm-${item.data.id}`}
              directMessage={item.data}
            />
          )
        )}
      </div>
    </div>
  );
}
