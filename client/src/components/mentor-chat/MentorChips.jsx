import { useNavigate } from 'react-router-dom';

const defaultPrompts = [
  'Improve my resume',
  'Prepare for an interview',
  'What skills should I learn?',
  'Review my project'
];

const MentorChips = ({ prompts = defaultPrompts }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((p, i) => (
        <button
          key={i}
          onClick={() => navigate('/mentor', { state: { prefillPrompt: p } })}
          className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default MentorChips;
