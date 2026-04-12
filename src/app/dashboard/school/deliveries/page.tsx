import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export default async function SchoolDeliveriesPage() {
  const session = await auth()
  const school = await prisma.school.findUnique({
    where: { userId: (session?.user as any).id },
    include: { deliveryNotes: { include: { provider: true }, orderBy: { date: "desc" } } }
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Recepción de Mercadería</h1>
      <div className="space-y-4">
        {school?.deliveryNotes.map(dn => (
          <div key={dn.id} className="bg-white p-6 rounded shadow flex justify-between items-center border">
            <div>
              <p className="text-sm text-gray-500">{new Date(dn.date).toLocaleDateString()}</p>
              <h3 className="font-bold">{dn.provider.name}</h3>
              <p className="text-gray-700 mt-2">{dn.items}</p>
            </div>
            <div>
              {dn.status === "PENDING" ? (
                <a href={`/dashboard/school/deliveries/${dn.id}/sign`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Ver y Firmar
                </a>
              ) : (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">FIRMADO</span>
              )}
            </div>
          </div>
        ))}
        {(!school?.deliveryNotes || school.deliveryNotes.length === 0) && <p className="text-gray-500 italic">No hay remitos pendientes.</p>}
      </div>
    </div>
  )
}
