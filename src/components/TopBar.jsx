import { useEffect, useRef, useState } from "react";
import { useRole } from "../state/RoleContext";

export default function TopBar({ onMenuClick }) {
  const { roleId, setRoleId, role, persona, roles } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="flex items-center gap-3 bg-white border-b border-line px-3 sm:px-5 py-2">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-navy-700 hover:bg-surface"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Mobile brand (visible only when sidebar is hidden) */}
      <div className="lg:hidden min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-navy-500">
          ISRA · RMC
        </div>
        <div className="text-sm font-semibold leading-tight text-navy-900 truncate">
          RMS 2.0
        </div>
      </div>

      <div className="hidden lg:block flex-1" />

      {/* Role switcher */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-line hover:border-brand-500 text-sm bg-white"
        >
          <span className="text-[10px] uppercase tracking-wider text-navy-500 font-semibold">
            View as
          </span>
          <span className="text-navy-900 font-medium">{role.label}</span>
          <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-line rounded-lg shadow-lg z-30 overflow-hidden">
            <div className="px-3 py-2 border-b border-line bg-surface">
              <div className="text-[10px] uppercase tracking-wider text-brand-600 font-semibold">
                Prototype device
              </div>
              <div className="text-[11px] text-navy-500 mt-0.5 leading-snug">
                Switch the role to see how the app changes for that user. No
                separate login; identity is mocked.
              </div>
            </div>
            <ul className="py-1">
              {roles.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => {
                      setRoleId(r.id);
                      setOpen(false);
                    }}
                    className={[
                      "w-full text-left px-3 py-2",
                      r.id === roleId
                        ? "bg-brand-50 text-brand-700"
                        : "hover:bg-surface text-navy-900",
                    ].join(" ")}
                  >
                    <div className="text-sm font-medium">{r.label}</div>
                    <div className="text-[11px] text-navy-500 mt-0.5">
                      {r.persona.name}
                      {r.persona.title ? ` · ${r.persona.title}` : ""}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Identity (desktop) */}
      <div className="hidden lg:block text-right">
        <div className="text-xs font-medium text-navy-900 leading-tight">
          {persona.name}
        </div>
        <div className="text-[10px] text-navy-500 leading-tight">
          {persona.title}
        </div>
      </div>
    </div>
  );
}
