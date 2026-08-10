const ActivityList = ({ items }) => (
  <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
    <h4 className="text-lg font-semibold text-slate-900">Recent Activity</h4>
    <ul className="mt-4 space-y-3 text-sm text-slate-700">
      {items && items.length > 0 ? (
        items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-emerald-400" />
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-xs text-slate-500">{it.when}</div>
            </div>
          </li>
        ))
      ) : (
        <li className="text-sm text-slate-500">No recent activity</li>
      )}
    </ul>
  </div>
);

export default ActivityList;
