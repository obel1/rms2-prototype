import { useState } from "react";
import { projects } from "../data/projects";
import { Card, CardHeader, PageHeader } from "../components/ui";
import { useRole } from "../state/RoleContext";
import LetterModal from "../components/LetterModal";

// Synthesise the letters this researcher would have received across their
// projects: Registration / Undertaking + (where they are PI) any related LOAs.
function lettersForPerson(personName) {
  const items = [];
  for (const p of projects) {
    const roles = (p.team || []).filter((m) => m.person === personName);
    if (roles.length === 0) continue;
    for (const r of roles) {
      if (r.role === "Principal Researcher") {
        items.push({
          type: "RegistrationLetter",
          label: "Registration Letter",
          project: p,
          issuedDate: "2025-03-10",
        });
        items.push({
          type: "LetterOfUndertaking",
          label: "Letter of Undertaking",
          project: p,
          issuedDate: "2025-03-10",
        });
        items.push({
          type: "LOA-Researcher",
          label: "LOA — Researcher",
          project: p,
          issuedDate: "2025-03-12",
        });
      } else if (r.role === "Subject Matter Expert") {
        items.push({
          type: "LOA-SME",
          label: "LOA — SME",
          project: p,
          issuedDate: "2025-04-01",
        });
      } else if (r.role === "Research Assistant") {
        items.push({
          type: "LOA-RA",
          label: "LOA — Research Assistant",
          project: p,
          issuedDate: "2025-05-01",
        });
      }
    }
  }
  return items;
}

export default function MyLetters() {
  const { persona } = useRole();
  const [letter, setLetter] = useState(null);
  const items = lettersForPerson(persona.name);

  function preview(item) {
    setLetter({
      type: item.type,
      refNo: `ISRA/RMC/${item.project.id}/2026`,
      date: item.issuedDate,
      recipientName: persona.name,
      recipientAddress: `c/o ${item.project.coe}\nISRA Institute · INCEIF University`,
      salutation: persona.name.replace(/^Dr |^Prof Dr /, "").split(" ")[0],
      projectId: item.project.id,
      projectTitle: item.project.title,
      role: item.label.replace(/^LOA — /, ""),
      duration: `${item.project.startDate} → ${item.project.endDate}`,
      honorarium: Math.round(item.project.allocation * 0.08),
      signatoryName: "Dr Nur Harena Redzuan",
      signatoryTitle: "Director, Research Management Centre",
    });
  }

  return (
    <div>
      <PageHeader
        title="My Letters"
        subtitle={`All letters issued to you as ${persona.name}.`}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <Card>
          <CardHeader
            title="Issued letters"
            subtitle={`${items.length} letter${items.length === 1 ? "" : "s"} on file.`}
          />
          {items.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-navy-500">
              No letters on file for you.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((it, i) => (
                <li
                  key={i}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-navy-900">
                      {it.label}
                    </div>
                    <div className="text-xs text-navy-500 mt-0.5">
                      {it.project.id} · {it.project.title}
                    </div>
                    <div className="text-[11px] text-navy-500 mt-0.5">
                      Issued {it.issuedDate}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => preview(it)}
                      className="text-xs px-3 py-1.5 rounded-md border border-line bg-white hover:bg-surface text-navy-700"
                    >
                      View
                    </button>
                    <button className="text-xs px-3 py-1.5 rounded-md border border-line bg-white hover:bg-surface text-navy-700">
                      Download
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <LetterModal
        open={!!letter}
        onClose={() => setLetter(null)}
        letter={letter}
      />
    </div>
  );
}
