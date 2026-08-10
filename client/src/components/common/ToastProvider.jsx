import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, opts = {}) => {
    const id = Date.now().toString();
    setToasts((t) => [...t, { id, message, ...opts }]);
    if (!opts.persistent) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 4000);
  }, []);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow">{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
