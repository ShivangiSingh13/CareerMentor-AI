import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './ToastProvider';
import NotificationBell from './NotificationBell';

const searchTargets = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', words: ['dashboard', 'home'] },
  { key: 'resume', label: 'Resume Analyzer', to: '/resume', words: ['resume', 'ats', 'analyze resume'] },
  { key: 'mentor', label: 'AI Mentor Chat', to: '/mentor', words: ['mentor', 'chat', 'advice'] },
  { key: 'roadmap', label: 'Career Roadmap', to: '/roadmap', words: ['roadmap', 'plan', 'learning'] },
  { key: 'jobs', label: 'Job Tracker', to: '/jobs', words: ['jobs', 'applications', 'track application'] },
  { key: 'analytics', label: 'Skill Analytics', to: '/analytics', words: ['analytics', 'skills'] },
  { key: 'resources', label: 'Resources', to: '/resources', words: ['resources', 'docs', 'learn'] },
  { key: 'interview', label: 'Mock Interview', to: '/mock-interview', words: ['mock interview', 'interview', 'practice'] },
];

const Topbar = ({ onToggleSidebar }) => {
  const [q, setQ] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();
  const ref = useRef(null);

  const matches = useMemo(() => {
    const value = q.trim().toLowerCase();
    if (!value) return searchTargets.slice(0, 4);
    return searchTargets.filter((target) => target.words.some((word) => word.includes(value) || value.includes(word)) || target.label.toLowerCase().includes(value));
  }, [q]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        setOpenSearch(false);
        setOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const target = matches[0];
    if (!target) {
      toast.add('No matching page found for that search.');
      return;
    }
    navigate(target.to);
    setOpenSearch(false);
    setQ('');
  };

  const handleSelectSearch = (target) => {
    navigate(target.to);
    setOpenSearch(false);
    setQ('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div ref={ref} className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="hidden min-w-0 sm:block">
          <div className="text-sm font-medium text-slate-500">Career dashboard</div>
          <div className="truncate text-lg font-semibold tracking-tight text-slate-950">Good to see you, {user?.name || 'Shivi'}</div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <form onSubmit={handleSearch} className="relative hidden max-w-[520px] flex-1 md:block">
          <div className={`flex h-11 items-center gap-3 rounded-2xl border bg-white px-4 shadow-sm transition ${isFocused || openSearch ? 'border-blue-300 ring-4 ring-blue-100/60' : 'border-slate-200'}`}>
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <input
              value={q}
              onChange={(event) => { setQ(event.target.value); setOpenSearch(true); }}
              onFocus={() => { setOpenSearch(true); setIsFocused(true); }}
              onBlur={() => setIsFocused(false)}
              placeholder="Search for anything..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <kbd className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold tracking-wide text-slate-500">Ctrl K</kbd>
          </div>
          {openSearch && matches.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              {matches.map((target) => (
                <button key={target.key} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleSelectSearch(target)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                  <span>{target.label}</span>
                  <span className="text-xs text-slate-400">Open</span>
                </button>
              ))}
            </div>
          ) : null}
        </form>

        <div className="md:hidden">
          <button type="button" onClick={() => setOpenSearch((value) => !value)} className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50" aria-label="Open search">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <NotificationBell />

        <div className="relative">
          <button type="button" onClick={() => setOpenProfile((value) => !value)} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:bg-slate-50">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white">
              {(user?.name || 'Shivi').slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-semibold leading-none text-slate-950">{user?.name || 'Shivi'}</div>
              <div className="mt-1 text-xs text-slate-500">{user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : 'Student'}</div>
            </div>
            <svg className="hidden h-4 w-4 text-slate-500 sm:block" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          {openProfile ? (
            <div className="absolute right-0 top-[calc(100%+10px)] z-40 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="text-sm font-semibold text-slate-950">{user?.name || 'Shivi'}</div>
                <div className="text-xs text-slate-500">{user?.role ? user.role[0].toUpperCase() + user.role.slice(1) : 'Student'}</div>
              </div>
              <div className="p-2">
                <button type="button" onClick={() => { navigate('/dashboard'); setOpenProfile(false); }} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50">Dashboard</button>
                <button type="button" onClick={() => { navigate('/mentor'); setOpenProfile(false); }} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50">AI Mentor Chat</button>
                <button type="button" onClick={handleLogout} className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50">Log out</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {openSearch && matches.length === 0 ? (
        <div className="absolute left-4 right-4 top-[68px] z-40 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-[0_24px_70px_rgba(15,23,42,0.12)] md:hidden">
          No matching pages found.
        </div>
      ) : null}
    </div>
  );
};

export default Topbar;
