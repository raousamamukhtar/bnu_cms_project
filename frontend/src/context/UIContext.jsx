import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    setToasts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), message, type, createdAt: Date.now() },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3200);
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
            className={`min-w-[220px] rounded-xl px-4 py-3 text-sm shadow-xl text-white ${
              toast.type === 'error'
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


