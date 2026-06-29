import { useAudit } from "../state/AuditContext";
import { Card, CardHeader } from "./ui";

const actionStyles = {
  submitted: "bg-brand-50 text-brand-700 border-brand-100",
  approved: "bg-green-50 text-success border-green-200",
  reject: "bg-red-50 text-danger border-red-200",
  approve: "bg-green-50 text-success border-green-200",
  "completeness-check": "bg-navy-50 text-navy-700 border-navy-200",
  "override-reassign": "bg-yellow-50 text-warning border-yellow-200",
  "override-force-advance": "bg-yellow-50 text-warning border-yellow-200",
  "finance-handoff": "bg-navy-50 text-navy-700 border-navy-200",
};

function fmtTs(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-MY", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AuditLog({ requestKey, title = "Activity / audit log" }) {
  const { get } = useAudit();
  const entries = get(requestKey);

  return (
    <Card>
      <CardHeader
        title={title}
        subtitle="Every approval, override and Finance hand-off action against this request — actor, timestamp, and reason."
      />
      <div className="px-5 pt-3 pb-1 text-[11px] text-navy-500 leading-snug">
        Request key:{" "}
        <span className="font-mono text-navy-700">{requestKey}</span>
      </div>
      {entries.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-navy-500">
          No activity yet. Actions taken here — including any admin overrides —
          will appear in this log.
        </div>
      ) : (
        <ol className="divide-y divide-line">
          {entries.map((e) => {
            const cls =
              actionStyles[e.action] ||
              "bg-navy-50 text-navy-700 border-navy-200";
            const isOverride = e.action.startsWith("override-");
            return (
              <li key={e.id} className="px-5 py-3.5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={[
                          "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                          cls,
                        ].join(" ")}
                      >
                        {e.action.replace(/-/g, " ")}
                      </span>
                      <span className="text-sm font-medium text-navy-900">
                        {e.actor.name}
                      </span>
                      <span className="text-xs text-navy-500">
                        {e.actor.role}
                      </span>
                    </div>
                    <div className="text-sm text-navy-700 mt-1 leading-snug">
                      {e.details}
                    </div>
                    {isOverride && e.meta && (
                      <div className="mt-2 text-[11px] text-navy-700 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 border border-yellow-200 bg-yellow-50 rounded-md px-3 py-2">
                        <div>
                          <span className="font-semibold">Previous:</span>{" "}
                          {e.meta.previous}
                        </div>
                        <div>
                          <span className="font-semibold">Action:</span>{" "}
                          {e.meta.kind === "reassign"
                            ? `Reassign → ${e.meta.newHolder}`
                            : "Force-advance"}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-semibold">Reason:</span>{" "}
                          {e.meta.reason}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-navy-500 shrink-0">
                    {fmtTs(e.timestamp)}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
