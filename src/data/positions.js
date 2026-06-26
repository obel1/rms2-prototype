// Position Registry holds INSTITUTIONAL OFFICES only — singular posts that
// resolve to one current holder at any time. Project roles (PI, Co-Researcher,
// RA, SME, Project Lead) are NOT positions: they are held per-project and live
// on the project's team list.

export const positions = [
  {
    id: "POS-DIR-RMC",
    title: "Director, RMC",
    holder: "Dr Nur Harena Redzuan",
    effectiveFrom: "2026-01-01",
  },
  {
    id: "POS-COE-DIR-CASHIEF",
    title: "Director, CASHiEF",
    holder: "Prof Dr Said Bouheraoua",
    effectiveFrom: "2025-08-01",
  },
  {
    id: "POS-COE-DIR-ISF",
    title: "Director, ISF",
    holder: "Prof Dr Amir bin Shaharuddin",
    effectiveFrom: "2025-08-01",
  },
  {
    id: "POS-COE-DIR-IRISE",
    title: "Director, i-RISE",
    holder: "Dr Haniza Khalid",
    effectiveFrom: "2025-08-01",
  },
  {
    id: "POS-DPR",
    title: "Deputy President, Research",
    holder: "Dr Marjan Muhammad",
    effectiveFrom: "2024-09-01",
  },
  {
    id: "POS-FIN",
    title: "Finance Officer",
    holder: "Finance",
    effectiveFrom: "2025-01-01",
  },
  {
    id: "POS-RMC-EXEC",
    title: "RMC Executive",
    holder: "Iman Ruzain",
    effectiveFrom: "2025-09-01",
  },
];

export function resolvePosition(positionId, registry = positions) {
  return registry.find((p) => p.id === positionId);
}
