import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { translateStatus } from "@/lib/utils"

export default async function StaffDeliveryNotesPage() {
  const deliveryNotes = await prisma.deliveryNote.findMany({
    include: { provider: true, school: true },
    orderBy: { date: "desc" }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Control de Remitos</h1>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Proveedor</th>
              <th className="p-3 text-left">Escuela</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNotes.map(dn => (
              <tr key={dn.id} className="border-t">
                <td className="p-3">{new Date(dn.date).toLocaleDateString()}</td>
                <td className="p-3">{dn.provider.name}</td>
                <td className="p-3">{dn.school.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    dn.status === "SIGNED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {translateStatus(dn.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
