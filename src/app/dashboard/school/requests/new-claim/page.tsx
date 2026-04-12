"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewClaimPage() {
  const [desc, setDesc] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    await fetch("/api/school/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc }),
    })
    router.push("/dashboard/school/requests")
    router.refresh()
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-12">
      <h1 className="text-xl font-bold mb-6">Cargar Reclamo / Faltante</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea className="w-full border p-2 rounded h-32" value={desc} onChange={e=>setDesc(e.target.value)} required placeholder="Ej: Faltaron 10kg de carne..." />
        </div>
        <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 font-bold">Enviar Reclamo</button>
      </form>
    </div>
  )
}
