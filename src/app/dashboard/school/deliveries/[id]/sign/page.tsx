"use client"
import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

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
        body: JSON.stringify({}),
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
    <div className="max-w-xl mx-auto py-20 px-6 animate-in fade-in zoom-in duration-500">
        <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-8 transition-colors"
        >
            <ArrowLeft size={20} /> CANCELAR
        </button>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 text-center space-y-8 relative overflow-hidden">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-blue-500 shadow-xl shadow-slate-200">
            <ShieldCheck size={48} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black italic text-slate-900 uppercase tracking-tight">Validación Digital</h1>
          <p className="text-slate-500 font-medium leading-relaxed px-4">
            Al confirmar, se generará un <strong>Sello de Identidad Digital</strong> único que vincula tu usuario con esta recepción.
          </p>
        </div>

        <div className="bg-amber-50 border-2 border-amber-100 rounded-[2rem] p-6 flex gap-4 text-left">
          <AlertCircle className="text-amber-600 shrink-0 mt-1" size={24} />
          <p className="text-xs text-amber-900 font-bold leading-relaxed uppercase tracking-tight">
            Esta acción tiene validez legal institucional y equivale a una firma y sello en papel. Quedará registrada en la auditoría municipal.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSign}
            disabled={loading || success}
            className={`w-full p-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 ${
              success
                ? "bg-green-600 text-white shadow-green-200"
                : "bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-1 shadow-slate-300 disabled:bg-slate-300 disabled:shadow-none"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : success ? (
              <>
                <CheckCircle2 size={24} />
                ¡REMITO FIRMADO!
              </>
            ) : "FIRMAR DIGITALMENTE"}
          </button>
        </div>
      </div>
    </div>
  )
}
