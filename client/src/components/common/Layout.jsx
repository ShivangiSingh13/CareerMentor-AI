import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'}`;

const Layout = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">CareerMentor AI</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950">{title}</h1>
              {subtitle ? <p className="mt-1 max-w-2xl text-sm text-slate-600">{subtitle}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{user?.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          </div>
          <nav className="mt-5 flex flex-wrap gap-2">
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/resume" className={navLinkClass}>Resume Analyzer</NavLink>
            <NavLink to="/mentor" className={navLinkClass}>Mentor Chat</NavLink>
            <NavLink to="/roadmap" className={navLinkClass}>Roadmap</NavLink>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
