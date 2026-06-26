import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PrototypeBanner from "./PrototypeBanner";
import Sidebar from "./Sidebar";

function MobileTopBar({ onMenuClick }) {
  return (
    <div className="lg:hidden flex items-center justify-between gap-3 bg-navy-800 text-white px-4 py-3 border-b border-navy-700">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-navy-700"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.18em] text-navy-200">
          ISRA · RMC
        </div>
        <div className="text-sm font-semibold leading-tight truncate">
          RMS <span className="text-brand-100">2.0</span>
        </div>
      </div>
    </div>
  );
}

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
      <MobileTopBar onMenuClick={() => setOpen(true)} />
      <div className="flex-1 flex min-h-0">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
