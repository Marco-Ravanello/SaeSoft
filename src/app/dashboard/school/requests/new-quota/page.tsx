"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewQuotaPage() {
  const [type, setType] = useState("LUNCH")
  const [quota, setQuota] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    await fetch("/api/school/quota-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceType: type, newQuota: parseInt(quota) }),
    })
    router.push("/dashboard/school/requests")
    router.refresh()
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-12">
      <h1 className="text-xl font-bold mb-8">Solicitar Cambio de Cupo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Servicio</label>
          <select className="w-full border p-2 rounded" value={type} onChange={e=>setType(e.target.value)}>
            <option value="BREAKFAST_SNACK">Desayuno y Merienda</option>
            <option value="LUNCH">Comedor</option>
            <option value="MESA_BOX">Cajas MESA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nuevo Cupo</label>
          <input type="number" className="w-full border p-2 rounded" value={quota} onChange={e=>setQuota(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">Enviar Solicitud</button>
      </form>
    </div>
  )
}
