import { useState } from "react";
import { positions as seed } from "../data/positions";
import { Card, CardHeader, PageHeader } from "../components/ui";

export default function PositionRegistry() {
  const [rows, setRows] = useState(seed);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  function startEdit(row) {
    setEditingId(row.id);
    setDraft(row);
  }

  function saveEdit() {
    setRows((rs) => rs.map((r) => (r.id === editingId ? { ...draft } : r)));
    setEditingId(null);
    setDraft({});
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  return (
    <div>
      <PageHeader
        title="Position Registry"
        subtitle="Office-holders for every approver position in the system."
      />

      <div className="px-8 pb-8 space-y-6">
        <div className="border border-brand-100 bg-brand-50/60 rounded-xl px-5 py-4">
          <div className="text-sm font-semibold text-brand-700">
            Change one row — all future approvals re-route automatically.
          </div>
          <div className="text-xs text-navy-700 mt-1 leading-snug">
            Every form stores the approver as a position_id (e.g. POS-DIR-RMC),
            never a named person. The system resolves it to the current holder
            at runtime, so when an office-holder changes there is nothing else
            to update. Historical approvals remain correctly attributed to
            whoever held the post at the time.
          </div>
        </div>

        <Card>
          <CardHeader
            title="Positions"
            subtitle={`${rows.length} positions on file`}
            action={
              <button className="text-xs font-medium text-brand-600 hover:text-brand-700">
                + Add position
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                  <th className="text-left font-medium px-5 py-2.5">
                    Position ID
                  </th>
                  <th className="text-left font-medium px-5 py-2.5">
                    Position Title
                  </th>
                  <th className="text-left font-medium px-5 py-2.5">
                    Current Holder
                  </th>
                  <th className="text-left font-medium px-5 py-2.5">
                    Effective From
                  </th>
                  <th className="text-right font-medium px-5 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => {
                  const editing = editingId === row.id;
                  return (
                    <tr key={row.id} className="hover:bg-surface">
                      <td className="px-5 py-3 font-mono text-xs text-navy-700">
                        {row.id}
                      </td>
                      <td className="px-5 py-3">
                        {editing ? (
                          <input
                            value={draft.title}
                            onChange={(e) =>
                              setDraft({ ...draft, title: e.target.value })
                            }
                            className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                          />
                        ) : (
                          <span className="text-navy-900 font-medium">
                            {row.title}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {editing ? (
                          <input
                            value={draft.holder}
                            onChange={(e) =>
                              setDraft({ ...draft, holder: e.target.value })
                            }
                            className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                          />
                        ) : (
                          <span className="text-navy-700">{row.holder}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {editing ? (
                          <input
                            type="date"
                            value={
                              /^\d{4}-\d{2}-\d{2}$/.test(draft.effectiveFrom)
                                ? draft.effectiveFrom
                                : ""
                            }
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                effectiveFrom: e.target.value,
                              })
                            }
                            className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500"
                          />
                        ) : (
                          <span className="text-navy-700">
                            {row.effectiveFrom}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {editing ? (
                          <span className="inline-flex gap-1">
                            <button
                              onClick={cancelEdit}
                              className="text-xs px-2.5 py-1 rounded-md border border-line bg-white text-navy-700 hover:bg-surface"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveEdit}
                              className="text-xs px-2.5 py-1 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                            >
                              Save
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => startEdit(row)}
                            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="text-xs text-navy-500 leading-relaxed">
          Edits in this prototype are kept in-memory only — they don't persist
          across page reloads. In production, an audit trail captures every
          change (who, when, previous holder, effective dates).
        </div>
      </div>
    </div>
  );
}
