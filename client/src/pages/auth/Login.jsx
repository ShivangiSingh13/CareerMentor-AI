import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (authError) {
      setError(authError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-8 shadow-soft backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">CareerMentor AI</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Login to continue your career prep journey.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New here? <Link to="/signup" className="font-medium text-blue-700">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
