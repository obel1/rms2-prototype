import { useMemo, useState } from "react";
import { projects, getMember, fmtRM } from "../data/projects";
import { Card, CardHeader, PageHeader, ProgressBar } from "../components/ui";
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
import LetterModal from "../components/LetterModal";

const checklistSeed = [
  {
    key: "completion",
    label: "Completion Form",
    description: "PI-signed completion form covering all deliverables.",
  },
  {
    key: "feedback",
    label: "Feedback Form",
    description: "Project feedback questionnaire submitted.",
  },
  {
    key: "output",
    label: "Project Output",
    description: "Final report / paper / artefact deposited.",
  },
  {
    key: "control",
    label: "Control Sheet",
    description: "Updated control sheet with full financial trail.",
  },
  {
    key: "receipts",
    label: "Original Receipts",
    description: "All supporting receipts submitted to Finance.",
  },
];

export default function CompletionForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);

  const [checklist, setChecklist] = useState(() =>
    checklistSeed.map((c, i) => ({ ...c, done: i < 3 }))
  );
  const [approved, setApproved] = useState(project.allocation);
  const [supplementary, setSupplementary] = useState(0);
  const [expenditure, setExpenditure] = useState(project.disbursed);
  const [achievements, setAchievements] = useState(
    "• 2 working papers completed; 1 peer-reviewed article submitted\n• Composite index methodology shared with industry partner\n• 1 RA upskilled in mixed-methods analysis"
  );
  const [showLetter, setShowLetter] = useState(false);

  const completion = useMemo(() => {
    const done = checklist.filter((c) => c.done).length;
    return Math.round((done / checklist.length) * 100);
  }, [checklist]);

  const balance = approved + supplementary - expenditure;
  const canIssueLetter = completion === 100;

  const routing = [
    {
      projectRole: "Principal Researcher",
      person: getMember(project, "Principal Researcher"),
      action: "Submit completion",
      state: "done",
    },
    {
      projectRole: "Project Lead",
      person: getMember(project, "Project Lead") || "(none on this project)",
      action: "Endorse",
      state: "done",
      note: "Only present if a Project Lead is assigned to this project.",
    },
    {
      positionId: "POS-FIN",
      action: "Reconcile budget & receipts",
      state: "current",
    },
    {
      positionId: "POS-DIR-RMC",
      action: "Verify and close project",
      state: "pending",
    },
    {
      action: "Auto-generate Successful Completion Letter",
      label: "Successful Completion Letter (auto)",
      note: "Issued when the checklist is at 100% and budget is reconciled.",
      state: "auto",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Research Completion"
        subtitle={`Close out ${project.id} — ${project.title}`}
        actions={
          <button
            disabled={!canIssueLetter}
            onClick={() => setShowLetter(true)}
            className={[
              "text-sm px-3 py-2 rounded-md border",
              canIssueLetter
                ? "border-line bg-white hover:bg-surface-2 text-navy-700"
                : "border-line bg-surface-2 text-navy-200 cursor-not-allowed",
            ].join(" ")}
            title={
              canIssueLetter
                ? "Preview the auto-generated Successful Completion Letter"
                : "Available once the checklist is 100% complete"
            }
          >
            Preview Completion Letter
          </button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FormSection title="Project">
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
              <Field label="Principal Researcher">
                <ReadOnly value={getMember(project, "Principal Researcher")} />
              </Field>
              <Field label="Centre of Excellence">
                <ReadOnly value={project.coe} />
              </Field>
              <Field label="Period">
                <ReadOnly value={`${project.startDate} → ${project.endDate}`} />
              </Field>
            </Row>
          </FormSection>

          <Card>
            <CardHeader
              title="Completion Checklist"
              subtitle="Five required items. Each must be ticked before the project can be closed."
            />
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wider text-navy-500">
                  Checklist completion
                </div>
                <div className="text-sm font-semibold text-navy-900">
                  {completion}%
                </div>
              </div>
              <ProgressBar
                value={completion}
                tone={completion === 100 ? "success" : "brand"}
              />
            </div>
            <ul className="divide-y divide-line">
              {checklist.map((c, i) => (
                <li
                  key={c.key}
                  className="px-5 py-3 flex items-start gap-3 hover:bg-surface"
                >
                  <input
                    id={`chk-${c.key}`}
                    type="checkbox"
                    checked={c.done}
                    onChange={(e) => {
                      const next = [...checklist];
                      next[i] = { ...next[i], done: e.target.checked };
                      setChecklist(next);
                    }}
                    className="mt-0.5 w-4 h-4 accent-brand-600"
                  />
                  <label htmlFor={`chk-${c.key}`} className="flex-1 cursor-pointer">
                    <div className="text-sm font-medium text-navy-900">
                      {c.label}
                    </div>
                    <div className="text-xs text-navy-500 mt-0.5">
                      {c.description}
                    </div>
                  </label>
                  {c.done && (
                    <span className="text-[11px] font-medium text-success">
                      ✓ Done
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <FormSection
            title="Budget Reconciliation"
            description="Approved budget + any supplementary, less cumulative expenditure."
          >
            <Row>
              <Field label="Approved (RM)" required>
                <Input
                  type="number"
                  value={approved}
                  onChange={(e) => setApproved(Number(e.target.value || 0))}
                />
              </Field>
              <Field label="Supplementary (RM)">
                <Input
                  type="number"
                  value={supplementary}
                  onChange={(e) => setSupplementary(Number(e.target.value || 0))}
                />
              </Field>
              <Field label="Cumulative Expenditure (RM)" required>
                <Input
                  type="number"
                  value={expenditure}
                  onChange={(e) => setExpenditure(Number(e.target.value || 0))}
                />
              </Field>
              <Field
                label="Balance (RM)"
                hint={
                  balance >= 0
                    ? "Returned to the central fund on closure."
                    : "Over-spend — flag to Finance."
                }
              >
                <ReadOnly value={fmtRM(balance)} />
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Project Achievements">
            <Field label="Key achievements" required>
              <Textarea
                rows={6}
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
              />
            </Field>
          </FormSection>

          <FormSection title="Attachments">
            <Row>
              <Field label="Final report">
                <Input type="file" />
              </Field>
              <Field label="Acquittal / receipts pack">
                <Input type="file" />
              </Field>
            </Row>
          </FormSection>

          <SubmitBar />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — Completion"
            subtitle="Institutional steps resolve via the Position Registry. Project-role steps (PI, Project Lead) resolve from this project's team."
            steps={routing}
            footer={
              canIssueLetter
                ? "Checklist is at 100%. On Director RMC verification the Successful Completion Letter is auto-generated."
                : "The Successful Completion Letter is auto-generated only when the checklist reaches 100%."
            }
          />
        </div>
      </div>

      <LetterModal
        open={showLetter}
        onClose={() => setShowLetter(false)}
        letter={{
          type: "SuccessfulCompletionLetter",
          refNo: `ISRA/RMC/${project.id}/COMP/2026`,
          date: "27 June 2026",
          recipientName: getMember(project, "Principal Researcher"),
          recipientAddress: `c/o ${project.coe}\nISRA Institute · INCEIF University`,
          salutation:
            (getMember(project, "Principal Researcher") || "Sir")
              .replace(/^Dr |^Prof Dr /, "")
              .split(" ")[0] || "Sir",
          projectId: project.id,
          projectTitle: project.title,
          role: "Principal Researcher",
          duration: `${project.startDate} → ${project.endDate}`,
          signatoryName: "Dr Nur Harena Redzuan",
          signatoryTitle: "Director, Research Management Centre",
        }}
      />
    </div>
  );
}
