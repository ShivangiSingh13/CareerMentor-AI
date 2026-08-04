import { useState } from 'react';
import Layout from '../components/common/Layout';
import ResumeResultCard from '../components/resume/ResumeResultCard';
import { uploadResume } from '../services/resumeService';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please choose a PDF resume file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    setMessage('');
    try {
      const data = await uploadResume(formData);
      setResume(data.resume);
      localStorage.setItem('careermentor_latest_resume_id', data.resume._id);
      setMessage('Resume analyzed successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Resume analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Resume Analyzer" subtitle="Upload a PDF resume and receive ATS-based improvement feedback.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-950">Upload resume</h2>
          <p className="mt-2 text-sm text-slate-600">PDF only, up to 10 MB.</p>
          <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-4 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
          <button type="submit" disabled={loading} className="mt-5 rounded-2xl bg-ink px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
        <ResumeResultCard resume={resume} />
      </div>
    </Layout>
  );
};

export default ResumeAnalyzer;
