import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { translateStatus } from "@/lib/utils"
import { Calendar, Truck, School, ClipboardCheck, AlertTriangle } from "lucide-react"
import Link from "next/link"
import RejectDeliveryButton from "@/components/RejectDeliveryButton"

export default async function DeliveryNoteDetailsPage({ params }: { params: any }) {
  const session = await auth()
  const { id } = await params

  const dn = await prisma.deliveryNote.findUnique({
    where: { id },
    include: { provider: true, school: true }
  })

  if (!dn) notFound()

  // Verificación de acceso básica
  const user = (session?.user as any)
  if (user.role === "PROVIDER" && dn.provider.userId !== user.id) redirect("/dashboard")
  if (user.role === "SCHOOL" && dn.school.userId !== user.id) redirect("/dashboard")

  const shortId = dn.id.substring(dn.id.length - 6).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center no-print">
        <Link href="/dashboard/school/deliveries" className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2">
          ← Volver a entregas
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <ClipboardCheck size={18} /> Imprimir Remito
        </button>
      </div>

      {/* Papel Digital */}
      <div className="bg-white shadow-2xl rounded-sm border border-slate-200 min-h-[842px] p-12 relative overflow-hidden flex flex-col print:shadow-none print:border-none">

        {/* Marca de agua si está firmado */}
        {dn.status === "SIGNED" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-[0.03] pointer-events-none select-none">
            <h1 className="text-[180px] font-black">RECIBIDO</h1>
          </div>
        )}

        {/* Encabezado del Remito */}
        <div className="flex justify-between border-b-4 border-slate-900 pb-8 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter mb-2">REMITO</h1>
            <div className="flex items-center gap-2 text-slate-500 font-mono">
              <span className="bg-slate-900 text-white px-2 py-0.5 text-sm font-bold">Nº</span>
              <span className="text-xl tracking-widest font-bold text-slate-800">{shortId}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-slate-900 font-bold mb-1">
              <Calendar size={20} />
              <span className="text-xl">{new Date(dn.date).toLocaleDateString('es-AR')}</span>
            </div>
            <p className="text-slate-500 text-sm uppercase font-bold tracking-widest">Original - Documento Digital</p>
          </div>
        </div>

        {/* Datos de las Partes */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest border-b border-slate-100 pb-1">
              <Truck size={14} /> Proveedor
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 uppercase">{dn.provider.name}</p>
              <p className="text-slate-500 text-sm">Servicio Alimentario Escolar</p>
              <p className="text-slate-500 text-sm italic">Tres de Febrero, Buenos Aires</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest border-b border-slate-100 pb-1">
              <School size={14} /> Destinatario
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 uppercase">{dn.school.name}</p>
              <p className="text-slate-500 text-sm">Establecimiento Educativo Público</p>
            </div>
          </div>
        </div>

        {/* Cuerpo del Remito */}
        <div className="flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 text-left uppercase text-xs tracking-widest font-black">Detalle de Mercadería Entregada</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-x border-b border-slate-200">
                <td className="p-8 align-top min-h-[400px]">
                  <div className="whitespace-pre-wrap text-lg text-slate-800 leading-relaxed font-mono">
                    {dn.items}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer / Firmas */}
        <div className="mt-12 pt-12 border-t-2 border-slate-100 grid grid-cols-2 gap-12">
          <div className="border border-slate-100 p-6 rounded bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Estado del Documento</p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${dn.status === 'SIGNED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="font-black text-slate-900 uppercase tracking-tight italic">
                {translateStatus(dn.status)}
              </span>
            </div>
          </div>
          <div className="relative border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center min-h-[160px] rounded-lg">
            {dn.signature ? (
              <>
                <img src={dn.signature} alt="Firma digital" className="max-h-[120px] object-contain mb-2" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Firmado Digitalmente el</p>
                  <p className="text-xs font-black text-slate-900">{new Date(dn.signedAt!).toLocaleString('es-AR')}</p>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-300">
                <ClipboardCheck size={48} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Pendiente de Firma</p>
              </div>
            )}
            <div className="absolute -bottom-3 bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Sello de la Escuela
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción adicionales */}
      {dn.status === "PENDING" && user.role === "SCHOOL" && (
        <div className="flex gap-4 no-print">
          <Link
            href={`/dashboard/school/deliveries/${dn.id}/sign`}
            className="flex-1 bg-blue-600 text-white p-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all text-center shadow-xl shadow-blue-200"
          >
            CONFIRMAR RECEPCIÓN
          </Link>
          <RejectDeliveryButton deliveryId={dn.id} />
        </div>
      )}
    </div>
  )
}
