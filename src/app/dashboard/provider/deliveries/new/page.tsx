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
    <div className="max-w-2xl mx-auto space-y-6 bg-white shadow rounded-3xl mt-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Nuevo Remito Digital</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Detalle de la entrega (Productos, cantidades, etc.)</label>
          <textarea
            required
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: 50L Leche, 10kg Pan, 5kg Fruta..."
            value={items}
            onChange={e => setItems(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-300"
        >
          {loading ? "Generando..." : "Generar Remito Digital"}
        </button>
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
