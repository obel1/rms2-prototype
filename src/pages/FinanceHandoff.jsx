import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects, submittedRequests } from "../data/projects";
import { Card, CardHeader, PageHeader } from "../components/ui";
import { useRole } from "../state/RoleContext";
import { useAudit } from "../state/AuditContext";

export default function FinanceHandoff() {
  const { persona, role } = useRole();
  const { append } = useAudit();

  const [delivered, setDelivered] = useState({});

  const queue = useMemo(
    () =>
      submittedRequests.filter(
        (r) =>
          r.status === "Approved" &&
          r.module === "Financial" &&
          r.handoffStatus
      ),
    []
  );

  function markDelivered(req, method) {
    setDelivered((prev) => ({
      ...prev,
      [req.id]: { method, at: new Date().toISOString().slice(0, 16) },
    }));
    append({
      requestKey: `${req.documentType.replace(/\s+/g, "")}/${req.projectId}/${req.id}`,
      actor: { name: persona.name, role: role.label },
      action: "finance-handoff",
      details: `Marked as delivered to Finance via ${method}.`,
    });
  }

  const pending = queue.filter((r) => !delivered[r.id] && r.handoffStatus !== "delivered");
  const done = queue.filter((r) => delivered[r.id] || r.handoffStatus === "delivered");

  return (
    <div>
      <PageHeader
        title="Finance Hand-off"
        subtitle="Approved forms ready for delivery to Finance. Delivery method is undecided; the queue lets you track what has gone out."
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        <div className="rounded-lg border border-dashed border-navy-200 bg-surface px-4 py-3 text-xs text-navy-700 leading-snug">
          <span className="font-semibold text-navy-900">
            Reminder — Finance delivery method is not yet finalised.
          </span>{" "}
          This queue is a prototype placeholder showing approved forms ready to
          hand off. In production it would route via the chosen mechanism
          (email, manual download, or a direct integration).
        </div>

        <Card>
          <CardHeader
            title="Pending hand-off"
            subtitle={`${pending.length} approved form${pending.length === 1 ? "" : "s"} awaiting delivery.`}
          />
          {pending.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-navy-500">
              Queue empty.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {pending.map((r) => {
                const project = projects.find((p) => p.id === r.projectId);
                return (
                  <li key={r.id} className="px-5 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-navy-500">
                            {r.id}
                          </span>
                          <span className="text-sm font-semibold text-navy-900">
                            {r.documentType}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-green-50 text-success border-green-200">
                            Approved
                          </span>
                        </div>
                        <div className="text-xs text-navy-500 mt-1">
                          <Link
                            to={`/projects/${r.projectId}`}
                            className="text-brand-600 hover:text-brand-700"
                          >
                            {r.projectId}
                          </Link>{" "}
                          · {project?.title}
                        </div>
                        <div className="text-[11px] text-navy-500 mt-1">
                          Approved {r.approvedDate}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button className="text-xs px-3 py-1.5 rounded-md border border-line bg-white hover:bg-surface text-navy-700">
                          Download form
                        </button>
                        <button
                          onClick={() => markDelivered(r, "email")}
                          className="text-xs px-3 py-1.5 rounded-md border border-line bg-white hover:bg-surface text-navy-700"
                        >
                          Mark delivered (email)
                        </button>
                        <button
                          onClick={() => markDelivered(r, "manual")}
                          className="text-xs px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                        >
                          Mark delivered (manual)
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Delivered"
            subtitle={`${done.length} form${done.length === 1 ? "" : "s"} marked as handed off.`}
          />
          {done.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-navy-500">
              Nothing yet.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {done.map((r) => {
                const d = delivered[r.id];
                const project = projects.find((p) => p.id === r.projectId);
                return (
                  <li key={r.id} className="px-5 py-3 text-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-navy-900 font-medium">
                          {r.id} · {r.documentType}
                        </div>
                        <div className="text-xs text-navy-500 mt-0.5">
                          {r.projectId} · {project?.title}
                        </div>
                      </div>
                      <div className="text-[11px] text-navy-500 shrink-0">
                        Delivered{" "}
                        {d?.at ? `${d.at} via ${d.method}` : r.deliveredDate}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
