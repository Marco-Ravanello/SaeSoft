'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, School, PackageSearch, Loader2 } from 'lucide-react'

export default function ProviderClaimsPage() {
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/provider/claims')
      .then(res => res.json())
      .then(data => {
        setClaims(data.claims || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-slate-400" size={40} />
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Reposiciones Pendientes</h1>
        <p className="text-slate-500 mt-1">Reclamos aprobados que requieren tu atención inmediata.</p>
      </header>

      {claims.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <PackageSearch size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">¡Todo al día!</h3>
          <p className="text-slate-500">No tienes reclamos aprobados pendientes de reposición.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-tight">{claim.school.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(claim.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Aprobado
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm text-slate-700 font-medium">{claim.description}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <PackageSearch size={14} />
                <span>Debe realizarse la reposición a la brevedad.</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
