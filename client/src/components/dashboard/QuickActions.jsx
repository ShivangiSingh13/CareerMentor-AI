import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 rounded-3xl border border-white/70 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900">Quick Actions</h4>
        <div className="text-sm text-slate-500">Take a quick step</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => navigate('/resume')} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:opacity-95">Analyze Resume</button>
        <button onClick={() => navigate('/mentor')} className="rounded-md bg-slate-100 px-4 py-2 text-sm text-slate-700">Ask AI Mentor</button>
        <button onClick={() => navigate('/roadmap')} className="rounded-md bg-slate-100 px-4 py-2 text-sm text-slate-700">Continue Roadmap</button>
        <button onClick={() => navigate('/jobs')} className="rounded-md bg-slate-100 px-4 py-2 text-sm text-slate-700">Track Application</button>
      </div>
    </div>
  );
};

export default QuickActions;
