import { useState } from "react";

export default function PrototypeBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-amber-banner border-b border-amber-banner-border text-navy-900 text-sm">
      <div className="max-w-[1600px] mx-auto px-6 py-2.5 flex items-start gap-3">
        <span className="font-semibold tracking-wide">PROTOTYPE</span>
        <span className="flex-1 leading-snug">
          Not the live system. Mock data only; nothing is saved. For stakeholder
          review ahead of ICT development.
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-navy-700 hover:text-navy-900 px-2 leading-none text-lg"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
