import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects, submittedRequests } from "../data/projects";
import { resolvePosition } from "../data/positions";
import { Card, CardHeader, PageHeader, StatusPill } from "../components/ui";
import { useRole } from "../state/RoleContext";
import { useAudit } from "../state/AuditContext";

export default function Approvals() {
  const { persona, role, can } = useRole();
  const { append } = useAudit();

  const [actioned, setActioned] = useState({});

  // What "waiting on me" means depends on the role:
  // - CoE Director / Director RMC: requests whose `awaiting.positionId` matches
  //   the persona's positionId.
  // - RMC Executive / Director RMC (admin) also see everything in review for
  //   oversight.
  const queue = useMemo(() => {
    const inReview = submittedRequests.filter((r) => r.status === "In Review");
    if (can.isAdmin) return inReview;
    return inReview.filter(
      (r) => r.awaiting && r.awaiting.positionId === persona.positionId
    );
  }, [persona, can.isAdmin]);

  function action(reqId, kind, requestKey) {
    setActioned((prev) => ({ ...prev, [reqId]: kind }));
    append({
      requestKey,
      actor: { name: persona.name, role: role.label },
      action: kind,
      details: `${kind === "approve" ? "Approved" : "Rejected"} via Approvals Inbox.`,
    });
  }

  return (
    <div>
      <PageHeader
        title="Approvals Inbox"
        subtitle={
          can.isAdmin
            ? `Oversight view — all requests in review across the portfolio.`
            : `Requests waiting on your position (${persona.title}).`
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        <Card>
          <CardHeader
            title="Awaiting action"
            subtitle={`${queue.length} request${queue.length === 1 ? "" : "s"} awaiting ${can.isAdmin ? "review" : "your decision"}.`}
          />
          {queue.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-navy-500">
              You're all caught up — nothing currently waiting on{" "}
              {persona.title}.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {queue.map((r) => {
                const project = projects.find((p) => p.id === r.projectId);
                const requestKey = `${r.documentType.replace(/\s+/g, "")}/${r.projectId}/${r.id}`;
                const awaitingPos = r.awaiting
                  ? resolvePosition(r.awaiting.positionId)
                  : null;
                const done = actioned[r.id];
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
                          <StatusPill status={r.status} />
                        </div>
                        <div className="text-xs text-navy-500 mt-1">
                          <Link
                            to={`/projects/${r.projectId}`}
                            className="text-brand-600 hover:text-brand-700"
                          >
                            {r.projectId}
                          </Link>{" "}
                          · {project?.title} · Submitted {r.submittedDate}
                        </div>
                        {awaitingPos && (
                          <div className="text-[11px] text-navy-500 mt-1">
                            Currently awaiting:{" "}
                            <span className="font-medium text-navy-900">
                              {awaitingPos.title}
                            </span>{" "}
                            · {awaitingPos.holder}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {done ? (
                          <span
                            className={[
                              "text-[11px] font-medium px-2 py-1 rounded-full border",
                              done === "approve"
                                ? "bg-green-50 text-success border-green-200"
                                : "bg-red-50 text-danger border-red-200",
                            ].join(" ")}
                          >
                            {done === "approve" ? "✓ Approved" : "✕ Rejected"}
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                action(r.id, "reject", requestKey)
                              }
                              className="text-xs px-3 py-1.5 rounded-md border border-line bg-white hover:bg-surface text-navy-700"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() =>
                                action(r.id, "approve", requestKey)
                              }
                              className="text-xs px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                            >
                              Approve
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="text-xs text-navy-500 leading-relaxed">
          This inbox resolves "waiting on me" by matching each request's current
          step against your <strong>position_id</strong> via the Position
          Registry. Approvals you take here are logged to the audit trail and
          would, in production, advance the request to the next step.
        </div>
      </div>
    </div>
  );
}
