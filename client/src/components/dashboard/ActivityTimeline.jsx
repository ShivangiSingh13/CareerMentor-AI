const ActivityTimeline = ({ items }) => (
  <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
    <h4 className="text-lg font-semibold text-slate-900">Recent Activity</h4>
    <div className="mt-4 space-y-4">
      {items && items.length ? (
        items.map((it, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">•</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-800">{it.title}</div>
                <div className="text-xs text-slate-500">{it.when}</div>
              </div>
              {it.detail && <div className="mt-1 text-sm text-slate-600">{it.detail}</div>}
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-slate-500">No recent activity</div>
      )}
    </div>
  </div>
);

export default ActivityTimeline;
