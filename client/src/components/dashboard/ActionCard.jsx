import { Link } from 'react-router-dom';

const ActionCard = ({ to, title, description, cta }) => (
  <Link to={to} className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
    <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
    <p className="mt-2 text-sm text-slate-600">{description}</p>
    {cta && <div className="mt-4"><span className="inline-block rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">{cta}</span></div>}
  </Link>
);

export default ActionCard;
