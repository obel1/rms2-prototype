import { useMemo, useState } from "react";
import { projects, fmtRM, getMember } from "../data/projects";
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

export default function DRFForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const [amount, setAmount] = useState(8500);
  const [purpose, setPurpose] = useState("Fieldwork stipend disbursement for May–June 2026");
  const [payee, setPayee] = useState(project.pi);
  const [paymentMethod, setPaymentMethod] = useState("Bank transfer");
  const [requestedDate, setRequestedDate] = useState("2026-07-05");

  const routing = useMemo(() => {
    const isOver10k = amount > 10000;
    const isOver50k = amount > 50000;
    const finalApprover = isOver10k
      ? { positionId: "POS-DPR", action: "Final approval" }
      : { positionId: "POS-DIR-RMC", action: "Final approval" };

    return [
      {
        projectRole: "Principal Researcher",
        person: getMember(project, "Principal Researcher"),
        action: "Submit request",
        state: "done",
      },
      {
        positionId: project.coePositionId,
        action: "Recommend",
        state: "done",
      },
      {
        positionId: "POS-FIN",
        action: "Verify funds & documentation",
        state: "current",
      },
      {
        ...finalApprover,
        state: "pending",
      },
      {
        action: "Update Control Sheet",
        label: "Control Sheet (auto)",
        note: "Allocation, disbursed, balance and utilisation % updated automatically.",
        state: "auto",
      },
    ];
  }, [amount, project]);

  const overCap = amount > 50000;

  return (
    <div>
      <PageHeader
        title="Disbursement Request"
        subtitle={`New DRF for ${project.id} — ${project.title}`}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form column */}
        <div className="lg:col-span-2 space-y-4">
          <FormSection
            title="Project"
            description="Select the project this disbursement is drawn against."
          >
            <Row>
              <Field label="Project ID" required>
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
                <ReadOnly value={project.pi} />
              </Field>
              <Field label="Centre of Excellence">
                <ReadOnly value={project.coe} />
              </Field>
              <Field label="Allocation / Disbursed">
                <ReadOnly
                  value={`${fmtRM(project.disbursed)} of ${fmtRM(
                    project.allocation
                  )} (${project.utilisation}% utilised)`}
                />
              </Field>
            </Row>
          </FormSection>

          <FormSection
            title="Disbursement Details"
            description="Amount routes the request automatically — see the panel on the right."
          >
            <Row>
              <Field
                label="Requested Amount (RM)"
                required
                hint="≤RM10,000 → Director RMC; RM10,000–50,000 → Deputy President Research; cap RM50,000 per project."
              >
                <Input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value || 0))}
                />
                {overCap && (
                  <div className="text-[11px] text-danger mt-1">
                    Exceeds RM50,000 per-project cap.
                  </div>
                )}
              </Field>
              <Field label="Requested Disbursement Date" required>
                <Input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                />
              </Field>
              <Field label="Payee" required>
                <Input
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                />
              </Field>
              <Field label="Payment Method">
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Bank transfer</option>
                  <option>Cheque</option>
                  <option>Internal journal</option>
                </Select>
              </Field>
              <Field label="Purpose" required span={2}>
                <Textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </Field>
              <Field label="Budget line">
                <Select defaultValue="Honorarium">
                  <option>Honorarium</option>
                  <option>Travel</option>
                  <option>Equipment</option>
                  <option>Publication</option>
                  <option>Other</option>
                </Select>
              </Field>
              <Field label="Supporting documents">
                <Input type="file" />
              </Field>
            </Row>
          </FormSection>

          <SubmitBar />
        </div>

        {/* Approval routing panel */}
        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — DRF"
            subtitle="Each step is a POSITION. The current holder is resolved live from the Position Registry."
            steps={routing}
            branch={`Routing is amount-based:\n• ≤ RM10,000 → Director RMC\n• RM10,000–50,000 → Deputy President Research\n• > RM50,000 → blocked (exceeds per-project cap)`}
            footer="Approving updates the Control Sheet (allocation / disbursed / balance / utilisation %) automatically."
          />
        </div>
      </div>
    </div>
  );
}
