import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRole } from "../state/RoleContext";

const sectionItems = {
  Registration: [
    { label: "Project Identification Form", to: "/submit/registration/pif" },
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
    { label: "RA Claim (incl. timesheet)", to: "/submit/financial/ra-claim" },
    { label: "IERIF Claim", to: "/submit/financial/ierif" },
  ],
};

function NavItem({ to, children, icon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
          isActive ? "bg-brand-600 text-white" : "text-navy-100 hover:bg-navy-700",
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

function Disclosure({ title, items, defaultOpen = false, onNavigate }) {
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
              onClick={() => {
                navigate(it.to);
                onNavigate?.();
              }}
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

export default function Sidebar({ open = false, onClose }) {
  const { can, persona, role } = useRole();
  const s = can.sidebar;

  const showSubmit = s.submit;
  const showAnyAdmin = s.positionRegistry;
  const showAnyOversight =
    s.requests || s.approvals || s.financeHandoff || s.controlSheet;

  return (
    <>
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 bg-navy-900/50 z-30 lg:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      />

      <aside
        className={[
          "w-64 shrink-0 bg-navy-800 text-white flex flex-col",
          "fixed inset-y-0 left-0 z-40 transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:z-auto lg:h-full",
        ].join(" ")}
      >
        <div className="px-5 py-5 border-b border-navy-700 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-navy-200">
              ISRA Institute · RMC
            </div>
            <div className="mt-1 text-lg font-semibold leading-tight">
              RMS <span className="text-brand-100">2.0</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-navy-200 hover:text-white text-2xl leading-none px-2"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {s.dashboard && (
            <NavItem to="/" icon="●" onNavigate={onClose}>
              Dashboard
            </NavItem>
          )}

          {showAnyOversight && (
            <div className="pt-2">
              <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-navy-200">
                Workflow
              </div>
              {s.requests && (
                <NavItem to="/requests" icon="◉" onNavigate={onClose}>
                  Request Submission
                </NavItem>
              )}
              {s.approvals && (
                <NavItem to="/approvals" icon="✓" onNavigate={onClose}>
                  Approvals Inbox
                </NavItem>
              )}
              {s.financeHandoff && (
                <NavItem to="/finance/handoff" icon="₪" onNavigate={onClose}>
                  Finance Hand-off
                </NavItem>
              )}
              {s.controlSheet && (
                <NavItem to="/finance/control-sheet" icon="≣" onNavigate={onClose}>
                  Control Sheet
                </NavItem>
              )}
            </div>
          )}

          {(s.projects || s.myProjects) && (
            <div className="pt-2">
              <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-navy-200">
                Projects
              </div>
              <NavItem to="/projects" icon="◧" onNavigate={onClose}>
                {s.myProjects ? "My Projects" : "Projects"}
              </NavItem>
              {s.myLetters && (
                <NavItem to="/my-letters" icon="✉" onNavigate={onClose}>
                  My Letters
                </NavItem>
              )}
            </div>
          )}

          {showSubmit && (
            <div className="pt-4">
              <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-navy-200">
                Submit a request
              </div>
              <div className="space-y-1">
                <Disclosure
                  title="Registration"
                  items={sectionItems.Registration}
                  onNavigate={onClose}
                />
                <Disclosure
                  title="Research"
                  items={sectionItems.Research}
                  defaultOpen
                  onNavigate={onClose}
                />
                <Disclosure
                  title="Financial"
                  items={sectionItems.Financial}
                  onNavigate={onClose}
                />
              </div>
            </div>
          )}

          {showAnyAdmin && (
            <div className="pt-4">
              <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-navy-200">
                Administration
              </div>
              <NavItem to="/admin/positions" icon="⚙" onNavigate={onClose}>
                Position Registry
              </NavItem>
            </div>
          )}
        </nav>

        <div className="px-5 py-4 border-t border-navy-700 text-xs text-navy-200">
          <div className="text-[10px] uppercase tracking-wider text-navy-300">
            Viewing as
          </div>
          <div className="text-white text-sm font-medium mt-0.5">
            {persona.name}
          </div>
          <div className="text-[11px]">{persona.title}</div>
          <div className="text-[10px] text-navy-300 mt-1">
            Role: {role.label}
          </div>
        </div>
      </aside>
    </>
  );
}
