import { useNavigate } from 'react-router-dom';
import ProgressRing from './ProgressRing';

const CareerProgressCard = ({ roadmap }) => {
  const navigate = useNavigate();
  const weeks = roadmap?.weeks || [];
  const completed = weeks.filter((w) => w.completed).length;
  const percent = weeks.length ? Math.round((completed / weeks.length) * 100) : 0;

  const checklist = (() => {
    const topics = [];
    weeks.forEach((week) => {
      if (Array.isArray(week.topics)) {
        week.topics.forEach((topic) => topics.push({ text: typeof topic === 'string' ? topic : topic?.text || String(topic), done: !!week.completed }));
      }
    });
    return topics.slice(0, 7);
  })();

  const nextMilestone = weeks.find((week) => !week.completed) || weeks[0] || null;

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold tracking-tight text-slate-950">Career Progress</h4>
          <p className="mt-1 text-sm text-slate-500">Track your roadmap progress and next milestone.</p>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">{percent}%</div>
      </div>

      <div className="mt-5 flex items-start gap-5">
        <ProgressRing value={percent} size={136} stroke={10}>
          <div className="text-center">
            <div className="text-3xl font-semibold tracking-tight text-slate-950">{percent}%</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Career Readiness</div>
          </div>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <div className="text-sm text-slate-500">Target Role</div>
          <div className="mt-1 text-xl font-semibold text-slate-950">{roadmap?.targetRole || 'No target role set'}</div>

          <div className="mt-4 space-y-2.5">
            {checklist.length ? checklist.map((item, index) => (
              <div key={`${item.text}-${index}`} className="flex items-center gap-3 text-sm text-slate-700">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${item.done ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-300 bg-white text-slate-400'}`}>
                  {item.done ? '✓' : '○'}
                </span>
                <span className={item.done ? 'text-slate-950' : 'text-slate-600'}>{item.text}</span>
              </div>
            )) : <div className="text-sm text-slate-500">No roadmap yet. Generate one to see milestone tracking.</div>}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
        <div>
          <div className="text-sm font-medium text-slate-900">Next Milestone</div>
          <div className="mt-1 text-sm text-slate-500">{nextMilestone ? nextMilestone.title : 'Create your roadmap to get started.'}</div>
        </div>
        <button onClick={() => navigate('/roadmap')} className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
          View Full Roadmap →
        </button>
      </div>
    </div>
  );
};

export default CareerProgressCard;
