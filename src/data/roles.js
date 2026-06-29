// Roles are a prototype device for demoing different perspectives without
// needing separate logins. Each role carries a persona (the identity the
// viewer is acting as) and a permissions object the rest of the app reads to
// decide what to show.

export const roles = [
  {
    id: "researcher",
    label: "Researcher (PI)",
    persona: {
      name: "Dr Rusni Hassan",
      title: "Principal Researcher",
      // PI on this project per src/data/projects.js team
      projectIds: ["ISRA-CRP-25-001"],
    },
  },
  {
    id: "rmc-exec",
    label: "RMC Executive",
    persona: {
      name: "Iman Ruzain",
      title: "RMC Executive",
      positionId: "POS-RMC-EXEC",
    },
  },
  {
    id: "coe-director",
    label: "CoE Director (i-RISE)",
    persona: {
      name: "Dr Haniza Khalid",
      title: "Director, i-RISE",
      positionId: "POS-COE-DIR-IRISE",
      coe: "i-RISE",
    },
  },
  {
    id: "dir-rmc",
    label: "Director RMC",
    persona: {
      name: "Dr Nur Harena Redzuan",
      title: "Director, RMC",
      positionId: "POS-DIR-RMC",
    },
  },
  {
    id: "finance",
    label: "Finance",
    persona: {
      name: "Finance",
      title: "Finance Officer",
      positionId: "POS-FIN",
    },
  },
];

// Permissions per role. The sidebar reads `sidebar` to gate items; pages read
// individual flags (override, allProjects, etc.) to gate behaviour.
export const permissionsByRole = {
  researcher: {
    sidebar: {
      dashboard: true,
      requests: false,
      submit: true,
      myProjects: true,
      myLetters: true,
      projects: false,
      approvals: false,
      financeHandoff: false,
      controlSheet: false,
      positionRegistry: false,
    },
    override: false,
    allProjects: false,
    isAdmin: false,
  },
  "rmc-exec": {
    sidebar: {
      dashboard: true,
      requests: true,
      submit: true,
      myProjects: false,
      myLetters: false,
      projects: true,
      approvals: true,
      financeHandoff: true,
      controlSheet: true,
      positionRegistry: true,
    },
    override: true,
    allProjects: true,
    isAdmin: true,
  },
  "coe-director": {
    sidebar: {
      dashboard: true,
      requests: false,
      submit: false,
      myProjects: false,
      myLetters: false,
      projects: true,
      approvals: true,
      financeHandoff: false,
      controlSheet: false,
      positionRegistry: false,
    },
    override: false,
    allProjects: false,
    isAdmin: false,
  },
  "dir-rmc": {
    sidebar: {
      dashboard: true,
      requests: true,
      submit: false,
      myProjects: false,
      myLetters: false,
      projects: true,
      approvals: true,
      financeHandoff: true,
      controlSheet: true,
      positionRegistry: true,
    },
    override: true,
    allProjects: true,
    isAdmin: true,
  },
  finance: {
    sidebar: {
      dashboard: true,
      requests: false,
      submit: false,
      myProjects: false,
      myLetters: false,
      projects: false,
      approvals: false,
      financeHandoff: true,
      controlSheet: true,
      positionRegistry: false,
    },
    override: false,
    allProjects: false,
    isAdmin: false,
  },
};

export function getRole(id) {
  return roles.find((r) => r.id === id);
}

export function getPermissions(roleId) {
  return permissionsByRole[roleId] || permissionsByRole["rmc-exec"];
}
