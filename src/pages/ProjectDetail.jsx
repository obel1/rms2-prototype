import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projects, fmtRM } from "../data/projects";
import {
  Card,
  CardHeader,
  PageHeader,
  StatusPill,
  ProgressBar,
} from "../components/ui";
import LetterModal from "../components/LetterModal";

const extensionHistory = {
  "ISRA-CRP-25-001": [
    {
      requestedOn: "2026-03-12",
      from: "2026-04-30",
      to: "2026-08-31",
      sequence: "First",
      approver: "Director, RMC",
      status: "Approved",
    },
  ],
  "ISRA-URP-25-014": [
    {
      requestedOn: "2025-11-08",
      from: "2026-02-28",
      to: "2026-07-15",
      sequence: "First",
      approver: "Director, RMC",
      status: "Approved",
    },
    {
      requestedOn: "2026-06-02",
      from: "2026-07-15",
      to: "2026-12-15",
      sequence: "Subsequent",
      approver: "Research Working Committee",
      status: "In Review",
    },
  ],
  "ISRA-RGP-24-007": [
    {
      requestedOn: "2025-09-04",
      from: "2025-12-31",
      to: "2026-06-15",
      sequence: "First",
      approver: "Director, RMC",
      status: "Approved",
    },
  ],
};

const letters = [
  {
    type: "RegistrationLetter",
    label: "Registration Letter",
    description: "Confirms project registration with RMC.",
  },
  {
    type: "LetterOfUndertaking",
    label: "Letter of Undertaking",
    description: "PI undertaking for grant terms and conditions.",
  },
  {
    type: "LOA-Researcher",
    label: "LOA — Researcher",
    description: "Letter of Award to the Principal Researcher.",
  },
  {
    type: "LOA-SME",
    label: "LOA — SME",
    description: "Letter of Award to a Subject Matter Expert.",
  },
  {
    type: "LOA-RA",
    label: "LOA — Research Assistant",
    description: "Issued automatically when an RA application is approved.",
  },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id) || projects[0];
  const history = extensionHistory[project.id] || [];
  const [letter, setLetter] = useState(null);

  function preview(type) {
    setLetter({
      type,
      refNo: `ISRA/RMC/${project.id}/2026`,
      date: "27 June 2026",
      recipientName: project.pi,
      recipientAddress: `c/o ${project.coe}\nISRA Institute · INCEIF University`,
      salutation: project.pi.replace(/^Dr |^Prof Dr /, "").split(" ")[0],
      projectId: project.id,
      projectTitle: project.title,
      role: "Principal Researcher",
      duration: `${project.startDate} → ${project.endDate}`,
      honorarium: Math.round(project.allocation * 0.08),
      signatoryName: "Dr Nur Harena Redzuan",
      signatoryTitle: "Director, Research Management Centre",
    });
  }

  return (
    <div>
      <PageHeader
        title={project.title}
        subtitle={
          <span>
            <Link to="/projects" className="text-brand-600 hover:text-brand-700">
              ← All projects
            </Link>{" "}
            · {project.id} · {project.coe}
          </span>
        }
        actions={<StatusPill status={project.status} />}
      />

      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Project Information" />
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 px-5 py-5 text-sm">
              <Info label="Project ID" value={project.id} />
              <Info label="Category" value={project.category} />
              <Info label="Principal Researcher" value={project.pi} />
              <Info label="Centre of Excellence" value={project.coe} />
              <Info label="Start Date" value={project.startDate} />
              <Info label="End Date" value={project.endDate} />
              <Info
                label="Allocation"
                value={fmtRM(project.allocation)}
              />
              <Info label="Disbursed" value={fmtRM(project.disbursed)} />
              <Info
                label="Balance"
                value={fmtRM(project.allocation - project.disbursed)}
              />
              <Info label="Utilisation" value={`${project.utilisation}%`} />
            </dl>
            <div className="px-5 pb-5">
              <ProgressBar
                value={project.utilisation}
                tone={
                  project.utilisation >= 100
                    ? "danger"
                    : project.utilisation > 80
                      ? "warning"
                      : "brand"
                }
              />
            </div>
          </Card>

          <Card>
            <CardHeader
              title="History of Research Extension"
              subtitle="All requests, current and past."
              action={
                <Link
                  to="/submit/research/extension"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  + New Extension
                </Link>
              }
            />
            {history.length === 0 ? (
              <div className="px-5 py-10 text-sm text-navy-500 text-center">
                No extensions on record for this project.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                      <th className="text-left font-medium px-5 py-2.5">Requested</th>
                      <th className="text-left font-medium px-5 py-2.5">From</th>
                      <th className="text-left font-medium px-5 py-2.5">To</th>
                      <th className="text-left font-medium px-5 py-2.5">Sequence</th>
                      <th className="text-left font-medium px-5 py-2.5">Approver</th>
                      <th className="text-left font-medium px-5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td className="px-5 py-3 text-navy-700">{h.requestedOn}</td>
                        <td className="px-5 py-3 text-navy-700">{h.from}</td>
                        <td className="px-5 py-3 text-navy-900 font-medium">
                          {h.to}
                        </td>
                        <td className="px-5 py-3 text-navy-700">{h.sequence}</td>
                        <td className="px-5 py-3 text-navy-700">{h.approver}</td>
                        <td className="px-5 py-3">
                          <StatusPill status={h.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right column — Administration panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Administration"
              subtitle="Computer-generated letters · no signature required"
            />
            <ul className="divide-y divide-line">
              {letters.map((l) => (
                <li
                  key={l.type}
                  className="px-5 py-3.5 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-navy-900">
                      {l.label}
                    </div>
                    <div className="text-xs text-navy-500 mt-0.5 leading-snug">
                      {l.description}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => preview(l.type)}
                      className="text-xs px-2.5 py-1 rounded-md border border-line bg-white text-navy-700 hover:bg-surface"
                    >
                      View
                    </button>
                    <button className="text-xs px-2.5 py-1 rounded-md bg-brand-600 text-white hover:bg-brand-700">
                      Email
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3 border-t border-line text-[11px] text-navy-500 leading-snug">
              All letters are generated from the shared letter engine. Recipients,
              signatures and honoraria are populated from the project record and
              the Position Registry.
            </div>
          </Card>
        </div>
      </div>

      <LetterModal
        open={!!letter}
        onClose={() => setLetter(null)}
        letter={letter}
      />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-navy-500">{label}</dt>
      <dd className="text-sm text-navy-900 font-medium mt-0.5">{value}</dd>
    </div>
  );
}
