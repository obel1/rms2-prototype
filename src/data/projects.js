// Project roles (Principal Researcher, Co-Researcher, RA, SME, Project Lead)
// are held PER PROJECT and live on the project's team list — never in the
// Position Registry. The same person can be PI on one project and
// Co-Researcher or SME on another. A project has exactly one PI and may have
// many Co-Researchers, RAs and SMEs.

export const PROJECT_ROLES = [
  "Principal Researcher",
  "Co-Researcher",
  "Research Assistant",
  "Subject Matter Expert",
  "Project Lead",
];

export const projects = [
  {
    id: "ISRA-CRP-25-001",
    title: "Maqasid al-Shariah Index for Sustainable Finance",
    coe: "CASHiEF",
    coePositionId: "POS-COE-DIR-CASHIEF",
    allocation: 120000,
    disbursed: 84000,
    startDate: "2025-03-01",
    endDate: "2026-08-31",
    status: "on-track",
    utilisation: 70,
    category: "CRP",
    team: [
      { person: "Dr Rusni Hassan", role: "Principal Researcher" },
      { person: "Dr Aishath Muneeza", role: "Co-Researcher" },
      { person: "Dr Hafas Furqani", role: "Subject Matter Expert" },
      { person: "Aishah binti Rahmat", role: "Research Assistant" },
      { person: "Iman Ruzain", role: "Project Lead" },
    ],
  },
  {
    id: "ISRA-URP-25-014",
    title: "Sukuk Innovation for Climate Adaptation",
    coe: "ISF",
    coePositionId: "POS-COE-DIR-ISF",
    allocation: 80000,
    disbursed: 72000,
    startDate: "2025-01-15",
    endDate: "2026-07-15",
    status: "due-soon",
    utilisation: 90,
    category: "URP",
    team: [
      { person: "Prof Dr Mohamed Eskandar", role: "Principal Researcher" },
      { person: "Dr Hafas Furqani", role: "Co-Researcher" },
      { person: "Dr Mohamed Aslam", role: "Co-Researcher" },
      { person: "Nur Izzati binti Hamzah", role: "Research Assistant" },
    ],
  },
  {
    id: "ISRA-RGP-24-007",
    title: "Waqf-linked Microfinance for B40 Households",
    coe: "i-RISE",
    coePositionId: "POS-COE-DIR-IRISE",
    allocation: 65000,
    disbursed: 65000,
    startDate: "2024-10-01",
    endDate: "2026-06-15",
    status: "delayed",
    utilisation: 100,
    category: "RGP",
    team: [
      { person: "Dr Mohamed Aslam", role: "Principal Researcher" },
      { person: "Dr Rusni Hassan", role: "Subject Matter Expert" },
      { person: "Nur Izzati binti Hamzah", role: "Research Assistant" },
    ],
  },
  {
    id: "ISRA-CORP-25-003",
    title: "Tokenisation of Shariah-Compliant Assets",
    coe: "CASHiEF",
    coePositionId: "POS-COE-DIR-CASHIEF",
    allocation: 150000,
    disbursed: 28000,
    startDate: "2025-06-01",
    endDate: "2027-05-31",
    status: "on-track",
    utilisation: 19,
    category: "CoRP",
    team: [
      { person: "Dr Said Adekunle", role: "Principal Researcher" },
      { person: "Dr Hafas Furqani", role: "Subject Matter Expert" },
      { person: "Dr Aishath Muneeza", role: "Co-Researcher" },
      { person: "Hafiz bin Ahmad", role: "Research Assistant" },
    ],
  },
  {
    id: "ISRA-IRP-25-021",
    title: "Halal Supply Chain Traceability (Industry)",
    coe: "i-RISE",
    coePositionId: "POS-COE-DIR-IRISE",
    allocation: 95000,
    disbursed: 41000,
    startDate: "2025-05-01",
    endDate: "2026-11-30",
    status: "on-track",
    utilisation: 43,
    category: "IRP",
    team: [
      { person: "Dr Aishath Muneeza", role: "Principal Researcher" },
      { person: "Dr Rusni Hassan", role: "Co-Researcher" },
      { person: "Hafiz bin Ahmad", role: "Research Assistant" },
    ],
  },
  {
    id: "ISRA-URP-24-031",
    title: "AI Ethics in Islamic Wealth Management",
    coe: "ISF",
    coePositionId: "POS-COE-DIR-ISF",
    allocation: 55000,
    disbursed: 55000,
    startDate: "2024-08-01",
    endDate: "2026-05-31",
    status: "completed",
    utilisation: 100,
    category: "URP",
    team: [
      { person: "Dr Hafas Furqani", role: "Principal Researcher" },
      { person: "Dr Said Adekunle", role: "Co-Researcher" },
    ],
  },
];

