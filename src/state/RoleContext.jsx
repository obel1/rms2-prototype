import { createContext, useContext, useMemo, useState } from "react";
import { getPermissions, getRole, roles } from "../data/roles";

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [roleId, setRoleId] = useState("rmc-exec");

  const value = useMemo(() => {
    const role = getRole(roleId);
    const can = getPermissions(roleId);
    return { roleId, setRoleId, role, persona: role.persona, can, roles };
  }, [roleId]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used inside <RoleProvider>");
  }
  return ctx;
}
