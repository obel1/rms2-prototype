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

export default function TRFForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const [applicant, setApplicant] = useState(
    getMember(project, "Principal Researcher") || ""
  );
  const [purpose, setPurpose] = useState(
    "Fieldwork interviews with sukuk issuers and stakeholders"
  );
  const [destination, setDestination] = useState("Jakarta, Indonesia");
  const [fromDate, setFromDate] = useState("2026-08-12");
  const [toDate, setToDate] = useState("2026-08-15");
  const [transport, setTransport] = useState(2200);
  const [accommodation, setAccommodation] = useState(1500);
  const [perDiem, setPerDiem] = useState(900);
  const [advanceRequired, setAdvanceRequired] = useState("yes");
  const [advanceAmount, setAdvanceAmount] = useState(3500);

  const total = useMemo(
    () => Number(transport) + Number(accommodation) + Number(perDiem),
    [transport, accommodation, perDiem]
  );

  const routing = [
    {
      projectRole: "Applicant",
      person: applicant || "(applicant)",
      action: "Submit travel requisition",
      state: "current",
      note: "Typically the PI or a project team member.",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Travel Requisition Form (TRF)"
        subtitle="Request approval to travel under a research project."
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FormSection title="Project & Applicant">
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
              <Field label="Applicant" required>
                <Input
                  value={applicant}
                  onChange={(e) => setApplicant(e.target.value)}
                />
              </Field>
              <Field label="Principal Researcher">
                <ReadOnly value={getMember(project, "Principal Researcher")} />
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Travel Details">
            <Row>
              <Field label="Purpose of travel" required span={2}>
                <Textarea
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </Field>
              <Field label="Destination" required>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Field>
              <Field label="Mode of travel">
                <Select defaultValue="Flight">
                  <option>Flight</option>
                  <option>Train</option>
                  <option>Road</option>
                </Select>
              </Field>
              <Field label="From" required>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Field>
              <Field label="To" required>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Field>
            </Row>
          </FormSection>

          <FormSection
            title="Estimated Cost Breakdown"
            description="All amounts in RM."
          >
            <Row>
              <Field label="Transport (RM)">
                <Input
                  type="number"
                  value={transport}
                  onChange={(e) => setTransport(Number(e.target.value || 0))}
                />
              </Field>
              <Field label="Accommodation (RM)">
                <Input
                  type="number"
                  value={accommodation}
                  onChange={(e) =>
                    setAccommodation(Number(e.target.value || 0))
                  }
                />
              </Field>
              <Field label="Per diem (RM)">
                <Input
                  type="number"
                  value={perDiem}
                  onChange={(e) => setPerDiem(Number(e.target.value || 0))}
                />
              </Field>
              <Field label="Total estimated">
                <ReadOnly value={fmtRM(total)} />
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Advance">
            <Row>
              <Field label="Advance required?">
                <Select
                  value={advanceRequired}
                  onChange={(e) => setAdvanceRequired(e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </Field>
              {advanceRequired === "yes" && (
                <Field label="Advance amount (RM)">
                  <Input
                    type="number"
                    value={advanceAmount}
                    onChange={(e) =>
                      setAdvanceAmount(Number(e.target.value || 0))
                    }
                  />
                </Field>
              )}
              <Field label="Supporting documents" span={2}>
                <Input type="file" />
              </Field>
            </Row>
          </FormSection>

          <FinanceNote />

          <SubmitBar />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — TRF"
            subtitle="No in-system approver beyond the applicant — the approved TRF is then forwarded to Finance."
            steps={routing}
            handoff={financeHandoff()}
            footer="The TRF prints with the applicant's signature. Delivery of the approved form to Finance is undecided."
          />
        </div>
      </div>
    </div>
  );
}
