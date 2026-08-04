import { useState } from 'react';
import Layout from '../components/common/Layout';
import RoadmapWeek from '../components/common/RoadmapWeek';
import { generateRoadmap, getRoadmapById } from '../services/roadmapService';

const Roadmap = () => {
  const [form, setForm] = useState({ currentSkills: '', targetRole: '' });
  const [roadmap, setRoadmap] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await generateRoadmap(form);
      setRoadmap(data.roadmap);
      localStorage.setItem('careermentor_latest_roadmap_id', data.roadmap._id);
      setMessage('Roadmap generated successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Roadmap generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Roadmap Generator" subtitle="Create a weekly learning plan for your target role.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Generate roadmap</h2>
          <div className="mt-4 space-y-4">
            <textarea name="currentSkills" rows="4" value={form.currentSkills} onChange={handleChange} placeholder="Current skills, separated by commas" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
            <input name="targetRole" value={form.targetRole} onChange={handleChange} placeholder="Target role" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
          </div>
          {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
          <button type="submit" disabled={loading} className="mt-5 rounded-2xl bg-ink px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
            {loading ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </form>

        <div className="space-y-4">
          {roadmap ? (
            <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-slate-950">{roadmap.targetRole}</h3>
              <p className="mt-1 text-sm text-slate-500">Current skills: {(roadmap.currentSkills || []).join(', ') || 'None'}</p>
              <div className="mt-5 space-y-4">
                {(roadmap.weeks || []).map((week, index) => (
                  <RoadmapWeek key={`${week.title}-${index}`} week={week} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500 shadow-soft">
              Your generated roadmap will appear here.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Roadmap;
