import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    // Prevent duplicate toasts with same message within 1 second
    setToasts((prev) => {
      const now = Date.now();
      const isDuplicate = prev.some(
        (toast) => toast.message === message && now - toast.createdAt < 1000
      );

      if (isDuplicate) {
        return prev; // Don't add duplicate
      }

      const newToast = {
        id: crypto.randomUUID(),
        message,
        type,
        createdAt: now
      };

      // Auto-remove after 3.2 seconds
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== newToast.id));
      }, 3200);

      return [...prev, newToast];
    });
  }, []);

  const value = useMemo(
    () => ({
      addToast,
    }),
    [addToast],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[220px] rounded-xl px-4 py-3 text-sm shadow-xl text-white ${toast.type === 'error'
                ? 'bg-red-500/90'
                : toast.type === 'warning'
                  ? 'bg-amber-500/90'
                  : 'bg-emerald-500/90'
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error('useUI must be used within UIProvider');
  }
  return ctx;
}


