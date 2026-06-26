import { useMemo, useState } from "react";
import { projects } from "../data/projects";
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
import LetterModal from "../components/LetterModal";

export default function RAForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const [raName, setRaName] = useState("Aishah binti Rahmat");
  const [qualification, setQualification] = useState("MSc Islamic Finance, INCEIF");
  const [duration, setDuration] = useState("6 months");
  const [stipend, setStipend] = useState(2500);
  const [startDate, setStartDate] = useState("2026-08-01");
  const [justification, setJustification] = useState(
    "Required to support data collection, literature mapping, and analysis for the project's Year 2 deliverables."
  );
  const [showLetter, setShowLetter] = useState(false);

  const routing = useMemo(
    () => [
      {
        positionId: "POS-PI",
        action: "Submit application",
        state: "done",
        note: `Principal Researcher: ${project.pi}`,
      },
      {
        positionId: project.coePositionId,
        action: "Recommend",
        state: "done",
      },
      {
        positionId: "POS-FIN",
        action: "Verify funds & eligibility",
        state: "current",
      },
      {
        positionId: "POS-DIR-RMC",
        action: "Approve appointment",
        state: "pending",
      },
      {
        action: "Generate LOA-RA",
        label: "Letter of Award (RA) — auto",
        note: "Letter generated and emailed to the RA on final approval.",
        state: "auto",
      },
    ],
    [project]
  );

  return (
    <div>
      <PageHeader
        title="RA Application"
        subtitle={`Appoint a Research Assistant under ${project.id}`}
        actions={
          <button
            onClick={() => setShowLetter(true)}
            className="text-sm px-3 py-2 rounded-md border border-line bg-white hover:bg-surface-2 text-navy-700"
          >
            Preview LOA-RA
          </button>
        }
      />

      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
              <Field label="Centre of Excellence">
                <ReadOnly value={project.coe} />
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Research Assistant">
            <Row>
              <Field label="Full Name" required>
                <Input value={raName} onChange={(e) => setRaName(e.target.value)} />
              </Field>
              <Field label="NRIC / Passport" required>
                <Input placeholder="e.g. 980512-14-5678" />
              </Field>
              <Field label="Highest Qualification" required>
                <Input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </Field>
              <Field label="Email" required>
                <Input type="email" placeholder="aishah.rahmat@example.com" />
              </Field>
              <Field label="Justification for appointment" span={2} required>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Engagement Terms">
            <Row>
              <Field label="Start Date" required>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
              <Field label="Duration" required>
                <Select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                  <option>18 months</option>
                </Select>
              </Field>
              <Field label="Monthly Stipend (RM)" required>
                <Input
                  type="number"
                  value={stipend}
                  onChange={(e) => setStipend(Number(e.target.value || 0))}
                />
              </Field>
              <Field label="Supervisor (PI)">
                <ReadOnly value={project.pi} />
              </Field>
            </Row>
          </FormSection>

          <SubmitBar />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — RA Application"
            subtitle="Each step is a POSITION. The current holder is resolved live from the Position Registry."
            steps={routing}
            footer="On final approval the Letter of Award (LOA-RA) is auto-generated and sent to the RA — no signature required."
          />
        </div>
      </div>

      <LetterModal
        open={showLetter}
        onClose={() => setShowLetter(false)}
        letter={{
          type: "LOA-RA",
          refNo: "ISRA/RMC/RA/2026/0142",
          date: "27 June 2026",
          recipientName: raName,
          recipientAddress: "c/o ISRA Institute\nINCEIF University, Kuala Lumpur",
          salutation: raName.split(" ")[0],
          projectId: project.id,
          projectTitle: project.title,
          role: "Research Assistant",
          duration: `${duration} (from ${startDate})`,
          honorarium: stipend,
          signatoryName: "Dr Nur Harena Redzuan",
          signatoryTitle: "Director, Research Management Centre",
        }}
      />
    </div>
  );
}
