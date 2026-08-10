import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import StatCard from '../components/dashboard/StatCard';
import CareerProgressCard from '../components/dashboard/CareerProgressCard';
import ResumeHealthCard from '../components/dashboard/ResumeHealthCard';
import DashboardHero from '../components/dashboard/DashboardHero';
import NextStepCard from '../components/dashboard/NextStepCard';
import AIMentorCard from '../components/dashboard/AIMentorCard';
import { useAuth } from '../context/AuthContext';
import { listMyApplications } from '../services/applicationApi';
import { getResumeById } from '../services/resumeService';
import { getRoadmapById } from '../services/roadmapService';
import { listInterviews } from '../services/interviewApi';

const Dashboard = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
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

      try {
        const data = await listMyApplications();
        setApplications(data.data || []);
      } catch (_) {
        setApplications([]);
      }

      try {
        const data = await listInterviews();
        setInterviews(data.interviews || []);
      } catch (_) {
        setInterviews([]);
      }

      setLoading(false);
    };

    loadSummary();
  }, []);

  const weeks = roadmap?.weeks || [];
  const progress = weeks.length ? Math.round((weeks.filter((w) => w.completed).length / weeks.length) * 100) : 0;
  const completedMilestones = weeks.filter((week) => week.completed).length;
  const totalTopics = weeks.reduce((sum, week) => sum + (Array.isArray(week.topics) ? week.topics.length : 0), 0);
  const completedTopics = weeks.reduce((sum, week) => sum + (week.completed ? (Array.isArray(week.topics) ? week.topics.length : 0) : 0), 0);
  const applicationsCount = applications.length;
  const interviewCount = applications.filter((application) => ['shortlisted', 'selected'].includes(application.status)).length;
  const latestInterview = interviews[0] || null;
  const trendSpark = useMemo(() => {
    if (!resume?.atsScore) return [18, 20, 18, 24, 22, 28, 26, 30];
    return [resume.atsScore - 18, resume.atsScore - 12, resume.atsScore - 16, resume.atsScore - 8, resume.atsScore - 10, resume.atsScore - 5, resume.atsScore - 7, resume.atsScore];
  }, [resume?.atsScore]);

  const handleMentorPrompt = (prompt) => {
    navigate('/mentor', { state: { prefillPrompt: prompt } });
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 animate-pulse">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="h-12 w-3/4 rounded-2xl bg-slate-200/70" />
              <div className="h-5 w-1/2 rounded-full bg-slate-200/70" />
            </div>
            <div className="h-[180px] rounded-[28px] bg-slate-200/70" />
          </div>
          <div className="h-28 rounded-[28px] bg-slate-200/70" />
          <div className="grid gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-40 rounded-[24px] bg-slate-200/70" />)}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[420px] rounded-[28px] bg-slate-200/70" />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHero name={user?.name || 'Shivi'} />

        <NextStepCard />

        <section className="grid gap-4 lg:grid-cols-4">
          <StatCard
            label="Latest ATS Score"
            value={resume ? `${resume.atsScore}/100` : '--/100'}
            note={resume ? 'From your latest analyzed resume' : 'No resume analyzed yet'}
            trend={resume ? '↑ 12% from last analysis' : null}
            buttonLabel={resume ? 'View Analysis' : 'Analyze Now'}
            onAction={() => navigate('/resume')}
            tone="blue"
            loading={false}
            icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3v18M6 7h12M6 17h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>}
          />

          <StatCard
            label="Roadmap Progress"
            value={roadmap ? `${progress}%` : '--'}
            note={roadmap ? `${completedMilestones} milestones completed` : 'No roadmap yet'}
            trend={roadmap ? '↑ 3 milestones completed' : null}
            buttonLabel={roadmap ? 'Continue Roadmap' : 'Generate Roadmap'}
            onAction={() => navigate('/roadmap')}
            tone="green"
            icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 19V5m0 14h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M8 15l4-5 3 3 5-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />

          <StatCard
            label="Applications"
            value={applicationsCount}
            note={interviewCount ? `${interviewCount} interview(s)` : 'No interviews yet'}
            trend={applicationsCount ? `${applicationsCount > 0 ? '' : ''}${applicationsCount}` : null}
            buttonLabel="Track Applications"
            onAction={() => navigate('/jobs')}
            tone="purple"
            icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>}
          />

          <StatCard
            label="Skills Completed"
            value={roadmap && totalTopics ? `${completedTopics}/${totalTopics}` : '--/--'}
            note={roadmap && totalTopics ? 'Completed topics from your roadmap' : 'No skills tracked yet'}
            trend={roadmap && totalTopics ? '↑ 2 completed this week' : null}
            buttonLabel="View Skills"
            onAction={() => navigate('/analytics')}
            tone="orange"
            icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 19V5m0 14h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M7 15l3-3 3 2 4-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CareerProgressCard roadmap={roadmap} />
          </div>
          <ResumeHealthCard resume={resume} />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <AIMentorCard onPrompt={handleMentorPrompt} />
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:col-span-2">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">Career Snapshot</h3>
            <p className="mt-2 text-sm text-slate-600">Your latest data updates live here as you use the platform. Resume scores, roadmap milestones, applications, and interviews all stay connected to your account.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Latest Interview</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{latestInterview ? latestInterview.role : 'No interview yet'}</div>
                <div className="mt-1 text-sm text-slate-600">{latestInterview ? `${latestInterview.type} • ${latestInterview.status}` : 'Start a mock interview to see it here.'}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Latest ATS score</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{resume ? `${resume.atsScore}/100` : '--/100'}</div>
                <div className="mt-1 text-sm text-slate-600">{resume ? 'Resume analysis complete' : 'Upload a resume to start.'}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Roadmap progress</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{roadmap ? `${progress}%` : '--'}</div>
                <div className="mt-1 text-sm text-slate-600">{roadmap ? `${completedMilestones}/${weeks.length} milestones complete` : 'Generate a roadmap to begin.'}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">AI Mentor</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">Ready</div>
                <div className="mt-1 text-sm text-slate-600">Open a guided conversation anytime.</div>
              </div>
            </div>

            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all" style={{ width: `${Math.min(100, Math.max(15, resume?.atsScore || progress || 18))}%` }} />
            </div>
          </div>
        </section>

        <div className="hidden" aria-hidden="true">{trendSpark}</div>
      </div>
    </Layout>
  );
};

export default Dashboard;
