import { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import ChartSparkline from '../components/common/ChartSparkline';
import { getSkillAnalytics } from '../services/analyticsApi';

const SkillAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSkillAnalytics();
        setData(res.data);
      } catch (err) {
        setData(null);
      }
    };
    load();
  }, []);

  if (!data) return (
    <Layout title="Skill Analytics" subtitle="Track your top skills and gaps.">
      <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">Loading analytics...</div>
    </Layout>
  );

  const recentValues = (data.recent || []).map((d) => Math.round(d.avgScore));
  const buckets = data.buckets || [];
  const missing = data.missing || [];

  return (
    <Layout title="Skill Analytics" subtitle="Track your top skills and gaps.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Skill Overview</h3>
          <div className="mt-4 flex items-center gap-6">
            <div>
              <div className="text-4xl font-bold text-slate-900">{Math.round(data.avgScore)}</div>
              <div className="text-sm text-slate-500">average ATS score</div>
            </div>
            <div>
              <ChartSparkline values={recentValues.length ? recentValues : [0]} />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-800">Missing skills (top)</h4>
            {missing.length ? (
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {missing.map((m,i) => <li key={i} className="rounded-2xl bg-slate-50 px-3 py-2">{m._id} — {m.count}</li>)}
              </ul>
            ) : (
              <div className="mt-2 text-sm text-slate-500">No missing skills detected</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Score distribution</h3>
          <div className="mt-4 space-y-2">
            {buckets.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 text-sm text-slate-600">{b._id}</div>
                <div className="flex-1 h-3 rounded bg-slate-100">
                  <div className="h-3 rounded bg-blue-500" style={{ width: `${Math.min(100, (b.count / (data.totalResumes || 1)) * 100)}%` }} />
                </div>
                <div className="w-12 text-sm text-slate-600">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SkillAnalytics;
