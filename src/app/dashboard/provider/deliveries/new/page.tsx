"use client"
import { use, useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function NewDeliveryNoteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const schoolId = searchParams.get("schoolId")
  const [items, setItems] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/provider/delivery-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId, items }),
    })
    if (res.ok) {
      router.push("/dashboard/provider/deliveries")
      router.refresh()
    } else {
      alert("Error al crear el remito")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-white p-8 border border-slate-200 shadow-xl rounded-3xl mt-10">
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Nuevo Remito Digital</h1>
        <p className="text-slate-500 mt-2 font-medium">Complete los detalles de la mercadería para generar el documento.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 py-4">
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Contenido de la Entrega</label>
          <div className="relative group">
            <textarea
              required
              rows={8}
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-lg font-mono placeholder:text-slate-300"
              placeholder="Ej:&#10;50L Leche Entera&#10;10kg Pan Francés&#10;5kg Manzana Roja..."
              value={items}
              onChange={e => setItems(e.target.value)}
              disabled={loading}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
            * Se recomienda detallar producto y cantidad por línea.
          </p>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                GENERANDO DOCUMENTO...
              </span>
            ) : (
              "CREAR REMITO OFICIAL"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function NewDeliveryNotePage() {
  return (
    <Suspense fallback={<div className="space-y-6 text-center">Cargando...</div>}>
      <NewDeliveryNoteContent />
    </Suspense>
  )
}
