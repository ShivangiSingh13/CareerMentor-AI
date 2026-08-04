const RoadmapWeek = ({ week, index }) => (
  <div className="relative rounded-3xl border border-white/70 bg-white p-5 shadow-soft">
    <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
      Week {index + 1}
    </div>
    <h3 className="text-lg font-semibold text-slate-950">{week.title}</h3>
    <ul className="mt-3 space-y-2 text-sm text-slate-700">
      {(week.topics || []).map((topic) => (
        <li key={topic} className="rounded-2xl bg-slate-50 px-3 py-2">{topic}</li>
      ))}
    </ul>
    {(week.resources || []).length > 0 ? (
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">Resources</p>
        <ul className="mt-2 space-y-2 text-sm text-blue-700">
          {week.resources.map((resource) => (
            <li key={resource} className="break-all rounded-2xl bg-blue-50 px-3 py-2">{resource}</li>
          ))}
        </ul>
      </div>
    ) : null}
  </div>
);

export default RoadmapWeek;
