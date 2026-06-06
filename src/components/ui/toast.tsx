"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type ToastItem = { id: number; message: string; filename: string };

let toastId = 0;
let listeners: Array<(items: ToastItem[]) => void> = [];
let items: ToastItem[] = [];

function notify() {
  listeners.forEach((fn) => fn([...items]));
}

/**
 * Show a lightweight download-success toast.
 * Works from any module - no React context needed.
 */
export function showDownloadToast(filename: string, message?: string) {
  const id = ++toastId;
  items = [...items, { id, message: message ?? "Downloaded successfully", filename }];
  notify();
  window.setTimeout(() => {
    items = items.filter((item) => item.id !== id);
    notify();
  }, 3500);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((fn) => fn !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 grid gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 shadow-lg animate-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900">{toast.message}</p>
            <p className="truncate text-xs text-zinc-500">{toast.filename}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              items = items.filter((item) => item.id !== toast.id);
              notify();
            }}
            className="ml-2 shrink-0 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
