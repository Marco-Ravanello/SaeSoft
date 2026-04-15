import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import RequestActionButtons from "./RequestActionButtons"
import { translateService } from "@/lib/utils"

export default async function StaffRequestsPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (role !== "ADMIN" && role !== "STAFF") redirect("/dashboard")

  const quotaRequests = await prisma.quotaChangeRequest.findMany({
    where: { status: "PENDING" },
    include: { school: true },
    orderBy: { createdAt: "asc" }
  })

  const claims = await prisma.claim.findMany({
    where: { status: "PENDING" },
    include: { school: true },
    orderBy: { createdAt: "asc" }
  })

  return (
    <div className="space-y-6 space-y-12">
      <section>
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Solicitudes de Cambio de Cupo</h1>
        <div className="space-y-4">
          {quotaRequests.map(r => (
            <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 border flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{r.school.name}</p>
                <p className="text-sm text-slate-600">{translateService(r.serviceType)}: <span className="font-bold text-blue-600">{r.newQuota}</span> cupos</p>
              </div>
              <RequestActionButtons requestId={r.id} type="quota" />
            </div>
          ))}
          {quotaRequests.length === 0 && <p className="text-gray-500 italic">No hay solicitudes pendientes.</p>}
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-red-700">Reclamos y Faltantes</h1>
        <div className="space-y-4">
          {claims.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 border border-red-100 flex justify-between items-center">
              <div>
                <p className="font-bold">{c.school.name}</p>
                <p className="text-sm text-gray-700">{c.description}</p>
              </div>
              <RequestActionButtons requestId={c.id} type="claim" />
            </div>
          ))}
          {claims.length === 0 && <p className="text-gray-500 italic">No hay reclamos pendientes.</p>}
        </div>
      </section>
    </div>
  )
}
