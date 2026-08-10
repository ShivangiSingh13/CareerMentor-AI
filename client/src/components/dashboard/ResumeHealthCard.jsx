import { useNavigate } from 'react-router-dom';
import ProgressRing from './ProgressRing';

const rows = [
  { label: 'Keywords', value: 85, tone: 'bg-emerald-500' },
  { label: 'Formatting', value: 75, tone: 'bg-blue-500' },
  { label: 'Skills', value: 80, tone: 'bg-blue-500' },
  { label: 'Experience', value: 70, tone: 'bg-orange-500' },
  { label: 'Education', value: 90, tone: 'bg-emerald-500' }
];

const ResumeHealthCard = ({ resume }) => {
  const navigate = useNavigate();

  const score = resume?.atsScore ?? null;
  const recommendations = resume?.suggestions || [];
  const hasResume = score != null;

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold tracking-tight text-slate-950">Resume Health</h4>
          <p className="mt-1 text-sm text-slate-500">Your latest ATS feedback and improvement priorities.</p>
        </div>
        {hasResume ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">Good Score</span> : <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-500">No data</span>}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="flex items-center gap-4">
          <ProgressRing value={score != null ? score : 0} size={136} stroke={10}>
            <div className="text-center">
              <div className="text-3xl font-semibold tracking-tight text-slate-950">{hasResume ? `${score}/100` : '--/100'}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{hasResume ? 'Good Score' : 'No resume analyzed yet'}</div>
            </div>
          </ProgressRing>
        </div>

        <div className="space-y-4">
          {hasResume ? (
            <>
              <div className="grid gap-3">
                {rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[100px_1fr_42px] items-center gap-3 text-sm">
                    <span className="text-slate-600">{row.label}</span>
                    <div className="h-2.5 rounded-full bg-slate-100">
                      <div className={`h-2.5 rounded-full ${row.tone} transition-all`} style={{ width: `${row.value}%` }} />
                    </div>
                    <span className="text-right font-medium text-slate-700">{row.value}%</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-950">Top Recommendations</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {recommendations.slice(0, 3).length ? recommendations.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </li>
                  )) : <li className="text-slate-500">No recommendations available yet.</li>}
                </ul>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <div className="font-semibold text-slate-950">No resume analyzed yet.</div>
              <p className="mt-2">Upload your resume to get your ATS score and personalized recommendations.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => navigate('/resume')} className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">{hasResume ? 'View Full Analysis →' : 'Analyze Resume'}</button>
        <button onClick={() => navigate('/resume')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">{hasResume ? 'Upload New Resume' : 'Upload Resume'}</button>
      </div>
    </div>
  );
};

export default ResumeHealthCard;
