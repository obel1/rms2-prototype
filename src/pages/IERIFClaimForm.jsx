import { useMemo, useState } from "react";
import { projects, getMember, fmtRM } from "../data/projects";
import { Card, CardHeader, PageHeader } from "../components/ui";
import {
  FormSection,
  Field,
  Input,
  Select,
  Textarea,
  ReadOnly,
  Row,
  SubmitBar,
} from "../components/Form";
import ApprovalRoutingPanel from "../components/ApprovalRoutingPanel";
import FinanceNote, { financeHandoff } from "../components/FinanceNote";

const expenseCategories = [
  "Travel & accommodation",
  "Materials & consumables",
  "Equipment",
  "Honorarium",
  "Publication & dissemination",
  "Other",
];

function blankExpense() {
  return { description: "", category: expenseCategories[0], amount: 0 };
}

export default function IERIFClaimForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const [claimant, setClaimant] = useState(
    getMember(project, "Principal Researcher") || ""
  );
  const [claimDate, setClaimDate] = useState("2026-06-27");
  const [expenses, setExpenses] = useState([
    {
      description: "Workshop venue rental — KL Hub",
      category: "Materials & consumables",
      amount: 1800,
    },
    {
      description: "Refreshments for participants",
      category: "Materials & consumables",
      amount: 650,
    },
    {
      description: "Speaker honorarium (external SME)",
      category: "Honorarium",
      amount: 2000,
    },
  ]);

  const total = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );

  function updateExp(i, key, value) {
    const next = [...expenses];
    next[i] = { ...next[i], [key]: value };
    setExpenses(next);
  }

  const routing = [
    {
      projectRole: "Claimant",
      person: claimant || "(claimant)",
      action: "Submit IERIF claim",
      state: "done",
      note: "Typically the PI or project lead.",
    },
    {
      positionId: "POS-DIR-RMC",
      action: "Approve",
      state: "current",
    },
  ];

  return (
    <div>
      <PageHeader
        title="IERIF Claim Form"
        subtitle="Claim against the Institutional / Endowed Research & Innovation Fund."
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FormSection title="Claim Header">
            <Row>
              <Field label="Project" required>
                <Select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Centre of Excellence">
                <ReadOnly value={project.coe} />
              </Field>
              <Field label="Claimant" required>
                <Input
                  value={claimant}
                  onChange={(e) => setClaimant(e.target.value)}
                />
              </Field>
              <Field label="Claim date" required>
                <Input
                  type="date"
                  value={claimDate}
                  onChange={(e) => setClaimDate(e.target.value)}
                />
              </Field>
            </Row>
          </FormSection>

          <Card>
            <CardHeader
              title="Itemised Expenses"
              subtitle="One row per expense item; receipts attached below."
              action={
                <button
                  onClick={() => setExpenses([...expenses, blankExpense()])}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  + Add item
                </button>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                    <th className="text-left font-medium px-3 py-2 w-10">No</th>
                    <th className="text-left font-medium px-3 py-2">
                      Description
                    </th>
                    <th className="text-left font-medium px-3 py-2 w-56">
                      Category
                    </th>
                    <th className="text-right font-medium px-3 py-2 w-32">
                      Amount (RM)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {expenses.map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5 text-navy-500">{i + 1}</td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.description}
                          onChange={(e) =>
                            updateExp(i, "description", e.target.value)
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.category}
                          onChange={(e) =>
                            updateExp(i, "category", e.target.value)
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                        >
                          {expenseCategories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={row.amount}
                          onChange={(e) =>
                            updateExp(i, "amount", Number(e.target.value || 0))
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full text-right"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-surface">
                    <td
                      colSpan={3}
                      className="px-3 py-2 text-right text-xs uppercase tracking-wider text-navy-500 font-semibold"
                    >
                      Total
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-semibold text-navy-900">
                      {fmtRM(total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <FormSection
            title="Supporting Receipts"
            description="Original receipts must be attached. The system records the upload; physical originals continue to be required by Finance."
          >
            <Row>
              <Field label="Upload receipts (PDF / images)" span={2}>
                <Input type="file" multiple />
              </Field>
              <Field label="Notes" span={2}>
                <Textarea
                  rows={3}
                  defaultValue="All receipts dated within the claim period and attributable to this project."
                />
              </Field>
            </Row>
          </FormSection>

          <FinanceNote />

          <SubmitBar />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — IERIF Claim"
            subtitle="The claimant resolves from the project team; the approver via the Position Registry."
            steps={routing}
            handoff={financeHandoff()}
            footer="On Director RMC approval the system produces an approved IERIF claim form. Delivery to Finance is undecided."
          />
        </div>
      </div>
    </div>
  );
}
