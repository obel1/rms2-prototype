import { Outlet } from "react-router-dom";
import PrototypeBanner from "./PrototypeBanner";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="h-full flex flex-col">
      <PrototypeBanner />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
