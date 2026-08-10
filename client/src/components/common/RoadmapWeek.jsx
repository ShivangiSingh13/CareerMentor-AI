import { useState } from 'react';
import { markWeekComplete } from '../../services/roadmapService';

const RoadmapWeek = ({ week, index, roadmapId }) => {
  const [completed, setCompleted] = useState(Boolean(week.completed));

  const handleComplete = async () => {
    try {
      await markWeekComplete(roadmapId, index);
      setCompleted(true);
      alert(`Week ${index + 1} marked complete`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark week complete');
    }
  };

  return (
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
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-slate-600">{completed ? 'Completed' : 'In progress'}</div>
      {!completed && <button onClick={handleComplete} className="rounded bg-ink px-3 py-1 text-white text-sm">Mark complete</button>}
    </div>
  </div>
  );
};

export default RoadmapWeek;
