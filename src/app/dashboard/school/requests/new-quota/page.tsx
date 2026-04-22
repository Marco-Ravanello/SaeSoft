"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Send, Loader2, ArrowLeft } from "lucide-react"

export default function NewQuotaPage() {
  const [type, setType] = useState("")
  const [quota, setQuota] = useState("")
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Usamos el nuevo endpoint específico para servicios de la escuela
    fetch("/api/school/services")
      .then(res => res.json())
      .then(data => {
          const myServices = data.services || []
          setServices(myServices)
          if (myServices.length > 0) setType(myServices[0].serviceType)
          setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!type || !quota) return
    setLoading(true)
    try {
        const res = await fetch("/api/school/quota-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceType: type, newQuota: parseInt(quota) }),
        })
        if (res.ok) {
            router.push("/dashboard/school/requests")
            router.refresh()
        } else {
            alert("Error al enviar solicitud")
            setLoading(false)
        }
    } catch (e) {
        alert("Error de conexión")
        setLoading(false)
    }
  }

  const translate = (t: string) => {
      if (t === 'BREAKFAST_SNACK') return 'Desayuno/Merienda'
      if (t === 'LUNCH') return 'Comedor'
      if (t === 'NUTRITIONAL_REINFORCEMENT') return 'Refuerzo Nutricional'
      if (t === 'MESA_BOX') return 'Cajas MESA'
      return t
  }

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-slate-300" size={40} />
    </div>
  )

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors"
      >
        <ArrowLeft size={20} /> VOLVER
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-10 text-white space-y-2">
            <TrendingUp size={48} className="text-blue-500 mb-4" />
            <h1 className="text-3xl font-black italic tracking-tight uppercase leading-none">Solicitar Cambio <br /> de Cupos</h1>
            <p className="text-slate-400 font-medium italic">Revisión administrativa requerida.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {services.length === 0 ? (
                <div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-[2rem] text-amber-900 font-bold text-center space-y-2">
                    <p>No tienes servicios habilitados en este momento.</p>
                    <p className="text-xs uppercase opacity-60">Contacta con SAE Municipal</p>
                </div>
            ) : (
                <>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Seleccionar Servicio</label>
                    <div className="grid grid-cols-1 gap-3">
                        {services.map((s: any) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setType(s.serviceType)}
                                className={`p-5 rounded-2xl border-2 text-left transition-all flex justify-between items-center group ${
                                    type === s.serviceType
                                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xl shadow-blue-100'
                                    : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span className="font-black italic uppercase tracking-tight">{translate(s.serviceType)}</span>
                                <div className="text-right">
                                    <span className="block text-[10px] font-black opacity-30 uppercase tracking-widest">Actual</span>
                                    <span className="font-black text-lg">{s.quota}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nuevo Cupo Deseado</label>
                    <div className="relative">
                        <input
                            type="number"
                            className="w-full p-8 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 outline-none font-black text-5xl text-slate-900 placeholder:text-slate-200 transition-all text-center"
                            value={quota}
                            onChange={e=>setQuota(e.target.value)}
                            placeholder="000"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                    {loading ? "ENVIANDO..." : "CONFIRMAR PEDIDO"}
                </button>
                </>
            )}
        </form>
      </div>
    </div>
  )
}
