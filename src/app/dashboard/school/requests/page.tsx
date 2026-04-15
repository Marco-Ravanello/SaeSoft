import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { translateStatus, translateService } from "@/lib/utils"

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
                <span>{translateService(r.serviceType)}: <strong>{r.newQuota}</strong></span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  r.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  r.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {translateStatus(r.status)}
                </span>
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
                <p className={`text-xs font-bold mt-2 inline-block px-2 py-1 rounded ${
                  c.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  c.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {translateStatus(c.status)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
