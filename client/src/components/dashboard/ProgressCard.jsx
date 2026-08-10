const ProgressCard = ({ title, subtitle, progress = 0, ctaText, onCta }) => (
  <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft h-full flex flex-col justify-between">
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{subtitle}</h3>
        </div>
        <div className="text-sm text-slate-500">{progress}%</div>
      </div>

      <div className="mt-4 h-3 w-full rounded bg-slate-100">
        <div className="h-3 rounded bg-emerald-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
      </div>
    </div>

    {ctaText && (
      <div className="mt-4">
        <button type="button" onClick={onCta} className="rounded-2xl bg-blue-600 px-4 py-2 text-white">{ctaText}</button>
      </div>
    )}
  </div>
);

export default ProgressCard;
