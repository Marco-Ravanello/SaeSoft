"use client"
import { use, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import SignatureCanvas from "react-signature-canvas"

export default function SignDeliveryPage({ params }: { params: any }) {
  const { id } = use(params) as any
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sigCanvas = useRef<SignatureCanvas>(null)

  const clear = () => sigCanvas.current?.clear()

  const handleSign = async () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Por favor, realice la firma antes de continuar.")
      return
    }

    setLoading(true)
    const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png")

    try {
      const response = await fetch(`/api/school/delivery-notes/${id}/sign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: signatureData }),
      })

      if (response.ok) {
        // Redirección manual para evitar problemas de caché o proxy
        window.location.href = "/dashboard/school/deliveries"
      } else {
        alert("Error al guardar la firma")
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white space-y-6 rounded-3xl shadow-2xl mt-12 border border-slate-100">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Firma Digital</h1>
      <p className="text-slate-500 text-center mb-8">Por favor, dibuje su firma y sello en el recuadro de abajo.</p>

      <div className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50 mb-8">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "signature-canvas w-full h-64 cursor-crosshair"
          }}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={clear}
          disabled={loading}
          className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
        >
          Limpiar
        </button>
        <button
          onClick={handleSign}
          disabled={loading}
          className="flex-[2] bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-blue-300"
        >
          {loading ? "Guardando..." : "Firmar y Confirmar"}
        </button>
      </div>
    </div>
  )
}
