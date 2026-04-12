"use client"
import { use, useState } from "react"
import { useRouter } from "next/navigation"

export default function SignDeliveryPage({ params }: { params: any }) {
  const { id } = use(params) as any
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSign = async () => {
    setLoading(true)
    await fetch(`/api/school/delivery-notes/${id}/sign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature: "digital_signature_applied" }),
    })
    router.push("/dashboard/school/deliveries")
    router.refresh()
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow text-center mt-12">
      <h1 className="text-2xl font-bold mb-6">Firmar y Sellar Remito</h1>
      <div className="border-2 border-dashed border-gray-300 p-12 mb-6 rounded bg-gray-50 italic text-gray-400">
        Área de Firma Digital
      </div>
      <button
        onClick={handleSign}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? "Procesando..." : "Confirmar Recepción"}
      </button>
    </div>
  )
}
