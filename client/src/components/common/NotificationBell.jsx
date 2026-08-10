import { useEffect, useRef, useState } from 'react';
import { useToast } from './ToastProvider';
import { getUnreadCount, listNotifications, markAsRead, markAllAsRead } from '../../services/notificationApi';

const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef();
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    const loadCount = async () => {
      try {
        const res = await getUnreadCount();
        if (mounted) setCount(res.data.count || 0);
      } catch (e) {
        // ignore
      }
    };
    loadCount();
    const id = setInterval(loadCount, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const toggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      try {
        const res = await listNotifications();
        setItems(res.data || []);
        setCount(0);
      } catch (error) {
        toast.add(error.response?.data?.message || 'Failed to load notifications');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setItems((cur) => cur.map((it) => (it._id === id ? { ...it, isRead: true } : it)));
    } catch (error) {
      toast.add(error.response?.data?.message || 'Failed to mark notification read');
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setItems((cur) => cur.map((it) => ({ ...it, isRead: true })));
      setCount(0);
    } catch (error) {
      toast.add(error.response?.data?.message || 'Failed to mark all notifications read');
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={toggle} className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
        </svg>
        {count > 0 && <span className="absolute -right-1 top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">{count}</span>}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="font-semibold text-slate-950">Notifications</div>
            <button onClick={handleMarkAll} className="text-sm font-medium text-blue-600 transition hover:text-blue-700">Mark all as read</button>
          </div>
          <div className="max-h-80 overflow-auto">
            {items.length === 0 ? <div className="px-4 py-5 text-sm text-slate-500">No notifications</div> : items.map((it) => (
              <div key={it._id} className={`border-b border-slate-100 px-4 py-4 ${it.isRead ? 'bg-white' : 'bg-slate-50/80'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{it.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{it.message}</div>
                  </div>
                  <span className={`mt-0.5 inline-flex h-2.5 w-2.5 rounded-full ${it.isRead ? 'bg-slate-300' : 'bg-blue-500'}`} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  {it.linkTo ? <a href={it.linkTo} className="text-xs font-medium text-blue-600 transition hover:text-blue-700">Open</a> : <span />}
                  {!it.isRead && <button onClick={() => handleMarkAsRead(it._id)} className="text-xs font-medium text-slate-600 transition hover:text-slate-950">Mark read</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
