import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export default async function SchoolDeliveriesPage() {
  const session = await auth()
  const school = await prisma.school.findUnique({
    where: { userId: (session?.user as any).id },
    include: { deliveryNotes: { include: { provider: true }, orderBy: { date: "desc" } } }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Recepción de Mercadería</h1>
      <div className="space-y-4">
        {school?.deliveryNotes.map(dn => (
          <div key={dn.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center border">
            <div>
              <p className="text-sm text-gray-500">{new Date(dn.date).toLocaleDateString()}</p>
              <h3 className="font-bold">{dn.provider.name}</h3>
              <p className="text-gray-700 mt-2">{dn.items}</p>
            </div>
            <div>
              <a href={`/dashboard/school/deliveries/${dn.id}`} className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors">
                Ver Remito
              </a>
            </div>
          </div>
        ))}
        {(!school?.deliveryNotes || school.deliveryNotes.length === 0) && <p className="text-gray-500 italic">No hay remitos pendientes.</p>}
      </div>
    </div>
  )
}
