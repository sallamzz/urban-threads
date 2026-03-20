'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

let addToastGlobal: ((message: string, type?: ToastType) => void) | null = null

export function toast(message: string, type: ToastType = 'success') {
  addToastGlobal?.(message, type)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    addToastGlobal = addToast
    return () => {
      addToastGlobal = null
    }
  }, [addToast])

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in-top',
            {
              'bg-green-800 border border-green-600 text-white': t.type === 'success',
              'bg-red-900 border border-red-700 text-white': t.type === 'error',
              'bg-navy-700 border border-navy-500 text-white': t.type === 'info',
            }
          )}
        >
          {t.type === 'success' && <CheckCircle size={18} className="text-green-400 mt-0.5 shrink-0" />}
          {t.type === 'error' && <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />}
          {t.type === 'info' && <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />}
          <p className="text-sm flex-1">{t.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-white/60 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
