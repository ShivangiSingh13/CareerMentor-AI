import { useNavigate } from 'react-router-dom';

const NextStepCard = ({ title = 'Improve your resume ATS score', description = 'Get personalized feedback and boost your score.' }) => {
  const navigate = useNavigate();

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7"><path d="M12 3l2.7 5.48L20.8 9l-4.4 4.3 1.04 6.2L12 16.9l-5.44 2.6 1.04-6.2L3.2 9l6.1-.52L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Your next step</div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
          </div>
        </div>

        <button type="button" onClick={() => navigate('/resume')} className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl">
          Analyze Resume <span className="ml-2">→</span>
        </button>
      </div>
    </section>
  );
};

export default NextStepCard;