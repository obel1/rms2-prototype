import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const sectionItems = {
  Registration: [
    { label: "Project Identification Form", to: "/submit/registration/pif" },
    { label: "New Project Registration", to: "/submit/registration/new" },
  ],
  Research: [
    { label: "RA Application", to: "/submit/research/ra-application" },
    { label: "Research Extension", to: "/submit/research/extension" },
    { label: "Progress Report", to: "/submit/research/progress" },
    { label: "Research Completion", to: "/submit/research/completion" },
  ],
  Financial: [
    { label: "Disbursement Request", to: "/submit/financial/drf" },
    { label: "Travel Requisition (TRF)", to: "/submit/financial/trf" },
    { label: "Payment Claim", to: "/submit/financial/claim" },
    { label: "RA Claim", to: "/submit/financial/ra-claim" },
    { label: "RA Timesheet", to: "/submit/financial/timesheet" },
    { label: "IERIF Claim", to: "/submit/financial/ierif" },
  ],
};

function NavItem({ to, children, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
          isActive
            ? "bg-brand-600 text-white"
            : "text-navy-100 hover:bg-navy-700",
        ].join(" ")
      }
      end
    >
      <span className="w-4 h-4 inline-flex items-center justify-center opacity-80">
        {icon}
      </span>
      <span>{children}</span>
    </NavLink>
  );
}

function Disclosure({ title, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs uppercase tracking-wider text-navy-200 hover:text-white"
      >
        <span>{title}</span>
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
          ›
        </span>
      </button>
      {open && (
        <div className="mt-1 space-y-1 pl-2">
          {items.map((it) => (
            <button
              key={it.to}
              onClick={() => navigate(it.to)}
              className="w-full text-left px-3 py-1.5 text-sm rounded-md text-navy-100 hover:bg-navy-700"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-navy-800 text-white flex flex-col h-full">
      <div className="px-5 py-5 border-b border-navy-700">
        <div className="text-[10px] uppercase tracking-[0.18em] text-navy-200">
          ISRA Institute · RMC
        </div>
        <div className="mt-1 text-lg font-semibold leading-tight">
          RMS <span className="text-brand-100">2.0</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavItem to="/" icon="●">
          Dashboard
        </NavItem>
        <NavItem to="/requests" icon="◉">
          Request Submission
        </NavItem>
        <NavItem to="/projects" icon="◧">
          Projects
        </NavItem>

        <div className="pt-4">
          <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-navy-200">
            Submit a request
          </div>
          <div className="space-y-1">
            <Disclosure title="Registration" items={sectionItems.Registration} />
            <Disclosure
              title="Research"
              items={sectionItems.Research}
              defaultOpen
            />
            <Disclosure title="Financial" items={sectionItems.Financial} />
          </div>
        </div>

        <div className="pt-4">
          <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-navy-200">
            Administration
          </div>
          <NavItem to="/admin/positions" icon="⚙">
            Position Registry
          </NavItem>
        </div>
      </nav>

      <div className="px-5 py-4 border-t border-navy-700 text-xs text-navy-200">
        Signed in as
        <div className="text-white text-sm font-medium">Iman Ruzain</div>
        <div className="text-[11px]">RMC Executive</div>
      </div>
    </aside>
  );
}
