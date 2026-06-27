import { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submittedRequests } from "../data/projects";
import { Card, PageHeader, StatusPill } from "../components/ui";

const menus = {
  Registration: [
    { label: "Project Identification Form", to: "/submit/registration/pif" },
  ],
  Research: [
    { label: "RA Application", to: "/submit/research/ra-application" },
    { label: "Research Extension", to: "/submit/research/extension" },
    { label: "Research Completion", to: "/submit/research/completion" },
    { label: "Progress Report", to: "/submit/research/progress" },
  ],
  Financial: [
    { label: "Disbursement Request (DRF)", to: "/submit/financial/drf" },
    { label: "Travel Requisition (TRF)", to: "/submit/financial/trf" },
    { label: "Payment Claim", to: "/submit/financial/claim" },
    { label: "RA Claim (incl. timesheet)", to: "/submit/financial/ra-claim" },
    { label: "IERIF Claim", to: "/submit/financial/ierif" },
  ],
};

const moduleTones = {
  Registration: "bg-navy-50 text-navy-700 border-navy-200",
  Research: "bg-brand-50 text-brand-700 border-brand-100",
  Financial: "bg-yellow-50 text-warning border-yellow-200",
};

function ModuleDropdown({ label, items, openName, setOpenName }) {
  const ref = useRef(null);
  const open = openName === label;
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpenName(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, setOpenName]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenName(open ? null : label)}
        className={[
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition",
          open
            ? "bg-brand-600 text-white border-brand-600 shadow-sm"
            : "bg-white text-navy-900 border-line hover:border-brand-500 hover:text-brand-700",
        ].join(" ")}
      >
        {label}
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-72 bg-white border border-line rounded-lg shadow-lg z-20 overflow-hidden">
          <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-navy-500 border-b border-line bg-surface">
            {label} forms
          </div>
          <ul className="py-1">
            {items.map((it) => (
              <li key={it.to}>
                <button
                  onClick={() => {
                    setOpenName(null);
                    navigate(it.to);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-navy-900 hover:bg-brand-50 hover:text-brand-700"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function RequestHub() {
  const [openName, setOpenName] = useState("Research");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return submittedRequests.filter((r) => {
      const moduleMatch = filter === "All" || r.module === filter;
      const q = query.trim().toLowerCase();
      const queryMatch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.projectId.toLowerCase().includes(q) ||
        r.documentType.toLowerCase().includes(q);
      return moduleMatch && queryMatch;
    });
  }, [filter, query]);

  return (
    <div>
      <PageHeader
        title="Request Submission"
        subtitle="Start a new request from one of the three modules below, or track requests you've already submitted."
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        {/* Module launcher */}
        <Card className="px-5 py-5">
          <div className="text-xs uppercase tracking-wider text-navy-500 font-semibold mb-3">
            New Request
          </div>
          <div className="flex flex-wrap gap-3">
            <ModuleDropdown
              label="Registration"
              items={menus.Registration}
              openName={openName}
              setOpenName={setOpenName}
            />
            <ModuleDropdown
              label="Research"
              items={menus.Research}
              openName={openName}
              setOpenName={setOpenName}
            />
            <ModuleDropdown
              label="Financial"
              items={menus.Financial}
              openName={openName}
              setOpenName={setOpenName}
            />
          </div>
          <div className="mt-3 text-xs text-navy-500">
            Each request routes to the right approver automatically based on the
            current Position Registry.
          </div>
        </Card>

        {/* Requests table */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 px-5 pt-4 pb-3 border-b border-line">
            <div>
              <div className="text-sm font-semibold text-navy-900">
                Submitted Requests
              </div>
              <div className="text-xs text-navy-500 mt-0.5">
                {filtered.length} of {submittedRequests.length} requests
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ID, project, type…"
                className="text-sm px-3 py-1.5 rounded-md border border-line bg-white focus:outline-none focus:border-brand-500 w-full sm:w-56"
              />
              <div className="inline-flex rounded-md border border-line bg-white overflow-hidden text-xs self-start sm:self-auto">
                {["All", "Registration", "Research", "Financial"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilter(m)}
                    className={[
                      "px-3 py-1.5 border-l first:border-l-0 border-line whitespace-nowrap",
                      filter === m
                        ? "bg-brand-600 text-white border-brand-600"
                        : "text-navy-700 hover:bg-surface",
                    ].join(" ")}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                  <th className="text-left font-medium px-5 py-2.5">Request ID</th>
                  <th className="text-left font-medium px-5 py-2.5">Project ID</th>
                  <th className="text-left font-medium px-5 py-2.5">Document Type</th>
                  <th className="text-left font-medium px-5 py-2.5">Module</th>
                  <th className="text-left font-medium px-5 py-2.5">Submitted</th>
                  <th className="text-left font-medium px-5 py-2.5">Status</th>
                  <th className="text-right font-medium px-5 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface">
                    <td className="px-5 py-3 font-medium text-navy-900">
                      {r.id}
                    </td>
                    <td className="px-5 py-3 text-navy-700">
                      <Link
                        to={`/projects/${r.projectId}`}
                        className="hover:text-brand-700"
                      >
                        {r.projectId}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-navy-700">{r.documentType}</td>
                    <td className="px-5 py-3">
                      <span
                        className={[
                          "inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full border",
                          moduleTones[r.module],
                        ].join(" ")}
                      >
                        {r.module}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-navy-500">
                      {r.submittedDate}
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-navy-500"
                    >
                      No requests match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
