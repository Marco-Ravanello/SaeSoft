'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Crash detected:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-red-50">
            <AlertTriangle size={32} />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-2">Algo salió mal</h1>
          <p className="text-slate-500 mb-8 font-medium">
            El sistema encontró un error inesperado al cargar la página.
          </p>

          <div className="w-full bg-slate-900 rounded-2xl p-4 mb-8 overflow-hidden">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2">
              Detalles técnicos
            </div>
            <code className="text-xs text-blue-400 block break-all font-mono">
              {error.message || 'Error desconocido'}
            </code>
            {error.digest && (
              <div className="text-[10px] text-slate-600 mt-2">
                ID: {error.digest}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
            >
              <RefreshCcw size={18} />
              Reintentar
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
            >
              <Home size={18} />
              Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
