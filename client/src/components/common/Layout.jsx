import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ title, subtitle, children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && isMobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, isMobile]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((value) => !value);
      return;
    }
    setSidebarCollapsed((value) => !value);
  };
  
  useEffect(() => {
    if (location.pathname === '/mock-interview' && typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`min-h-screen transition-[padding] duration-300 ease-out ${sidebarCollapsed ? 'md:pl-24' : 'md:pl-[260px]'}`}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
          <Topbar onToggleSidebar={handleToggleSidebar} />
        </header>

        <div className="px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
          {title || subtitle ? (
            <div className="mb-6 rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:px-6">
              {title ? <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1> : null}
              {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
            </div>
          ) : null}

          <main>{children}</main>
        </div>
      </div>

      {sidebarOpen && isMobile ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 cursor-default bg-slate-950/30 md:hidden"
        />
      ) : null}
    </div>
  );
};

export default Layout;
