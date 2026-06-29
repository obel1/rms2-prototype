import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PrototypeBanner from "./PrototypeBanner";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-full flex flex-col overflow-x-hidden">
      <PrototypeBanner />
      <div className="flex-1 flex min-h-0">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar onMenuClick={() => setOpen(true)} />
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-surface">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
