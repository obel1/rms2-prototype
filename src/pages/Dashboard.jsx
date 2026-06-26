import { Link } from "react-router-dom";
import {
  projects,
  outstandingAdvances,
  totals,
  fmtRM,
} from "../data/projects";
import { Card, CardHeader, PageHeader, StatusPill, ProgressBar } from "../components/ui";

function StatCard({ label, value, sub, tone }) {
  return (
    <Card className="px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-navy-500">{label}</div>
      <div
        className={[
          "mt-2 text-2xl font-semibold tracking-tight",
          tone === "brand" ? "text-brand-700" : "text-navy-900",
        ].join(" ")}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-navy-500 mt-1">{sub}</div>}
    </Card>
  );
}

export default function Dashboard() {
  const t = totals();
  const active = projects.filter((p) => p.status !== "completed").length;
  const overdue = outstandingAdvances.filter((a) => a.daysOverdue > 0).length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of research projects, allocations, and pending actions."
        actions={
          <button className="text-sm px-3 py-2 rounded-md border border-line bg-white hover:bg-surface-2 text-navy-700">
            Export
          </button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        {/* Stat row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Projects"
            value={active}
            sub={`${projects.length} total · ${projects.length - active} completed`}
          />
          <StatCard
            label="Total Allocation"
            value={fmtRM(t.allocation)}
            sub="Across all active categories"
            tone="brand"
          />
          <StatCard
            label="Disbursed"
            value={fmtRM(t.disbursed)}
            sub={`Balance ${fmtRM(t.balance)}`}
          />
          <StatCard
            label="Outstanding Advances"
            value={outstandingAdvances.length}
            sub={`${overdue} overdue`}
            tone={overdue ? "danger" : "default"}
          />
        </div>

        {/* Utilisation */}
        <Card>
          <CardHeader
            title="Portfolio Utilisation"
            subtitle="Disbursed ÷ Allocation across all active projects"
          />
          <div className="px-5 py-5">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-3xl font-semibold text-navy-900">
                  {t.utilisation}%
                </div>
                <div className="text-xs text-navy-500 mt-0.5">
                  {fmtRM(t.disbursed)} of {fmtRM(t.allocation)}
                </div>
              </div>
              <div className="text-xs text-navy-500">
                Balance{" "}
                <span className="font-medium text-navy-900">
                  {fmtRM(t.balance)}
                </span>
              </div>
            </div>
            <ProgressBar
              value={t.utilisation}
              tone={
                t.utilisation > 90
                  ? "danger"
                  : t.utilisation > 75
                    ? "warning"
                    : "brand"
              }
            />
          </div>
        </Card>

        {/* Two-column lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects list */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Projects"
              subtitle="Traffic-light status across the active portfolio"
              action={
                <Link
                  to="/projects"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  View all →
                </Link>
              }
            />
            <ul className="divide-y divide-line">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/projects/${p.id}`}
                    className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:gap-3 sm:items-center px-5 py-3.5 hover:bg-surface text-sm"
                  >
                    <div className="sm:col-span-5 min-w-0">
                      <div className="font-medium text-navy-900 sm:truncate">
                        {p.title}
                      </div>
                      <div className="text-xs text-navy-500 mt-0.5">
                        {p.id} · {p.coe} · {p.pi}
                      </div>
                    </div>
                    <div className="sm:col-span-3 text-xs text-navy-500 min-w-0">
                      <div>
                        {fmtRM(p.disbursed)}{" "}
                        <span className="text-navy-200">/</span>{" "}
                        {fmtRM(p.allocation)}
                      </div>
                      <div className="mt-1 max-w-[180px]">
                        <ProgressBar
                          value={p.utilisation}
                          tone={
                            p.utilisation >= 100
                              ? "danger"
                              : p.utilisation > 80
                                ? "warning"
                                : "brand"
                          }
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 text-xs text-navy-500">
                      Ends{" "}
                      <span className="text-navy-900 font-medium">
                        {p.endDate}
                      </span>
                    </div>
                    <div className="sm:col-span-2 sm:flex sm:justify-end">
                      <StatusPill status={p.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Outstanding advances */}
          <Card>
            <CardHeader
              title="Outstanding Advances"
              subtitle="Disbursed advances not yet acquitted"
            />
            <ul className="divide-y divide-line">
              {outstandingAdvances.map((a) => (
                <li key={a.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-navy-900">
                        {fmtRM(a.amount)}
                      </div>
                      <div className="text-xs text-navy-500 mt-0.5">
                        {a.pi} · {a.projectId}
                      </div>
                    </div>
                    {a.daysOverdue > 0 ? (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-red-50 text-danger border-red-200">
                        {a.daysOverdue}d overdue
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-green-50 text-success border-green-200">
                        Within term
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-navy-500">
                    Issued {a.issuedDate} · due {a.dueDate}
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Link
                to="/requests"
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Manage advances →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
