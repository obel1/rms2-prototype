import { projects, fmtRM, totals } from "../data/projects";
import { Card, CardHeader, PageHeader, ProgressBar } from "../components/ui";

export default function ControlSheet() {
  const t = totals();

  return (
    <div>
      <PageHeader
        title="Control Sheet"
        subtitle="Read-only view of project allocations, disbursements and balances across the portfolio."
        actions={
          <button className="text-sm px-3 py-2 rounded-md border border-line bg-white hover:bg-surface-2 text-navy-700">
            Export CSV
          </button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Total Allocation" value={fmtRM(t.allocation)} />
          <Stat label="Disbursed" value={fmtRM(t.disbursed)} />
          <Stat label="Balance" value={fmtRM(t.balance)} />
          <Stat label="Utilisation" value={`${t.utilisation}%`} />
        </div>

        <Card>
          <CardHeader
            title="Per-project ledger"
            subtitle="Allocation = Approved + Supplementary. Disbursed reflects the latest approved disbursements (Finance-side update method TBD)."
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                  <th className="text-left font-medium px-5 py-2.5">
                    Project ID
                  </th>
                  <th className="text-left font-medium px-5 py-2.5">CoE</th>
                  <th className="text-right font-medium px-5 py-2.5">
                    Allocation (RM)
                  </th>
                  <th className="text-right font-medium px-5 py-2.5">
                    Disbursed (RM)
                  </th>
                  <th className="text-right font-medium px-5 py-2.5">
                    Balance (RM)
                  </th>
                  <th className="text-left font-medium px-5 py-2.5 w-44">
                    Utilisation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-surface">
                    <td className="px-5 py-3 font-medium text-navy-900">
                      {p.id}
                    </td>
                    <td className="px-5 py-3 text-navy-700">{p.coe}</td>
                    <td className="px-5 py-3 text-right text-navy-700 tabular-nums">
                      {p.allocation.toLocaleString("en-MY")}
                    </td>
                    <td className="px-5 py-3 text-right text-navy-700 tabular-nums">
                      {p.disbursed.toLocaleString("en-MY")}
                    </td>
                    <td className="px-5 py-3 text-right text-navy-900 font-medium tabular-nums">
                      {(p.allocation - p.disbursed).toLocaleString("en-MY")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
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
                        <div className="text-xs text-navy-500 w-9 text-right tabular-nums">
                          {p.utilisation}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface">
                  <td colSpan={2} className="px-5 py-3 text-xs uppercase tracking-wider text-navy-500 font-semibold">
                    Totals
                  </td>
                  <td className="px-5 py-3 text-right text-navy-900 font-semibold tabular-nums">
                    {t.allocation.toLocaleString("en-MY")}
                  </td>
                  <td className="px-5 py-3 text-right text-navy-900 font-semibold tabular-nums">
                    {t.disbursed.toLocaleString("en-MY")}
                  </td>
                  <td className="px-5 py-3 text-right text-navy-900 font-semibold tabular-nums">
                    {t.balance.toLocaleString("en-MY")}
                  </td>
                  <td className="px-5 py-3 text-xs text-navy-500">
                    {t.utilisation}% overall
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <div className="text-xs text-navy-500 leading-relaxed">
          The Control Sheet is read-only in the prototype. In production, this
          would be the canonical financial ledger maintained by Finance. The
          mechanism by which approved DRFs / claims update this sheet is part
          of the undecided Finance hand-off step.
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-line rounded-xl px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="text-xs uppercase tracking-wider text-navy-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-navy-900 tabular-nums">
        {value}
      </div>
    </div>
  );
}
