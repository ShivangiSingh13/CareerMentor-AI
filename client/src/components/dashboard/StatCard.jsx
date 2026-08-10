import MiniTrend from './MiniTrend';

const StatCard = ({ label, value, note, className = '', buttonLabel, onAction, trend, icon, tone = 'blue', loading = false }) => {
  const colorClasses = tone === 'green'
    ? 'bg-emerald-50 text-emerald-600'
    : tone === 'orange'
      ? 'bg-orange-50 text-orange-600'
      : tone === 'purple'
        ? 'bg-violet-50 text-violet-600'
        : 'bg-blue-50 text-blue-600';

  return (
    <div className={`flex h-full flex-col justify-between rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {icon ? <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorClasses}`}>{icon}</div> : null}
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              {trend ? <p className="mt-1 text-xs font-medium text-emerald-600">{trend}</p> : null}
            </div>
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{loading ? 'Loading…' : value}</div>
          {note ? <p className="mt-2 text-sm text-slate-600">{note}</p> : null}
        </div>

        <div className="pt-1">
          <MiniTrend />
        </div>
      </div>

      {buttonLabel ? (
        <button type="button" onClick={onAction} className="mt-5 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50">
          {buttonLabel}
        </button>
      ) : null}
    </div>
  );
};

export default StatCard;
