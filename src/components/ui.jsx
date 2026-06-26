export function Card({ children, className = "", as: As = "div" }) {
  return (
    <As
      className={[
        "bg-white border border-line rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className,
      ].join(" ")}
    >
      {children}
    </As>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-line">
      <div>
        <div className="text-sm font-semibold text-navy-900">{title}</div>
        {subtitle && (
          <div className="text-xs text-navy-500 mt-0.5">{subtitle}</div>
        )}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="px-8 pt-7 pb-5 flex items-end justify-between gap-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight text-navy-900">
          {title}
        </div>
        {subtitle && (
          <div className="text-sm text-navy-500 mt-1">{subtitle}</div>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

const statusStyles = {
  "on-track": "bg-green-50 text-success border-green-200",
  "due-soon": "bg-yellow-50 text-warning border-yellow-200",
  delayed: "bg-red-50 text-danger border-red-200",
  completed: "bg-navy-50 text-navy-700 border-navy-200",
  Draft: "bg-navy-50 text-navy-500 border-navy-200",
  "In Review": "bg-yellow-50 text-warning border-yellow-200",
  Approved: "bg-green-50 text-success border-green-200",
  Completed: "bg-green-50 text-success border-green-200",
  Rejected: "bg-red-50 text-danger border-red-200",
};

const statusLabel = {
  "on-track": "On Track",
  "due-soon": "Due Soon",
  delayed: "Delayed",
  completed: "Completed",
};

export function StatusPill({ status }) {
  const cls = statusStyles[status] || "bg-navy-50 text-navy-700 border-navy-200";
  const label = statusLabel[status] || status;
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border",
        cls,
      ].join(" ")}
    >
      <span
        className={[
          "w-1.5 h-1.5 rounded-full",
          status === "on-track" || status === "Approved" || status === "Completed"
            ? "bg-success"
            : status === "due-soon" || status === "In Review"
              ? "bg-warning"
              : status === "delayed" || status === "Rejected"
                ? "bg-danger"
                : "bg-navy-500",
        ].join(" ")}
      />
      {label}
    </span>
  );
}

export function ProgressBar({ value, tone = "brand" }) {
  const color =
    tone === "danger"
      ? "bg-danger"
      : tone === "warning"
        ? "bg-warning"
        : tone === "success"
          ? "bg-success"
          : "bg-brand-600";
  return (
    <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
