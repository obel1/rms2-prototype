import { Link } from "react-router-dom";
import { projects as allProjects, fmtRM } from "../data/projects";
import { Card, PageHeader, StatusPill, ProgressBar } from "../components/ui";
import { useRole } from "../state/RoleContext";

export default function Projects() {
  const { role, persona } = useRole();

  const projects = (() => {
    if (role.id === "researcher") {
      return allProjects.filter((p) =>
        (p.team || []).some((t) => t.person === persona.name)
      );
    }
    if (role.id === "coe-director") {
      return allProjects.filter((p) => p.coe === persona.coe);
    }
    return allProjects;
  })();

  const title = role.id === "researcher" ? "My Projects" : "Projects";
  const subtitle =
    role.id === "researcher"
      ? "Projects where you hold a role."
      : role.id === "coe-director"
        ? `Projects under ${persona.coe}.`
        : "All research projects under RMC. Click any row to open the project detail.";

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <button className="text-sm px-3 py-2 rounded-md border border-line bg-white hover:bg-surface-2 text-navy-700">
            Export
          </button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-xs uppercase tracking-wider text-navy-500">
                  <th className="text-left font-medium px-5 py-2.5">Project ID</th>
                  <th className="text-left font-medium px-5 py-2.5">Title</th>
                  <th className="text-left font-medium px-5 py-2.5">CoE</th>
                  <th className="text-left font-medium px-5 py-2.5">PI</th>
                  <th className="text-left font-medium px-5 py-2.5">Category</th>
                  <th className="text-left font-medium px-5 py-2.5">Utilisation</th>
                  <th className="text-left font-medium px-5 py-2.5">End Date</th>
                  <th className="text-left font-medium px-5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-surface cursor-pointer"
                    onClick={(e) => {
                      if (e.target.closest("a")) return;
                      window.location.hash = `#/projects/${p.id}`;
                    }}
                  >
                    <td className="px-5 py-3 font-medium text-navy-900">
                      <Link
                        to={`/projects/${p.id}`}
                        className="hover:text-brand-700"
                      >
                        {p.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-navy-700 max-w-sm">
                      <div className="truncate">{p.title}</div>
                    </td>
                    <td className="px-5 py-3 text-navy-700">{p.coe}</td>
                    <td className="px-5 py-3 text-navy-700">{p.pi}</td>
                    <td className="px-5 py-3 text-navy-700">{p.category}</td>
                    <td className="px-5 py-3 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar
                            value={p.utilisation}
                            tone={
                              p.utilisation >= 100
                                ? "danger"
                                : p.utilisation > 80
                                  ? "warning"
                                  : "brand"
                            }
                          />
                        </div>
                        <div className="text-xs text-navy-500 w-9 text-right">
                          {p.utilisation}%
                        </div>
                      </div>
                      <div className="text-[11px] text-navy-500 mt-0.5">
                        {fmtRM(p.disbursed)} / {fmtRM(p.allocation)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-navy-700">{p.endDate}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
