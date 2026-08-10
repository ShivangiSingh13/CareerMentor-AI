import { useNavigate } from 'react-router-dom';

const prompts = ['Improve my resume', 'Prepare for an interview', 'What skills should I learn?', 'Review my project'];

const AIMentorCard = ({ onPrompt }) => {
  const navigate = useNavigate();

  return (
    <section className="flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">AI Mentor</h3>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-blue-50 to-indigo-50">
          <svg viewBox="0 0 80 80" fill="none" className="h-16 w-16">
            <circle cx="40" cy="40" r="30" fill="#eff6ff" />
            <circle cx="29" cy="34" r="4" fill="#2563eb" />
            <circle cx="51" cy="34" r="4" fill="#2563eb" />
            <path d="M29 48c4 4 18 4 22 0" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <path d="M40 10v8M62 22l-6 6M18 22l6 6" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-950">Your AI career mentor is ready!</p>
          <p className="mt-2 max-w-sm text-sm text-slate-600">Ask anything about interviews, resumes, skills, projects or career planning.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              if (onPrompt) {
                onPrompt(prompt);
                return;
              }
              navigate('/mentor', { state: { prefillPrompt: prompt } });
            }}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {prompt}
          </button>
        ))}
      </div>

      <button type="button" onClick={() => navigate('/mentor')} className="mt-auto rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5">
        Start Chat <span className="ml-2">→</span>
      </button>
    </section>
  );
};

export default AIMentorCard;