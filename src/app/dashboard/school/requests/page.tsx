import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export default async function SchoolRequestsPage() {
  const session = await auth()
  const school = await prisma.school.findUnique({
    where: { userId: (session?.user as any).id },
    include: { quotaRequests: { orderBy: { createdAt: "desc" } }, claims: { orderBy: { createdAt: "desc" } } }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Mis Solicitudes</h1>
        <div className="flex gap-4">
          <a href="/dashboard/school/requests/new-quota" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">Nuevo Cupo</a>
          <a href="/dashboard/school/requests/new-claim" className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">Cargar Reclamo</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Historial de Cupos</h2>
          <div className="space-y-2">
            {school?.quotaRequests.map(r => (
              <div key={r.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex justify-between">
                <span>{r.serviceType}: {r.newQuota}</span>
                <span className="text-xs font-bold uppercase">{r.status}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-red-800">Historial de Reclamos</h2>
          <div className="space-y-2">
            {school?.claims.map(c => (
              <div key={c.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm">{c.description}</p>
                <p className="text-xs font-bold uppercase mt-2">{c.status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
