"use client"
import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ResolveClaimButton({ claimId }: { claimId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResolve = async () => {
    if (!confirm("¿Confirma que la reposición se realizó correctamente y desea cerrar el reclamo?")) return

    setLoading(true)
    try {
      const res = await fetch("/api/school/claims/resolve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: claimId, action: "RESOLVE" })
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Error al actualizar el reclamo")
      }
    } catch (e) {
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleResolve}
      disabled={loading}
      className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200 disabled:bg-green-300"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
      Marcar como Resuelto
    </button>
  )
}
