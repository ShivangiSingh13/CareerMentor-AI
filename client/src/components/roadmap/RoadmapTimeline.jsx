import { useState } from 'react';

const RoadmapTimeline = ({ weeks = [], onOpenMilestone }) => {
  return (
    <div className="space-y-4">
      {weeks.map((w, i) => (
        <div key={i} className={`flex items-start gap-4 ${w.completed ? 'opacity-80' : ''}`}>
          <div className="flex flex-col items-center">
            <div className={`h-4 w-4 rounded-full ${w.completed ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            {i < weeks.length - 1 && <div className="h-full w-px bg-slate-200" style={{ minHeight: 40 }} />}
          </div>
          <div className="flex-1 rounded-2xl border border-white/70 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">{w.title}</div>
                <div className="text-sm text-slate-500">Week {i + 1} • {w.topics?.length || 0} topics</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-slate-500">{w.completed ? 'Completed' : 'In progress'}</div>
                <button onClick={() => onOpenMilestone(i)} className="rounded-md bg-slate-100 px-3 py-1 text-sm">View</button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(w.topics || []).slice(0,4).map((t, idx) => (
                <span key={idx} className="rounded-md bg-slate-50 px-3 py-1 text-sm text-slate-700">{t}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapTimeline;
