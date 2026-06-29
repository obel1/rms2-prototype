import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuditContext = createContext(null);

// Seed audit entries on a few in-flight requests so the log looks lived-in.
const seed = [
  {
    id: "audit-1",
    requestKey: "DRF/ISRA-CRP-25-001",
    timestamp: "2026-06-21T09:14:00",
    actor: { name: "Dr Rusni Hassan", role: "Principal Researcher" },
    action: "submitted",
    details: "Submitted DRF for RM 8,500.",
  },
  {
    id: "audit-2",
    requestKey: "DRF/ISRA-CRP-25-001",
    timestamp: "2026-06-22T11:02:00",
    actor: { name: "Prof Dr Said Bouheraoua", role: "Director, CASHiEF" },
    action: "approved",
    details: "Recommended — within project budget.",
  },
  {
    id: "audit-3",
    requestKey: "Extension/ISRA-URP-25-014",
    timestamp: "2026-06-19T15:48:00",
    actor: { name: "Iman Ruzain", role: "RMC Executive" },
    action: "completeness-check",
    details: "All required documents attached. Logged for routing.",
  },
];

export function AuditProvider({ children }) {
  const [entries, setEntries] = useState(seed);

  const append = useCallback((entry) => {
    setEntries((prev) => [
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ]);
  }, []);

  const get = useCallback(
    (requestKey) => entries.filter((e) => e.requestKey === requestKey),
    [entries]
  );

  const value = useMemo(() => ({ entries, append, get }), [entries, append, get]);
  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) {
    throw new Error("useAudit must be used inside <AuditProvider>");
  }
  return ctx;
}
