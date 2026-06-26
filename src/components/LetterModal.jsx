import { useEffect } from "react";

const letterPresets = {
  "LOA-Researcher": {
    title: "Letter of Award — Researcher",
    subject: "Appointment as Principal Researcher",
    honorariumLabel: "Researcher honorarium",
  },
  "LOA-SME": {
    title: "Letter of Award — SME",
    subject: "Appointment as Subject Matter Expert",
    honorariumLabel: "SME honorarium",
  },
  "LOA-RA": {
    title: "Letter of Award — Research Assistant",
    subject: "Appointment as Research Assistant",
    honorariumLabel: "Monthly stipend",
  },
  "LOA-TextbookReviewer": {
    title: "Letter of Award — Textbook Reviewer",
    subject: "Engagement as Textbook Reviewer",
    honorariumLabel: "Reviewer honorarium",
  },
  "LOA-TextbookWriter": {
    title: "Letter of Award — Textbook Writer",
    subject: "Engagement as Textbook Writer",
    honorariumLabel: "Writer honorarium",
  },
  "LOA-TextbookPLTM": {
    title: "Letter of Award — Textbook Project Lead / Team Member",
    subject: "Engagement on Textbook Project (PL/TM)",
    honorariumLabel: "Honorarium",
  },
  "LOE-Proofreader": {
    title: "Letter of Engagement — Proofreader",
    subject: "Engagement as Proofreader",
    honorariumLabel: "Proofreading fee",
  },
  RegistrationLetter: {
    title: "Project Registration Letter",
    subject: "Registration of Research Project",
    honorariumLabel: null,
  },
  LetterOfUndertaking: {
    title: "Letter of Undertaking",
    subject: "Undertaking by Principal Researcher",
    honorariumLabel: null,
  },
  SuccessfulCompletionLetter: {
    title: "Successful Completion Letter",
    subject: "Successful Completion of Research Project",
    honorariumLabel: null,
  },
};

export default function LetterModal({ open, onClose, letter }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !letter) return null;

  const preset = letterPresets[letter.type] || {
    title: letter.type,
    subject: "Notice",
    honorariumLabel: null,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-navy-900/50 backdrop-blur-sm">
      <div className="m-6 my-8 w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[calc(100vh-4rem)]">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-brand-600 font-semibold">
              {letter.type} · auto-generated
            </div>
            <div className="text-base font-semibold text-navy-900 mt-0.5">
              {preset.title}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs px-3 py-1.5 rounded-md border border-line bg-white hover:bg-surface text-navy-700">
              Download PDF
            </button>
            <button className="text-xs px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">
              Send Email
            </button>
            <button
              onClick={onClose}
              className="ml-1 text-navy-500 hover:text-navy-900 text-xl leading-none px-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-10 py-8 overflow-y-auto text-sm text-navy-900 font-serif leading-relaxed">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b border-line pb-4 mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-navy-500">
                Confidential
              </div>
              <div className="font-semibold text-navy-900 text-lg mt-1">
                ISRA Institute · INCEIF University
              </div>
              <div className="text-xs text-navy-500">
                Research Management Centre (RMC)
              </div>
            </div>
            <div className="text-right text-xs text-navy-500">
              <div>
                Ref:{" "}
                <span className="text-navy-900 font-medium">
                  {letter.refNo || "ISRA/RMC/2026/—"}
                </span>
              </div>
              <div>
                Date:{" "}
                <span className="text-navy-900">
                  {letter.date || "27 June 2026"}
                </span>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="mb-4">
            <div className="font-medium">{letter.recipientName || "—"}</div>
            <div className="text-xs text-navy-500 whitespace-pre-line">
              {letter.recipientAddress || "Recipient address line 1\nRecipient address line 2"}
            </div>
          </div>

          <div className="font-semibold mb-2">Dear {letter.salutation || "Sir/Madam"},</div>
          <div className="font-semibold underline mb-3">{preset.subject}</div>

          <p className="mb-3">
            With reference to the above matter, ISRA Institute · INCEIF University
            is pleased to formally extend this engagement in respect of the
            project detailed below.
          </p>

          {/* Project table */}
          <table className="w-full text-xs border-collapse mb-4">
            <tbody>
              <tr className="border border-line">
                <td className="px-3 py-2 bg-surface w-1/3 font-medium">
                  Project ID
                </td>
                <td className="px-3 py-2 border-l border-line">
                  {letter.projectId || "—"}
                </td>
              </tr>
              <tr className="border border-line">
                <td className="px-3 py-2 bg-surface font-medium">
                  Project Title
                </td>
                <td className="px-3 py-2 border-l border-line">
                  {letter.projectTitle || "—"}
                </td>
              </tr>
              <tr className="border border-line">
                <td className="px-3 py-2 bg-surface font-medium">Role</td>
                <td className="px-3 py-2 border-l border-line">
                  {letter.role || "—"}
                </td>
              </tr>
              <tr className="border border-line">
                <td className="px-3 py-2 bg-surface font-medium">Duration</td>
                <td className="px-3 py-2 border-l border-line">
                  {letter.duration || "—"}
                </td>
              </tr>
            </tbody>
          </table>

          {preset.honorariumLabel && (
            <>
              <div className="font-semibold mt-4 mb-2">Honorarium</div>
              <table className="w-full text-xs border-collapse mb-4">
                <thead>
                  <tr className="bg-surface text-navy-500 uppercase tracking-wider text-[10px]">
                    <th className="px-3 py-2 text-left border border-line">
                      Item
                    </th>
                    <th className="px-3 py-2 text-right border border-line">
                      Amount (RM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-line">
                    <td className="px-3 py-2 border border-line">
                      {preset.honorariumLabel}
                    </td>
                    <td className="px-3 py-2 border border-line text-right">
                      {(letter.honorarium || 0).toLocaleString("en-MY", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="border border-line bg-surface">
                    <td className="px-3 py-2 border border-line font-semibold">
                      Total
                    </td>
                    <td className="px-3 py-2 border border-line text-right font-semibold">
                      {(letter.honorarium || 0).toLocaleString("en-MY", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          <p className="mb-3">
            Kindly review the terms of engagement and acknowledge your
            acceptance by signing and returning a copy of this letter to the
            Research Management Centre (RMC) within fourteen (14) days from the
            date hereof.
          </p>

          <p className="mb-6">
            We look forward to your contribution to the success of this
            initiative.
          </p>

          <div className="mb-1">Yours sincerely,</div>
          <div className="mt-10">
            <div className="font-semibold">
              {letter.signatoryName || "Dr Nur Harena Redzuan"}
            </div>
            <div className="text-xs text-navy-500">
              {letter.signatoryTitle || "Director, Research Management Centre"}
            </div>
            <div className="text-xs text-navy-500">
              ISRA Institute · INCEIF University
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-line text-[11px] text-navy-500 italic">
            This is a computer-generated letter. No signature is required.
          </div>
        </div>
      </div>
    </div>
  );
}
