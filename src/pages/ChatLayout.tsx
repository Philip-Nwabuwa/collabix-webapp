import AppDock from "@/components/modules/appDock";
import Sidebar from "@/components/modules/sidebar";
import { Outlet } from "react-router-dom";

export default function ChatLayout() {
  return (
    <div className="h-screen flex font-sans antialiased bg-background text-foreground">
      <AppDock />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
