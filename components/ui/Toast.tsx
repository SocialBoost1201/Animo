'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

// グローバルなトースト発火用のイベントバス
const TOAST_EVENT = 'animo-toast';

export function showToast(message: string, type: ToastType = 'success') {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent<{ message: string; type: ToastType }>).detail;
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, [remove]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-sm shadow-xl text-sm max-w-sm pointer-events-auto
            animate-in slide-in-from-right-4 fade-in duration-300
            ${t.type === 'success' ? 'bg-[#171717] text-white border border-gold/30' : ''}
            ${t.type === 'error' ? 'bg-red-900 text-white border border-red-700/50' : ''}
            ${t.type === 'warning' ? 'bg-amber-900 text-white border border-amber-600/50' : ''}
          `}
        >
          <span className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 size={16} className="text-gold" />}
            {t.type === 'error' && <XCircle size={16} className="text-red-400" />}
            {t.type === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
          </span>
          <span className="flex-1 leading-relaxed">{t.message}</span>
          <button onClick={() => remove(t.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
