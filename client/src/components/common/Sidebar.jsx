import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const iconStroke = 'currentColor';

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 11.5V20h6v-8.5H4Zm10 0V4h6v16h-6v-8.5Z" stroke={iconStroke} strokeWidth="1.7" strokeLinejoin="round" /><path d="M4 4h6v4H4V4Zm10 8.5h6" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  resume: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke={iconStroke} strokeWidth="1.7" strokeLinejoin="round" /><path d="M14 3v5h5" stroke={iconStroke} strokeWidth="1.7" strokeLinejoin="round" /><path d="M9 13h6M9 16h6M9 10h3" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  mentor: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3a7 7 0 1 0 7 7 7 7 0 0 0-7-7Z" stroke={iconStroke} strokeWidth="1.7" /><path d="M9.5 11.5c.5-.9 1.4-1.5 2.5-1.5s2 .6 2.5 1.5" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /><path d="M9.25 8.75h.01M14.75 8.75h.01" stroke={iconStroke} strokeWidth="2.4" strokeLinecap="round" /><path d="M8.5 15.5 6 19m9.5-3.5 2.5 3.5" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  roadmap: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6 18V6m6 12V9m6 9V4" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /><path d="M6 6l6 3 6-5" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  jobs: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /><path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke={iconStroke} strokeWidth="1.7" strokeLinejoin="round" /><path d="M4 12h16" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 19V5m0 14h16" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /><path d="M8 16v-5m4 5V8m4 8v-3" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  resources: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M7 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 8h8M9 12h8M9 16h5" stroke={iconStroke} strokeWidth="1.7" strokeLinecap="round" /></svg>
  )
};

const Item = ({ to, children, icon, collapsed, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.12)]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'} ${collapsed ? 'justify-center px-2' : ''}`
    }
  >
    <span className="text-current">{icon}</span>
    <span className={`${collapsed ? 'hidden' : 'block'} whitespace-nowrap`}>{children}</span>
  </NavLink>
);

const Sidebar = ({ open = false, collapsed = false, onClose }) => {
  const { user } = useAuth();
  return (
    <aside
      aria-label="Sidebar"
      className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform duration-300 ease-out md:translate-x-0 ${collapsed ? 'md:w-24' : 'md:w-[260px]'} ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className={`flex h-16 items-center gap-3 border-b border-slate-200/70 px-5 ${collapsed ? 'md:justify-center md:px-3' : ''}`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-600/20">
          <span className="text-sm font-semibold">C</span>
        </div>
        <div className={`${collapsed ? 'md:hidden' : ''}`}>
          <div className="text-base font-semibold tracking-tight text-slate-950">CareerMentor AI</div>
          <div className="text-xs text-slate-500">Career platform</div>
        </div>
        <button type="button" aria-label="Close sidebar" onClick={onClose} className="ml-auto rounded-full p-2 text-slate-500 hover:bg-slate-100 md:hidden">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4 md:px-4">
        <Item to="/dashboard" end icon={icons.dashboard} collapsed={collapsed}>Dashboard</Item>
        <Item to="/resume" icon={icons.resume} collapsed={collapsed}>Resume Analyzer</Item>
        <Item to="/mentor" icon={icons.mentor} collapsed={collapsed}>AI Mentor Chat</Item>
        <Item to="/roadmap" icon={icons.roadmap} collapsed={collapsed}>Career Roadmap</Item>
        <Item to="/mock-interview" icon={icons.mentor} collapsed={collapsed}>Mock Interview</Item>
        <Item to="/jobs" icon={icons.jobs} collapsed={collapsed}>Job Tracker</Item>
        <Item to="/analytics" icon={icons.analytics} collapsed={collapsed}>Skill Analytics</Item>
        <Item to="/resources" icon={icons.resources} collapsed={collapsed}>Resources</Item>
        {user?.role === 'recruiter' && <Item to="/admin">Admin</Item>}
      </nav>

      <div className="space-y-3 border-t border-slate-200/70 p-4">
        <div className={`space-y-2 ${collapsed ? 'md:hidden' : ''}`}>
          <button type="button" className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">⚙</span>
            Settings
          </button>
          <button type="button" className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">?</span>
            Help &amp; Support
          </button>
        </div>

        <div className={`${collapsed ? 'md:hidden' : ''} rounded-2xl border border-slate-200/80 bg-slate-50 p-4`}>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700">{(user?.name || 'S').slice(0, 1).toUpperCase()}</div>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-950">{user?.name || 'Student'}</div>
              <div className="text-xs text-slate-500">{user?.role || 'Student'}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
