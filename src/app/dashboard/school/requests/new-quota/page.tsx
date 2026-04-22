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
    // Necesitamos saber qué servicios tiene habilitados la escuela para no mostrar todos
    fetch("/api/debug-session") // O un endpoint específico para el perfil de la escuela
      .then(res => res.json())
      .then(async session => {
          const userId = session.user?.id;
          // En una app real, tendríamos un endpoint /api/school/profile
          // Aquí vamos a usar el de usuarios o similar para filtrar
          const res = await fetch("/api/admin/users")
          const users = await res.json()
          const myUser = users.find((u: any) => u.id === userId)
          const myServices = myUser?.school?.services || []
          setServices(myServices)
          if (myServices.length > 0) setType(myServices[0].serviceType)
          setFetching(false)
      })
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/school/quota-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceType: type, newQuota: parseInt(quota) }),
    })
    router.push("/dashboard/school/requests")
    router.refresh()
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
            <p className="text-slate-400 font-medium">Esta solicitud será revisada por el personal administrativo.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {services.length === 0 ? (
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl text-amber-800 text-sm font-bold text-center">
                    No tienes servicios habilitados. Contacta a la administración.
                </div>
            ) : (
                <>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Seleccionar Servicio</label>
                    <div className="grid grid-cols-1 gap-3">
                        {services.map((s: any) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setType(s.serviceType)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${
                                    type === s.serviceType
                                    ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-lg shadow-blue-100'
                                    : 'border-slate-100 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <span className="font-bold">{translate(s.serviceType)}</span>
                                <span className="text-xs font-black opacity-40 uppercase">Actual: {s.quota}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nuevo Cupo Solicitado</label>
                    <input
                        type="number"
                        className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-blue-500/20 outline-none font-black text-3xl text-slate-900 placeholder:text-slate-200"
                        value={quota}
                        onChange={e=>setQuota(e.target.value)}
                        placeholder="000"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:bg-slate-300"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Send />}
                    {loading ? "ENVIANDO..." : "ENVIAR SOLICITUD"}
                </button>
                </>
            )}
        </form>
      </div>
    </div>
  )
}