export function getMember(project, role) {
  return project?.team?.find((t) => t.role === role)?.person;
}

export function getMembers(project, role) {
  return (project?.team || []).filter((t) => t.role === role).map((t) => t.person);
}

// Convenience accessor: project.pi resolves to the current Principal
// Researcher from the team. Defined as a getter so the team is the single
// source of truth.
projects.forEach((p) => {
  Object.defineProperty(p, "pi", {
    enumerable: false,
    get() {
      return getMember(this, "Principal Researcher") || "—";
    },
  });
});

export const outstandingAdvances = [
  {
    id: "ADV-2026-018",
    projectId: "ISRA-CRP-25-001",
    pi: "Dr Rusni Hassan",
    amount: 4800,
    issuedDate: "2026-04-12",
    dueDate: "2026-06-12",
    daysOverdue: 15,
  },
  {
    id: "ADV-2026-022",
    projectId: "ISRA-URP-25-014",
    pi: "Prof Dr Mohamed Eskandar",
    amount: 2500,
    issuedDate: "2026-05-02",
    dueDate: "2026-07-02",
    daysOverdue: 0,
  },
  {
    id: "ADV-2026-009",
    projectId: "ISRA-RGP-24-007",
    pi: "Dr Mohamed Aslam",
    amount: 6200,
    issuedDate: "2026-02-20",
    dueDate: "2026-04-20",
    daysOverdue: 68,
  },
];

export const submittedRequests = [
  {
    id: "REQ-2026-0142",
    projectId: "ISRA-CRP-25-001",
    documentType: "Disbursement Request",
    module: "Financial",
    submittedDate: "2026-06-21",
    status: "In Review",
  },
  {
    id: "REQ-2026-0141",
    projectId: "ISRA-URP-25-014",
    documentType: "Research Extension",
    module: "Research",
    submittedDate: "2026-06-19",
    status: "Approved",
  },
  {
    id: "REQ-2026-0140",
    projectId: "ISRA-IRP-25-021",
    documentType: "RA Application",
    module: "Research",
    submittedDate: "2026-06-18",
    status: "In Review",
  },
  {
    id: "REQ-2026-0139",
    projectId: "ISRA-CORP-25-003",
    documentType: "Travel Requisition",
    module: "Financial",
    submittedDate: "2026-06-15",
    status: "Draft",
  },
  {
    id: "REQ-2026-0138",
    projectId: "ISRA-CRP-25-001",
    documentType: "Progress Report",
    module: "Research",
    submittedDate: "2026-06-12",
    status: "Completed",
  },
  {
    id: "REQ-2026-0137",
    projectId: "ISRA-RGP-24-007",
    documentType: "Disbursement Request",
    module: "Financial",
    submittedDate: "2026-06-10",
    status: "Rejected",
  },
];

export function totals(list = projects) {
  const allocation = list.reduce((s, p) => s + p.allocation, 0);
  const disbursed = list.reduce((s, p) => s + p.disbursed, 0);
  return {
    allocation,
    disbursed,
    balance: allocation - disbursed,
    utilisation: allocation ? Math.round((disbursed / allocation) * 100) : 0,
  };
}

export function fmtRM(amount) {
  return "RM " + amount.toLocaleString("en-MY");
}
