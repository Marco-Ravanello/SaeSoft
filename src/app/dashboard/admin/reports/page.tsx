'use client'

import { useState, useEffect } from 'react'
import { Download, FileSpreadsheet, Loader2, Filter, AlertCircle } from 'lucide-react'

export default function ExportPage() {
  const [providers, setProviders] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/assignments')
      .then(res => res.json())
      .then(data => setProviders(data.providers || []))
      .catch(() => {})
  }, [])

  const handleExport = async () => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (selectedProvider) params.append('providerId', selectedProvider)
    if (selectedMonth) params.append('month', selectedMonth)

    try {
      const res = await fetch(`/api/admin/export?${params.toString()}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `SAE_Export_${selectedMonth || 'Reporte'}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Error al generar el reporte")
      }
    } catch (error) {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Reportes de Facturación</h1>
          <p className="text-slate-500 mt-1">Genera archivos Excel con los remitos firmados para contaduría.</p>
        </div>
        <div className="bg-slate-100 p-3 rounded-2xl">
          <FileSpreadsheet className="text-slate-400" size={32} />
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Filter size={20} className="text-blue-600" />
            Filtros del Reporte
          </h2>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Proveedor</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
              >
                <option value="">Todos los Proveedores</option>
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Mes de Facturación</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl space-y-3">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <Download size={18} />
              Instrucciones de Exportación
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 ml-6 list-disc">
              <li>El reporte solo incluirá remitos con estado <strong>FIRMADO</strong>.</li>
              <li>El formato del Excel es compatible con el sistema de Contaduría Municipal.</li>
              <li>Los servicios se agruparán automáticamente por tipo de ración.</li>
            </ul>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleExport}
              disabled={loading}
              className={`px-12 py-5 rounded-3xl font-black text-lg transition-all shadow-xl flex items-center gap-3 ${
                loading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Generando Excel...
                </>
              ) : (
                <>
                  <FileSpreadsheet />
                  Descargar Reporte Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
