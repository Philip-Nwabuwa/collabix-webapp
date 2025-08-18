import AppDock from "@/components/modules/appDock";
import { Outlet } from "react-router-dom";

export default function ChatLayout() {
  return (
    <div className="h-screen flex font-sans antialiased bg-background text-foreground">
      <AppDock />

      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
