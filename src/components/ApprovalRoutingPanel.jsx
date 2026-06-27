import { resolvePosition } from "../data/positions";

const stepStateStyles = {
  done: {
    dot: "bg-success text-white",
    border: "border-green-200 bg-green-50/40",
    label: "Approved",
    labelCls: "text-success",
  },
  current: {
    dot: "bg-brand-600 text-white ring-4 ring-brand-100",
    border: "border-brand-100 bg-brand-50/60",
    label: "Awaiting action",
    labelCls: "text-brand-700",
  },
  pending: {
    dot: "bg-white border border-line text-navy-500",
    border: "border-line bg-white",
    label: "Pending",
    labelCls: "text-navy-500",
  },
  auto: {
    dot: "bg-navy-700 text-white",
    border: "border-navy-200 bg-navy-50",
    label: "Automatic",
    labelCls: "text-navy-700",
  },
  // External = outside the in-system approval chain. Used for Finance-side
  // signature/payment blocks that happen after the system produces an
  // approved form. Rendered with dashed border and muted styling.
  external: {
    dot: "bg-white border border-dashed border-navy-300 text-navy-500",
    border: "border-dashed border-navy-200 bg-surface",
    label: "Outside system",
    labelCls: "text-navy-500 italic",
  },
};

// Step shape:
//   { positionId, action, state, note }           ← institutional (Registry)
//   { projectRole, person, action, state, note }  ← project team
//   { label, action, state, note }                ← generic / automatic / external
function resolveStep(step) {
  if (step.positionId) {
    const p = resolvePosition(step.positionId);
    return {
      title: p?.title || step.positionId,
      holder: p?.holder,
      source: "Position Registry",
      sourceTone: "brand",
    };
  }
  if (step.projectRole) {
    return {
      title: step.projectRole,
      holder: step.person || "(no current holder on this project)",
      source: "Project team — this project only",
      sourceTone: "neutral",
    };
  }
  return { title: step.label || "—", holder: null, source: null };
}

function Step({ index, step }) {
  const s = stepStateStyles[step.state || "pending"];
  const r = resolveStep(step);
  const isExternal = step.state === "external";
  return (
    <div
      className={["relative pl-9 pr-3 py-3 rounded-lg border", s.border].join(" ")}
    >
      <div
        className={[
          "absolute left-2 top-3 w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center",
          s.dot,
        ].join(" ")}
      >
        {step.state === "done"
          ? "✓"
          : step.state === "auto"
            ? "⚙"
            : step.state === "external"
              ? "⇢"
              : index}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-navy-500">
            {step.action}
          </div>
          <div
            className={[
              "text-sm font-semibold mt-0.5",
              isExternal ? "text-navy-700" : "text-navy-900",
            ].join(" ")}
          >
            {r.title}
          </div>
          {r.holder && (
            <div className="text-xs text-navy-500 mt-0.5 truncate">
              {r.holder}
            </div>
          )}
          {r.source && !isExternal && (
            <div
              className={[
                "inline-block text-[10px] mt-1 px-1.5 py-0.5 rounded border",
                r.sourceTone === "brand"
                  ? "border-brand-100 bg-brand-50 text-brand-700"
                  : "border-navy-200 bg-navy-50 text-navy-700",
              ].join(" ")}
            >
              {r.source}
            </div>
          )}
          {step.note && (
            <div className="text-[11px] text-navy-500 mt-1 leading-snug">
              {step.note}
            </div>
          )}
        </div>
        <span
          className={[
            "shrink-0 text-[10px] font-semibold uppercase tracking-wider",
            s.labelCls,
          ].join(" ")}
        >
          {s.label}
        </span>
      </div>
    </div>
  );
}

function StepsList({ steps, startIndex = 1 }) {
  return (
    <div className="p-4 space-y-2">
      {steps.map((step, i) => (
        <Step key={i} index={startIndex + i} step={step} />
      ))}
    </div>
  );
}

export default function ApprovalRoutingPanel({
  title = "Approval Routing",
  subtitle = "Resolved live from the Position Registry and this project's team",
  steps = [],
  branch,
  footer,
  handoff,
}) {
  return (
    <aside className="bg-white border border-line rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:sticky lg:top-4">
      <div className="px-5 pt-4 pb-3 border-b border-line">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-brand-600 font-semibold px-2 py-0.5 rounded-full border border-brand-100 bg-brand-50">
            Role-based
          </span>
          <div className="text-sm font-semibold text-navy-900">{title}</div>
        </div>
        <div className="text-xs text-navy-500 mt-1">{subtitle}</div>
      </div>

      <StepsList steps={steps} />

      {branch && (
        <div className="mx-4 mb-4 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
          <div className="text-[11px] uppercase tracking-wider text-warning font-semibold">
            Conditional branch
          </div>
          <div className="text-xs text-navy-700 mt-1 whitespace-pre-line leading-relaxed">
            {branch}
          </div>
        </div>
      )}

      {handoff && (
        <div className="border-t border-dashed border-line">
          <div className="px-5 pt-4 pb-1">
            <div className="text-[10px] uppercase tracking-wider text-navy-500 font-semibold">
              After approval — Finance hand-off
            </div>
            <div className="text-sm font-semibold text-navy-900 mt-0.5">
              {handoff.title || "Finance hand-off — method to be decided"}
            </div>
            {handoff.note && (
              <div className="text-xs text-navy-500 mt-1 leading-snug">
                {handoff.note}
              </div>
            )}
          </div>
          <StepsList
            steps={handoff.steps || []}
            startIndex={(steps.length || 0) + 1}
          />
        </div>
      )}

      {footer && (
        <div className="px-5 py-3 border-t border-line text-[11px] text-navy-500 leading-snug">
          {footer}
        </div>
      )}
    </aside>
  );
}
