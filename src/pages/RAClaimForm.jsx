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

function blankTimesheetRow() {
  return { date: "", task: "", timeSpent: "", hours: 0 };
}

function blankAssignmentRow() {
  return {
    assignment: "",
    days: 0,
    expectedPct: 0,
    actualPct: 0,
    remarks: "",
  };
}

export default function RAClaimForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const defaultRa = getMember(project, "Research Assistant") || "";
  const [name, setName] = useState(defaultRa);
  const [claimMonth, setClaimMonth] = useState("2026-06");
  const [supervisor] = useState(getMember(project, "Principal Researcher"));
  const [ratePerHour, setRatePerHour] = useState(25);

  const [timesheet, setTimesheet] = useState([
    {
      date: "2026-06-03",
      task: "Literature review — Maqasid framework",
      timeSpent: "09:00–13:00",
      hours: 4,
    },
    {
      date: "2026-06-10",
      task: "Stakeholder interview transcription",
      timeSpent: "10:00–15:00",
      hours: 5,
    },
    {
      date: "2026-06-17",
      task: "Codebook revisions & coding",
      timeSpent: "14:00–18:30",
      hours: 4.5,
    },
    {
      date: "2026-06-24",
      task: "Drafting working paper section 3",
      timeSpent: "09:30–14:00",
      hours: 4.5,
    },
  ]);

  const [assignments, setAssignments] = useState([
    {
      assignment: "Literature review",
      days: 4,
      expectedPct: 100,
      actualPct: 100,
      remarks: "Completed",
    },
    {
      assignment: "Field interview transcription",
      days: 3,
      expectedPct: 100,
      actualPct: 80,
      remarks: "1 interview pending",
    },
    {
      assignment: "Coding & analysis",
      days: 5,
      expectedPct: 60,
      actualPct: 55,
      remarks: "On track",
    },
  ]);

  const totalHours = useMemo(
    () => timesheet.reduce((s, r) => s + Number(r.hours || 0), 0),
    [timesheet]
  );
  const totalClaim = ratePerHour * totalHours;

  const routing = [
    {
      projectRole: "Research Assistant",
      person: name || "(select an RA)",
      action: "Submit claim",
      state: "done",
    },
    {
      projectRole: "Principal Researcher",
      person: supervisor,
      action: "Endorse (Lead Researcher)",
      state: "done",
      note: "Lead Researcher on this project — i.e. the PI.",
    },
    {
      positionId: project.coePositionId,
      action: "Recommend",
      state: "current",
    },
    {
      positionId: "POS-DIR-RMC",
      action: "Approve",
      state: "pending",
    },
  ];

  function updateTs(i, key, value) {
    const next = [...timesheet];
    next[i] = { ...next[i], [key]: value };
    setTimesheet(next);
  }
  function updateAs(i, key, value) {
    const next = [...assignments];
    next[i] = { ...next[i], [key]: value };
    setAssignments(next);
  }

  return (
    <div>
      <PageHeader
        title="Research Assistant Claim Form"
        subtitle="For Research Grant — IERIF / National / International"
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FormSection title="Claim Header">
            <Row>
              <Field label="Name (RA)" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Claim Month" required>
                <Input
                  type="month"
                  value={claimMonth}
                  onChange={(e) => setClaimMonth(e.target.value)}
                />
              </Field>
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
              <Field label="Supervisor (Lead Researcher)">
                <ReadOnly value={supervisor} />
              </Field>
            </Row>
          </FormSection>

          <Card>
            <CardHeader
              title="Section A — Timesheet (Time Sheet / Progress Report)"
              subtitle="Hours logged this claim period."
              action={
                <button
                  onClick={() => setTimesheet([...timesheet, blankTimesheetRow()])}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  + Add row
                </button>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                    <th className="text-left font-medium px-3 py-2 w-32">
                      Date
                    </th>
                    <th className="text-left font-medium px-3 py-2">
                      Description of Task
                    </th>
                    <th className="text-left font-medium px-3 py-2 w-36">
                      Time Spent
                    </th>
                    <th className="text-right font-medium px-3 py-2 w-24">
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {timesheet.map((row, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1.5">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => updateTs(i, "date", e.target.value)}
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.task}
                          onChange={(e) => updateTs(i, "task", e.target.value)}
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.timeSpent}
                          onChange={(e) =>
                            updateTs(i, "timeSpent", e.target.value)
                          }
                          placeholder="e.g. 09:00–13:00"
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          step="0.5"
                          value={row.hours}
                          onChange={(e) =>
                            updateTs(i, "hours", Number(e.target.value || 0))
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full text-right"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-surface">
                    <td colSpan={3} className="px-3 py-2 text-right text-xs uppercase tracking-wider text-navy-500 font-semibold">
                      Total Hours
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-semibold text-navy-900">
                      {totalHours}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Section B — Claim"
              subtitle="Assignment breakdown and computed amount."
              action={
                <button
                  onClick={() =>
                    setAssignments([...assignments, blankAssignmentRow()])
                  }
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  + Add row
                </button>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                    <th className="text-left font-medium px-3 py-2 w-10">No</th>
                    <th className="text-left font-medium px-3 py-2">Assignment</th>
                    <th className="text-right font-medium px-3 py-2 w-24">
                      Days
                    </th>
                    <th className="text-right font-medium px-3 py-2 w-28">
                      Expected %
                    </th>
                    <th className="text-right font-medium px-3 py-2 w-28">
                      Actual %
                    </th>
                    <th className="text-left font-medium px-3 py-2 w-48">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {assignments.map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5 text-navy-500">{i + 1}</td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.assignment}
                          onChange={(e) =>
                            updateAs(i, "assignment", e.target.value)
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={row.days}
                          onChange={(e) =>
                            updateAs(i, "days", Number(e.target.value || 0))
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full text-right"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={row.expectedPct}
                          onChange={(e) =>
                            updateAs(i, "expectedPct", Number(e.target.value || 0))
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full text-right"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          value={row.actualPct}
                          onChange={(e) =>
                            updateAs(i, "actualPct", Number(e.target.value || 0))
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full text-right"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.remarks}
                          onChange={(e) =>
                            updateAs(i, "remarks", e.target.value)
                          }
                          className="text-sm px-2 py-1 rounded border border-line bg-white focus:outline-none focus:border-brand-500 w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 border-t border-line bg-surface/40">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Field label="RA rate per hour (RM)">
                  <Input
                    type="number"
                    value={ratePerHour}
                    onChange={(e) =>
                      setRatePerHour(Number(e.target.value || 0))
                    }
                  />
                </Field>
                <Field label="Total hours (from Section A)">
                  <ReadOnly value={totalHours} />
                </Field>
                <div>
                  <div className="text-xs uppercase tracking-wider text-navy-500 mb-1">
                    Total claim
                  </div>
                  <div className="text-2xl font-semibold text-navy-900">
                    {fmtRM(totalClaim)}
                  </div>
                  <div className="text-[11px] text-navy-500 mt-0.5">
                    {ratePerHour} × {totalHours} hours
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <FormSection title="Declaration & Attachments">
            <Row>
              <Field label="Notes / declaration" span={2}>
                <Textarea
                  rows={3}
                  defaultValue="I confirm the hours logged above are accurate and the work has been completed."
                />
              </Field>
              <Field label="Supporting evidence">
                <Input type="file" />
              </Field>
            </Row>
          </FormSection>

          <FinanceNote />

          <SubmitBar />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — RA Claim"
            subtitle="In-system chain ends with Director RMC. Finance-side payment steps sit outside the system."
            steps={routing}
            handoff={financeHandoff({ withFinanceSignatures: true })}
            footer="Received By / Verified By are Finance Department steps performed after the system has produced the approved form."
          />
        </div>
      </div>
    </div>
  );
}
