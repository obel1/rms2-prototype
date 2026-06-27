export default function FinanceNote() {
  return (
    <div className="rounded-lg border border-dashed border-navy-200 bg-surface px-4 py-3 text-xs text-navy-700 leading-snug">
      <span className="font-semibold text-navy-900">
        Finance delivery method not yet finalised.
      </span>{" "}
      On final approval the system produces a computer-generated, approved form.
      How it is delivered to the Finance Department (manual download, email, or
      a direct integration) is a separate decision that has not yet been made.
    </div>
  );
}

// Convenience: standard Finance hand-off block to drop into ApprovalRoutingPanel.
//
//   <ApprovalRoutingPanel
//     steps={inSystemSteps}
//     handoff={financeHandoff({ withFinanceSignatures: true })}
//   />
//
// withFinanceSignatures=true adds "Received By — Finance Manager" and
// "Verified By — Finance Director" as external post-approval steps (use for
// RA Claim and Payment Claim where the source form prints those blocks).
export function financeHandoff({ withFinanceSignatures = false } = {}) {
  const steps = [
    {
      label: "Approved form generated",
      action: "Auto-produced on final approval",
      state: "auto",
      note: "Computer-generated; forwarded to Finance manually or by prompt — integration TBD.",
    },
  ];

  if (withFinanceSignatures) {
    steps.push(
      {
        label: "Received By — Finance Manager",
        action: "Finance-side (payment processing)",
        state: "external",
        note: "Finance Department; not part of the in-system approval chain.",
      },
      {
        label: "Verified By — Finance Director",
        action: "Finance-side (payment processing)",
        state: "external",
        note: "Finance Department; not part of the in-system approval chain.",
      }
    );
  }

  return {
    title: "Finance hand-off — method to be decided",
    note: "The system does not auto-push to Finance. After final approval an approved form is generated; how it reaches Finance is undecided.",
    steps,
  };
}
