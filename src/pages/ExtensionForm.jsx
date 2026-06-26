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

export default function ExtensionForm() {
  const [projectId, setProjectId] = useState(projects[0].id);
  const project = projects.find((p) => p.id === projectId);
  const [requestedDate, setRequestedDate] = useState("2027-02-28");
  const [reason, setReason] = useState(
    "Additional time required to complete field interviews delayed by stakeholder availability and to finalise the manuscript."
  );
  const [sequence, setSequence] = useState("first");
  const [supportingDocs, setSupportingDocs] = useState("");

  const isSubsequentSensitive =
    sequence === "subsequent" &&
    (project.category === "URP" || project.category === "RGP");

  const routing = useMemo(() => {
    const steps = [
      {
        positionId: "POS-PI",
        action: "Submit request",
        state: "done",
        note: `Principal Researcher: ${project.pi}`,
      },
      {
        positionId: "POS-RMC-EXEC",
        action: "Completeness check",
        state: "done",
      },
      {
        positionId: project.coePositionId,
        action: "Recommend",
        state: "current",
      },
    ];
    if (isSubsequentSensitive) {
      steps.push({
        action: "Escalate to Research Working Committee",
        label: "Research Working Committee (RWC)",
        note: "Subsequent extensions on URG/RGP escalate beyond Director RMC.",
        state: "pending",
      });
    } else {
      steps.push({
        positionId: "POS-DIR-RMC",
        action: "Approve extension",
        state: "pending",
      });
    }
    steps.push({
      action: "Update project timeline & notify",
      label: "Auto-update + notify",
      note: "Project end date updated; PI and Finance notified.",
      state: "auto",
    });
    return steps;
  }, [project, isSubsequentSensitive]);

  return (
    <div>
      <PageHeader
        title="Research Extension"
        subtitle={`Request an extension to ${project.id}`}
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
              <Field label="Category">
                <ReadOnly value={project.category} />
              </Field>
              <Field label="Principal Researcher">
                <ReadOnly value={project.pi} />
              </Field>
              <Field label="Current End Date">
                <ReadOnly value={project.endDate} />
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Extension Details">
            <Row>
              <Field label="Requested New End Date" required hint="Must be later than the current end date.">
                <Input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                />
              </Field>
              <Field
                label="Extension sequence"
                required
                hint="Subsequent URG/RGP extensions escalate to the Research Working Committee."
              >
                <Select
                  value={sequence}
                  onChange={(e) => setSequence(e.target.value)}
                >
                  <option value="first">First extension</option>
                  <option value="subsequent">Subsequent extension</option>
                </Select>
              </Field>
              <Field label="Reason for extension" required span={2}>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Field>
              <Field label="Revised milestones / workplan" span={2}>
                <Textarea
                  placeholder="List the revised milestones, owners and target dates…"
                  defaultValue={"• Final interviews — Sep 2026\n• Manuscript draft — Dec 2026\n• Submission to journal — Feb 2027"}
                />
              </Field>
              <Field label="Supporting documents">
                <Input
                  type="file"
                  onChange={(e) => setSupportingDocs(e.target.value)}
                />
              </Field>
              <Field label="Budget impact">
                <Select defaultValue="None">
                  <option>None</option>
                  <option>Reallocation within ceiling</option>
                  <option>Additional funds requested</option>
                </Select>
              </Field>
            </Row>
          </FormSection>

          <SubmitBar />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title="Approval Routing — Extension"
            subtitle="Each step is a POSITION. The current holder is resolved live from the Position Registry."
            steps={routing}
            branch={
              isSubsequentSensitive
                ? `This is a subsequent extension on a ${project.category} project — final approval escalates from Director RMC to the Research Working Committee.`
                : `Standard routing — final approval rests with the Director, RMC.\nSubsequent URG/RGP extensions automatically escalate to the Research Working Committee.`
            }
            footer="On approval the project end date is updated and the PI + Finance are notified."
          />
        </div>
      </div>
    </div>
  );
}
