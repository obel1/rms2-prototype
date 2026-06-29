import { useEffect, useState } from "react";

export default function OverrideModal({ open, onClose, onSubmit, currentStep }) {
  const [kind, setKind] = useState("reassign");
  const [newHolder, setNewHolder] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setKind("reassign");
      setNewHolder("");
      setReason("");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit =
    reason.trim().length > 0 && (kind !== "reassign" || newHolder.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]">
        <div className="px-5 py-4 border-b border-line">
          <div className="text-[10px] uppercase tracking-wider text-warning font-semibold">
            Admin override
          </div>
          <div className="text-base font-semibold text-navy-900 mt-0.5">
            Override approval step
          </div>
          <div className="text-xs text-navy-500 mt-1">
            Current step:{" "}
            <span className="font-medium text-navy-900">
              {currentStep?.title || "—"}
            </span>
            {currentStep?.holder ? ` · ${currentStep.holder}` : ""}
          </div>
        </div>

        <div className="px-5 py-4 overflow-y-auto space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-navy-700">
              Action
            </legend>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="overrideKind"
                value="reassign"
                checked={kind === "reassign"}
                onChange={() => setKind("reassign")}
                className="mt-1 accent-brand-600"
              />
              <span>
                <span className="block text-sm text-navy-900 font-medium">
                  Reassign step
                </span>
                <span className="block text-xs text-navy-500">
                  Send the step to a different holder instead of the current
                  one.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="overrideKind"
                value="force-advance"
                checked={kind === "force-advance"}
                onChange={() => setKind("force-advance")}
                className="mt-1 accent-brand-600"
              />
              <span>
                <span className="block text-sm text-navy-900 font-medium">
                  Force-advance step
                </span>
                <span className="block text-xs text-navy-500">
                  Treat the step as approved and move to the next step.
                </span>
              </span>
            </label>
          </fieldset>

          {kind === "reassign" && (
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">
                New holder <span className="text-danger">*</span>
              </label>
              <input
                value={newHolder}
                onChange={(e) => setNewHolder(e.target.value)}
                placeholder="e.g. Dr Najmi Hayati"
                className="w-full text-sm px-3 py-2 rounded-md border border-line bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">
              Reason (required) <span className="text-danger">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="State the reason for this override. It will be written to the audit log against this request."
              className="w-full text-sm px-3 py-2 rounded-md border border-line bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <div className="text-[11px] text-navy-500 mt-1 leading-snug">
              Every override is recorded. The audit entry captures the actor,
              timestamp, previous holder/state, new holder/state, and this
              reason.
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-[11px] text-navy-700 leading-snug">
            <span className="font-semibold text-warning">Provisional —</span>{" "}
            override authority shown here is a placeholder pending RMC
            governance sign-off (CONFIRM who may override whom).
          </div>
        </div>

        <div className="px-5 py-3 border-t border-line flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm px-3 py-2 rounded-md border border-line bg-white text-navy-700 hover:bg-surface"
          >
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => {
              onSubmit({
                kind,
                newHolder: kind === "reassign" ? newHolder.trim() : null,
                reason: reason.trim(),
              });
              onClose?.();
            }}
            className={[
              "text-sm px-3 py-2 rounded-md",
              canSubmit
                ? "bg-warning text-white hover:opacity-90"
                : "bg-yellow-100 text-yellow-700 cursor-not-allowed",
            ].join(" ")}
          >
            Record override
          </button>
        </div>
      </div>
    </div>
  );
}
