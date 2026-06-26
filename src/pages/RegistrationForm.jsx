import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../components/ui";
import {
  FormSection,
  Field,
  Input,
  Select,
  Textarea,
  Row,
  SubmitBar,
} from "../components/Form";
import ApprovalRoutingPanel from "../components/ApprovalRoutingPanel";
import LetterModal from "../components/LetterModal";

const coes = [
  { value: "CASHiEF", positionId: "POS-COE-DIR-CASHIEF" },
  { value: "ISF", positionId: "POS-COE-DIR-ISF" },
  { value: "i-RISE", positionId: "POS-COE-DIR-IRISE" },
];

const categories = ["URP", "RGP", "CRP", "CoRP", "IRP"];

export default function RegistrationForm() {
  const { pathname } = useLocation();
  const isPIF = pathname.endsWith("/pif");

  const [title, setTitle] = useState(
    isPIF ? "Maqasid Indexing of Sustainability-Linked Sukuk" : ""
  );
  const [coe, setCoe] = useState("CASHiEF");
  const [category, setCategory] = useState("URP");
  const [funder, setFunder] = useState("ISRA Internal Research Fund");
  const [amount, setAmount] = useState(80000);
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2027-08-31");
  const [pi, setPi] = useState("Dr Rusni Hassan");
  const [coResearchers, setCoResearchers] = useState(
    "Dr Aishath Muneeza\nDr Hafas Furqani"
  );
  const [milestones, setMilestones] = useState(
    "M1 — Literature review (Nov 2026)\nM2 — Data collection (Mar 2027)\nM3 — Manuscript draft (Jun 2027)\nM4 — Final report (Aug 2027)"
  );
  const [abstract, setAbstract] = useState(
    "Investigation of Maqasid al-Shariah alignment in sustainability-linked sukuk frameworks and the construction of a composite index for issuer evaluation."
  );
  const [showLetters, setShowLetters] = useState(null);

  const coePositionId = coes.find((c) => c.value === coe)?.positionId;

  const routing = useMemo(
    () => [
      {
        projectRole: "Principal Researcher",
        person: pi,
        action: "Submit registration",
        state: "done",
      },
      {
        positionId: coePositionId,
        action: "Endorse",
        state: "done",
      },
      {
        positionId: "POS-RMC-EXEC",
        action: "Completeness check",
        state: "current",
      },
      {
        positionId: "POS-DIR-RMC",
        action: "Approve registration",
        state: "pending",
      },
      {
        action: "Auto-generate Registration Letter + Letter of Undertaking",
        label: "Auto-generated letters",
        note: "Both letters issued from the shared letter engine on approval.",
        state: "auto",
      },
    ],
    [pi, coePositionId]
  );

  return (
    <div>
      <PageHeader
        title={
          isPIF ? "Project Identification Form" : "New Project Registration"
        }
        subtitle={
          isPIF
            ? "Pre-registration intake — capture the proposed project before submitting for full registration."
            : "Register a new research project with RMC."
        }
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowLetters("RegistrationLetter")}
              className="text-sm px-3 py-2 rounded-md border border-line bg-white hover:bg-surface-2 text-navy-700"
            >
              Preview Registration Letter
            </button>
            <button
              onClick={() => setShowLetters("LetterOfUndertaking")}
              className="text-sm px-3 py-2 rounded-md border border-line bg-white hover:bg-surface-2 text-navy-700"
            >
              Preview Undertaking
            </button>
          </div>
        }
      />

      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FormSection title="Project Information">
            <Row>
              <Field label="Project Title" required span={2}>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Maqasid Indexing of Sustainability-Linked Sukuk"
                />
              </Field>
              <Field label="Centre of Excellence" required>
                <Select value={coe} onChange={(e) => setCoe(e.target.value)}>
                  {coes.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Grant Category" required hint="URP / RGP / CRP / CoRP / IRP">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Funder" required>
                <Input
                  value={funder}
                  onChange={(e) => setFunder(e.target.value)}
                />
              </Field>
              <Field label="Total Amount (RM)" required>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value || 0))}
                />
              </Field>
              <Field label="Start Date" required>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
              <Field label="End Date" required>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
              <Field label="Abstract" span={2}>
                <Textarea
                  rows={5}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                />
              </Field>
            </Row>
          </FormSection>

          <FormSection
            title="Team"
            description="The PI and Co-Researchers below are stored on the project — not in the Position Registry. The same person may hold a different role on another project."
          >
            <Row>
              <Field label="Principal Researcher (PI)" required>
                <Input value={pi} onChange={(e) => setPi(e.target.value)} />
              </Field>
              <Field label="Project Lead">
                <Input defaultValue="Iman Ruzain" />
              </Field>
              <Field label="Co-Researchers" hint="One per line" span={2}>
                <Textarea
                  value={coResearchers}
                  onChange={(e) => setCoResearchers(e.target.value)}
                />
              </Field>
            </Row>
          </FormSection>

          <FormSection title="Milestones">
            <Field label="Project milestones" hint="One per line, in the format 'Mn — Description (target date)'">
              <Textarea
                rows={6}
                value={milestones}
                onChange={(e) => setMilestones(e.target.value)}
              />
            </Field>
          </FormSection>

          <FormSection title="Attachments">
            <Row>
              <Field label="Project proposal">
                <Input type="file" />
              </Field>
              <Field label="Budget breakdown">
                <Input type="file" />
              </Field>
            </Row>
          </FormSection>

          <SubmitBar />
        </div>

        <div className="lg:col-span-1">
          <ApprovalRoutingPanel
            title={
              isPIF
                ? "Approval Routing — PIF"
                : "Approval Routing — Project Registration"
            }
            subtitle="Institutional steps resolve via the Position Registry. The PI resolves from this registration's team."
            steps={routing}
            footer="On approval, the Registration Letter and Letter of Undertaking are auto-generated from the shared letter engine."
          />
        </div>
      </div>

      <LetterModal
        open={!!showLetters}
        onClose={() => setShowLetters(null)}
        letter={{
          type: showLetters,
          refNo: "ISRA/RMC/REG/2026/—",
          date: "27 June 2026",
          recipientName: pi,
          recipientAddress: `c/o ${coe}\nISRA Institute · INCEIF University`,
          salutation: pi.replace(/^Dr |^Prof Dr /, "").split(" ")[0],
          projectId: "(to be assigned on registration)",
          projectTitle: title || "—",
          role: "Principal Researcher",
          duration: `${startDate} → ${endDate}`,
          signatoryName: "Dr Nur Harena Redzuan",
          signatoryTitle: "Director, Research Management Centre",
        }}
      />
    </div>
  );
}
