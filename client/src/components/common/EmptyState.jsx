const EmptyState = ({ title, description, action }) => (
  <div className="rounded-3xl border border-white/70 bg-white p-6 text-center shadow-soft">
    <div className="text-lg font-semibold text-slate-900">{title}</div>
    {description ? <div className="mt-2 text-sm text-slate-600">{description}</div> : null}
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);

export default EmptyState;
