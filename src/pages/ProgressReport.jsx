import { useMemo, useState } from "react";
import { projects, getMember } from "../data/projects";
import { PageHeader, ProgressBar } from "../components/ui";
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
import AuditLog from "../components/AuditLog";

const milestoneStates = [
  { value: "on-track", label: "On Track", tone: "bg-success" },
  { value: "due-soon", label: "Due Soon", tone: "bg-warning" },
  { value: "delayed", label: "Delayed", tone: "bg-danger" },
  { value: "completed", label: "Completed", tone: "bg-navy-700" },
];

function TrafficLightSelect({ value, onChange }) {
  const current = milestoneStates.find((s) => s.value === value);
  return (
    <div className="flex items-center gap-2">
      <span className={["w-2.5 h-2.5 rounded-full", current?.tone].join(" ")} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm px-2 py-1 rounded-md border border-line bg-white focus:outline-none focus:border-brand-500"
      >
        {milestoneStates.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ProgressReport() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const [period, setPeriod] = useState("Q2 2026");
  const [narrative, setNarrative] = useState(
    "Data collection across the three CoE partner banks is 80% complete. Initial interview thematic analysis underway with preliminary findings shared with co-researchers."
  );
  const [outputs, setOutputs] = useState(
    "• Working paper draft circulated for internal review\n• 1 conference abstract accepted (Islamic Finance Conference 2026)\n• Dataset structured and codebook v1 produced"
  );
  const [risks, setRisks] = useState(
    "Stakeholder availability for follow-up interviews has slipped 2 weeks; mitigation by parallel desk research and substituting one interview slot."
  );

  const [milestones, setMilestones] = useState([
    { name: "M1 — Literature review", state: "completed" },
    { name: "M2 — Data collection", state: "on-track" },
    { name: "M3 — Analysis", state: "due-soon" },
    { name: "M4 — Final report", state: "delayed" },
  ]);

  const utilisation = useMemo(() => {
    const total = milestones.length;
    const done = milestones.filter((m) => m.state === "completed").length;
    return total ? Math.round((done / total) * 100) : 0;
  }, [milestones]);

  const routing = [
    {
      projectRole: "Principal Researcher",
      person: getMember(project, "Principal Researcher"),
      action: "Submit progress report",
      state: "done",
    },
    {
      positionId: "POS-RMC-EXEC",
      action: "Review & log to monitoring",
      state: "current",
      note: "Updates the project's monitoring status — no further approval required.",
    },
    {
      action: "Auto-update monitoring dashboard",
      label: "Project monitoring (auto)",
      note: "Milestone traffic-light status flows through to the project record and dashboard.",
      state: "auto",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Progress Report"
        subtitle={`Report progress for ${project.id} — ${project.title}`}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FormSection title="Project & Period">
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
              <Field label="Reporting Period" required>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option>Q1 2026</option>
                  <option>Q2 2026</option>
                  <option>Q3 2026</option>
                  <option>Q4 2026</option>
                  <option>Mid-term</option>
                  <option>Annual</option>
                </Select>
              </Field>
              <Field label="Principal Researcher">
                <ReadOnly value={getMember(project, "Principal Researcher")} />
              </Field>
              <Field label="Centre of Excellence">
                <ReadOnly value={project.coe} />
              </Field>
            </Row>
          </FormSection>

          <FormSection
            title="Milestones"
            description="Set the traffic-light status against each milestone."
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-surface px-3 py-2 rounded-md">
                <div className="text-xs uppercase tracking-wider text-navy-500">
                  Overall completion
                </div>
                <div className="text-sm font-semibold text-navy-900">
                  {utilisation}%
                </div>
              </div>
              <ProgressBar value={utilisation} tone="brand" />
              <div className="border border-line rounded-md divide-y divide-line">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 px-3 py-2.5"
                  >
                    <input
                      value={m.name}
                      onChange={(e) => {
                        const next = [...milestones];
                        next[i] = { ...next[i], name: e.target.value };
                        setMilestones(next);
                      }}
                      className="flex-1 text-sm bg-transparent focus:outline-none border-b border-transparent focus:border-line text-navy-900"
                    />
                    <TrafficLightSelect
                      value={m.state}
                      onChange={(v) => {
                        const next = [...milestones];
                        next[i] = { ...next[i], state: v };
                        setMilestones(next);
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setMilestones([
                    ...milestones,
                    { name: "New milestone", state: "on-track" },
                  ])
                }
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                + Add milestone
              </button>
            </div>
          </FormSection>

          <FormSection title="Narrative">
            <Field label="Progress narrative" required>
              <Textarea
                rows={5}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
              />
            </Field>
            <Field label="Outputs and achievements">
              <Textarea
                rows={5}
                value={outputs}
                onChange={(e) => setOutputs(e.target.value)}
              />
            </Field>
            <Field label="Risks & mitigations">
              <Textarea
                rows={3}
                value={risks}
                onChange={(e) => setRisks(e.target.value)}
              />
            </Field>
          </FormSection>

          <FormSection title="Attachments">
            <Row>
              <Field label="Working paper / draft">
                <Input type="file" />
              </Field>
              <Field label="Other evidence">
                <Input type="file" />
              </Field>
            </Row>
          </FormSection>

          <SubmitBar />

          <AuditLog requestKey={`ProgressReport/${project.id}`} />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — Progress Report"
            subtitle="The PI resolves from this project's team. RMC Executive resolves via the Position Registry."
            steps={routing}
            requestKey={`ProgressReport/${project.id}`}
            footer="No formal approval gate — once reviewed, the progress feeds into the project's monitoring status and dashboard."
          />
        </div>
      </div>
    </div>
  );
}
