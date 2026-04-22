"use client"
import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react"

export default function SignDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSign = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/school/delivery-notes/${id}/sign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // No necesitamos payload de imagen
      });

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.replace("/dashboard/school/deliveries");
        }, 1500)
      } else {
        alert("Error al firmar el remito.");
        setLoading(false);
      }
    } catch (error) {
      alert("Error de conexión.");
      setLoading(false);
    }
  }

  if (!mounted) return null

  return (
    <div className="max-w-md mx-auto mt-20 p-8">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-800">
            <ShieldCheck size={40} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Validación de Firma</h1>
          <p className="text-slate-500 text-sm">
            Al hacer clic en el botón, se generará un sello digital único con tu nombre,
            usuario y marca de tiempo para validar la recepción de este remito.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-left">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs text-amber-800">
            Esta acción equivale a una firma y sello físico y quedará registrada en el sistema de auditoría del SAE.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={handleSign}
            disabled={loading || success}
            className={`w-full p-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              success
                ? "bg-green-600 text-white shadow-green-200"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 disabled:bg-slate-400"
            }`}
          >
            {loading ? "Generando Sello..." : success ? (
              <>
                <CheckCircle2 size={20} />
                ¡Remito Firmado!
              </>
            ) : "Firmar Digitalmente"}
          </button>

          <button
            onClick={() => window.history.back()}
            disabled={loading || success}
            className="w-full p-3 rounded-2xl font-medium text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-0"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
