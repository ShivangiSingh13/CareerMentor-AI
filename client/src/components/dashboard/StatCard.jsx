const StatCard = ({ label, value, note }) => (
  <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-soft">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <div className="mt-3 text-3xl font-semibold text-slate-950">{value}</div>
    {note ? <p className="mt-2 text-sm text-slate-600">{note}</p> : null}
  </div>
);

export default StatCard;
