import { useMemo, useState } from "react";
import { projects, getMember, fmtRM } from "../data/projects";
import { PageHeader } from "../components/ui";
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
import AuditLog from "../components/AuditLog";

const claimantTypes = [
  { value: "Writer", honorarium: 3000 },
  { value: "Q&A Preparer", honorarium: 1500 },
  { value: "Reviewer", honorarium: 1200 },
];

export default function PaymentClaimForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const [name, setName] = useState(
    getMember(project, "Principal Researcher") || ""
  );
  const [projectTitle, setProjectTitle] = useState(project.title);
  const [chapterTitle, setChapterTitle] = useState("");
  const [projectLeader, setProjectLeader] = useState(
    getMember(project, "Project Lead") || getMember(project, "Principal Researcher") || ""
  );
  const [type, setType] = useState("Writer");
  const [declarationDate, setDeclarationDate] = useState("2026-06-27");
  const [declarationName, setDeclarationName] = useState(name);
  const [remarks, setRemarks] = useState("");

  const honorarium = useMemo(
    () => claimantTypes.find((c) => c.value === type)?.honorarium || 0,
    [type]
  );

  const routing = [
    {
      projectRole: type,
      person: name || "(claimant)",
      action: "Submit claim",
      state: "done",
      note: "Claimant role for this project (per Letter of Engagement).",
    },
    {
      projectRole: "Project Lead",
      person: projectLeader,
      action: "Comment / endorse",
      state: "done",
    },
    {
      positionId: "POS-RMC-EXEC",
      action: "Review",
      state: "current",
    },
    {
      positionId: "POS-DIR-RMC",
      action: "Approve",
      state: "pending",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payment Claim Form"
        subtitle="Publication / Translation projects — claim payment under a Letter of Engagement"
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FormSection title="Claim Header">
            <Row>
              <Field label="Name" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Project" required>
                <Select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    const p = projects.find((x) => x.id === e.target.value);
                    setProjectTitle(p.title);
                  }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Project Title" span={2}>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </Field>
              <Field label="Chapter Title (if applicable)" span={2}>
                <Input
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 — Sukuk Structures"
                />
              </Field>
              <Field label="Project Leader" required>
                <Input
                  value={projectLeader}
                  onChange={(e) => setProjectLeader(e.target.value)}
                />
              </Field>
              <Field label="Claimant Role" required hint="Drives the honorarium amount.">
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  {claimantTypes.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </Select>
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Honorarium">
            <div className="rounded-lg border border-line bg-surface px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-navy-500">
                  Honorarium for {type}
                </div>
                <div className="text-[11px] text-navy-500 mt-0.5">
                  Set per Letter of Engagement rate card; editable on the form.
                </div>
              </div>
              <div className="text-2xl font-semibold text-navy-900">
                {fmtRM(honorarium)}
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Declaration"
            description="To be completed by the claimant."
          >
            <Row>
              <Field label="Declaration text" span={2}>
                <Textarea
                  rows={3}
                  readOnly
                  value="I hereby confirm I have completed the work assigned as per the Letter of Engagement."
                />
              </Field>
              <Field label="Name (declarant)" required>
                <Input
                  value={declarationName}
                  onChange={(e) => setDeclarationName(e.target.value)}
                />
              </Field>
              <Field label="Date" required>
                <Input
                  type="date"
                  value={declarationDate}
                  onChange={(e) => setDeclarationDate(e.target.value)}
                />
              </Field>
            </Row>
          </FormSection>

          <FormSection
            title="For Office Use"
            description="Completed by RMC on receipt — pre-filled from the project record."
          >
            <Row>
              <Field label="Project ID">
                <ReadOnly value={project.id} />
              </Field>
              <Field label="Remarks">
                <Textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Office-only remarks…"
                />
              </Field>
            </Row>
          </FormSection>

          <FinanceNote />

          <SubmitBar />

          <AuditLog requestKey={`PaymentClaim/${project.id}`} />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — Payment Claim"
            subtitle="In-system chain ends with Director RMC. Finance-side signature blocks are shown separately."
            steps={routing}
            handoff={financeHandoff({ withFinanceSignatures: true })}
            requestKey={`PaymentClaim/${project.id}`}
            footer="The form's 'Received By' (Finance Manager) and 'Verified By' (Finance Director) are completed by Finance after the system has produced the approved form."
          />
        </div>
      </div>
    </div>
  );
}
