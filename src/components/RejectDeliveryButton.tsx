"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, X, Loader2 } from "lucide-react"

export default function RejectDeliveryButton({ deliveryId }: { deliveryId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Por favor, detalle el motivo del rechazo o los faltantes.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/school/delivery-notes/${deliveryId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })

      if (res.ok) {
        window.location.href = "/dashboard/school/deliveries"
      } else {
        alert("Error al procesar el rechazo")
        setLoading(false)
      }
    } catch (err) {
      alert("Error de conexión")
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 bg-red-50 text-red-600 p-6 rounded-2xl font-black text-xl border-2 border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
      >
        <AlertTriangle size={24} />
        RECHAZAR / RECLAMAR
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 space-y-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-red-600" />
                Reportar Problema
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                Al rechazar el remito, se generará automáticamente un <strong>reclamo formal</strong> que será enviado al área administrativa y al proveedor.
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Detalle del Faltante o Estado
                </label>
                <textarea
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-red-500 focus:ring-0 outline-none transition-colors text-slate-800"
                  placeholder="Ej: Faltaron 5kg de pan y 2 cajas de leche estaban abiertas..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                className="flex-[2] bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Confirmar Rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
