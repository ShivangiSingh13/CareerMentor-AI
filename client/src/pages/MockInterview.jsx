import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/common/Layout';
import { getInterviewById, listInterviews, startInterview, submitAnswer } from '../services/interviewApi';

const experienceOptions = ['Fresher', '1-2 years', '3+ years'];
const typeOptions = ['HR', 'Technical', 'Behavioral'];

const initialForm = {
  role: '',
  experience: 'Fresher',
  type: 'HR',
  skills: '',
};

const MockInterview = () => {
  const [form, setForm] = useState(initialForm);
  const [interview, setInterview] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [viewingHistoryId, setViewingHistoryId] = useState(null);

  const currentQuestion = useMemo(() => interview?.questions?.[currentQuestionIndex] || null, [interview, currentQuestionIndex]);
  const isCompleted = interview?.status === 'completed';

  const loadHistory = async () => {
    try {
      const data = await listInterviews();
      setHistory(data.interviews || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleStart = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        role: form.role,
        experience: form.experience,
        type: form.type,
        skills: form.skills,
      };
      const data = await startInterview(payload);
      setInterview(data.interview);
      setCurrentQuestionIndex(0);
      setAnswer('');
      setFeedback(null);
      setViewingHistoryId(null);
      setMessage('Interview started. Answer the first question below.');
      await loadHistory();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to start interview.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!interview || !currentQuestion) return;
    setLoading(true);
    try {
      const data = await submitAnswer(interview._id, {
        questionId: currentQuestion._id,
        answer,
      });
      setInterview(data.interview);
      setFeedback({
        score: data.interview.questions[currentQuestionIndex].score,
        feedback: data.interview.questions[currentQuestionIndex].aiFeedback,
        suggestedAnswer: data.interview.questions[currentQuestionIndex].suggestedAnswer,
        improvementTips: data.interview.questions[currentQuestionIndex].improvementTips,
      });
      setAnswer('');
      setMessage('Answer submitted. Review the feedback and continue.');
      await loadHistory();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!interview) return;
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < interview.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setFeedback(null);
      setAnswer('');
    } else {
      setCurrentQuestionIndex(interview.questions.length - 1);
      setFeedback(null);
    }
  };

  const handleViewHistory = async (id) => {
    try {
      const data = await getInterviewById(id);
      setInterview(data.interview);
      setViewingHistoryId(id);
      setCurrentQuestionIndex(0);
      setFeedback(null);
      setAnswer('');
      setMessage('Viewing saved interview attempt.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load interview history.');
    }
  };

  const handleReset = () => {
    setInterview(null);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setFeedback(null);
    setViewingHistoryId(null);
    setForm(initialForm);
    setMessage('');
  };

  return (
    <Layout title="Mock Interview" subtitle="Practice interviews with AI-generated questions and feedback.">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
          {!interview ? (
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Target role</label>
                <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="e.g. Frontend Developer" required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Experience</label>
                  <select value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    {experienceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Interview type</label>
                  <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    {typeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Skills (comma-separated)</label>
                <input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="React, Node.js, MongoDB" />
              </div>
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
              <button type="submit" disabled={loading} className="rounded-2xl bg-ink px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
                {loading ? 'Starting...' : 'Start Interview'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{interview.type}</p>
                  <h2 className="text-xl font-semibold text-slate-950">{interview.role}</h2>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  Question {currentQuestionIndex + 1} of {interview.questions.length}
                </div>
              </div>

              {!isCompleted ? (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">{currentQuestion?.question}</p>
                  </div>
                  <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows="8" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Type your answer here..." />
                  {message ? <p className="text-sm text-slate-600">{message}</p> : null}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleSubmitAnswer} disabled={loading || !answer.trim()} className="rounded-2xl bg-ink px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
                      {loading ? 'Submitting...' : 'Submit Answer'}
                    </button>
                    {feedback ? (
                      <button onClick={handleNext} className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50">
                        {currentQuestionIndex + 1 < interview.questions.length ? 'Next Question' : 'Finish'}
                      </button>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-700">Overall score: {interview.overallScore}/10</p>
                    <p className="text-sm text-emerald-700">Confidence score: {interview.confidenceScore}/10</p>
                  </div>
                  <button onClick={handleReset} className="rounded-2xl bg-ink px-5 py-3 font-medium text-white transition hover:bg-slate-800">
                    Start New Interview
                  </button>
                </div>
              )}

              {feedback ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-950">AI feedback</h3>
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">{feedback.score}/10</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{feedback.feedback}</p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">Suggested answer</p>
                    <p className="mt-1 text-sm text-slate-700">{feedback.suggestedAnswer}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">Improvement tips</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {feedback.improvementTips.map((tip) => <li key={tip}>{tip}</li>)}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-950">Interview history</h2>
            <div className="mt-4 space-y-3">
              {history.length ? history.map((item) => (
                <button key={item._id} onClick={() => handleViewHistory(item._id)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700">
                  <span>
                    <span className="block font-semibold text-slate-900">{item.role}</span>
                    <span className="text-slate-500">{item.type} • {new Date(item.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{item.overallScore ?? '—'}/10</span>
                </button>
              )) : <p className="text-sm text-slate-500">No past interviews yet.</p>}
            </div>
          </div>

          {interview ? (
            <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-slate-950">Detailed review</h2>
              <div className="mt-4 space-y-3">
                {interview.questions.map((question, index) => (
                  <div key={question._id || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{question.question}</p>
                    <p className="mt-2 text-sm text-slate-600">Your answer: {question.userAnswer || 'Not answered yet'}</p>
                    {question.aiFeedback ? (
                      <>
                        <p className="mt-2 text-sm text-slate-600">Feedback: {question.aiFeedback}</p>
                        <p className="mt-2 text-sm text-slate-600">Score: {question.score}/10</p>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default MockInterview;
