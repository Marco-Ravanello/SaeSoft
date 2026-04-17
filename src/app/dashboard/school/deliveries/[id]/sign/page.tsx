"use client"
import { use, useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [SignatureCanvas, setSignatureCanvas] = useState<any>(null)
  const sigCanvas = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
    import("react-signature-canvas").then((mod) => {
      setSignatureCanvas(() => mod.default)
    })
  }, [])

  const clear = () => sigCanvas.current?.clear()

  const handleSign = async () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Por favor, realice la firma antes de continuar.")
      return
    }

    setLoading(true)
    const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png")

    try {
      // Timeout de 15 segundos para la petición
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`/api/school/delivery-notes/${id}/sign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: signatureData }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Redirección forzada eliminando historial para asegurar que no se quede trabado
        window.location.replace("/dashboard/school/deliveries");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error al guardar: ${errorData.error || "Servidor no responde"}`);
        setLoading(false);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        alert("La conexión tardó demasiado. Por favor, intente de nuevo.");
      } else {
        alert("Error de conexión o datos demasiado pesados.");
      }
      setLoading(false);
    }
  }

  if (!mounted || !SignatureCanvas) return <div className="p-12 text-center text-slate-400">Iniciando pad de firma...</div>

  return (
    <div className="max-w-2xl mx-auto bg-white space-y-6 rounded-3xl shadow-2xl mt-12 border border-slate-100 p-8 animate-in fade-in zoom-in duration-300">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Firma Digital</h1>
      <p className="text-slate-500 text-center mb-8">Por favor, dibuje su firma y sello en el recuadro de abajo.</p>

      <div className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50 mb-8 h-64">
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
