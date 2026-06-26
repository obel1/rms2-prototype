export function FormSection({ title, description, children }) {
  return (
    <div className="bg-white border border-line rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-line">
        <div className="text-sm font-semibold text-navy-900">{title}</div>
        {description && (
          <div className="text-xs text-navy-500 mt-0.5">{description}</div>
        )}
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

export function Field({ label, hint, required, children, span = 1 }) {
  return (
    <div className={span === 2 ? "md:col-span-2" : ""}>
      <label className="block text-xs font-medium text-navy-700 mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {hint && <div className="text-[11px] text-navy-500 mt-1">{hint}</div>}
    </div>
  );
}

const inputCls =
  "w-full text-sm px-3 py-2 rounded-md border border-line bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 placeholder:text-navy-200";

export function Input(props) {
  return <input className={inputCls} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={inputCls + " pr-8"} {...props}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea rows={4} className={inputCls + " leading-relaxed"} {...props} />;
}

export function ReadOnly({ value }) {
  return (
    <div className="w-full text-sm px-3 py-2 rounded-md border border-line bg-surface text-navy-700">
      {value || "—"}
    </div>
  );
}

export function Row({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

export function SubmitBar({ onSubmit, onSave, onCancel }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-line">
      <button
        onClick={onCancel}
        className="text-sm px-4 py-2 rounded-md border border-line bg-white text-navy-700 hover:bg-surface"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="text-sm px-4 py-2 rounded-md border border-line bg-white text-navy-700 hover:bg-surface"
      >
        Save as Draft
      </button>
      <button
        onClick={onSubmit}
        className="text-sm px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
      >
        Submit for Approval
      </button>
    </div>
  );
}
