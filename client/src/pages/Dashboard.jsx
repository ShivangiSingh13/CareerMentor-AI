import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import StatCard from '../components/dashboard/StatCard';
import { useAuth } from '../context/AuthContext';
import { getResumeById } from '../services/resumeService';
import { getRoadmapById } from '../services/roadmapService';

const Dashboard = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      const resumeId = localStorage.getItem('careermentor_latest_resume_id');
      const roadmapId = localStorage.getItem('careermentor_latest_roadmap_id');

      if (resumeId) {
        try {
          const data = await getResumeById(resumeId);
          setResume(data.resume);
        } catch (_) {
          setResume(null);
        }
      }

      if (roadmapId) {
        try {
          const data = await getRoadmapById(roadmapId);
          setRoadmap(data.roadmap);
        } catch (_) {
          setRoadmap(null);
        }
      }
    };

    loadSummary();
  }, []);

  return (
    <Layout
      title={`Welcome, ${user?.name || 'Student'}`}
      subtitle="Your AI-powered career prep dashboard keeps the essentials in one place."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Latest ATS Score" value={resume ? resume.atsScore : '—'} note={resume ? 'From your latest analyzed resume' : 'No resume analyzed yet'} />
        <StatCard label="Roadmap Status" value={roadmap ? 'Generated' : 'Not generated'} note={roadmap ? roadmap.targetRole : 'Create a personalized roadmap next'} />
        <StatCard label="Student Role" value="1" note="Single-role MVP only" />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Link to="/resume" className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Resume Analyzer</h2>
          <p className="mt-2 text-sm text-slate-600">Upload a PDF resume and get ATS feedback instantly.</p>
        </Link>
        <Link to="/mentor" className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Mentor Chat</h2>
          <p className="mt-2 text-sm text-slate-600">Ask career questions and keep an ongoing AI conversation.</p>
        </Link>
        <Link to="/roadmap" className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
          <h2 className="text-lg font-semibold">Roadmap Generator</h2>
          <p className="mt-2 text-sm text-slate-600">Generate a structured weekly learning plan for your target role.</p>
        </Link>
      </section>
    </Layout>
  );
};

export default Dashboard;
