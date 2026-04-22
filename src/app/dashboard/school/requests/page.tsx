import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { translateStatus, translateService } from "@/lib/utils"
import Link from "next/link"
import { Plus, ClipboardList, TrendingUp, AlertTriangle, History, CheckCircle2 } from "lucide-react"
import ResolveClaimButton from "@/components/ResolveClaimButton"

export default async function SchoolRequestsPage() {
  const session = await auth()
  const user: any = session?.user
  const school = await prisma.school.findUnique({
    where: { userId: user.id },
    include: {
      quotaRequests: { orderBy: { createdAt: "desc" } },
      claims: { orderBy: { createdAt: "desc" } }
    }
  })

  const pendingClaims = school?.claims.filter(c => !c.isResolvedBySchool) || []
  const resolvedClaims = school?.claims.filter(c => c.isResolvedBySchool) || []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic flex items-center gap-2">
            <ClipboardList className="text-blue-600" size={32} />
            Mis Solicitudes
          </h1>
          <p className="text-slate-500 mt-1">Gestión de cupos y reclamos de la institución.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/school/requests/new-quota" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <TrendingUp size={20} />
            Cambio de Cupos
          </Link>
          <Link href="/dashboard/school/requests/new-claim" className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
            <AlertTriangle size={20} />
            Nuevo Reclamo
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* CUPOS */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={24} />
            Historial de Cupos
          </h2>
          <div className="space-y-3">
            {school?.quotaRequests.map(r => (
              <div key={r.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{new Date(r.createdAt).toLocaleDateString('es-AR')}</span>
                  <div className="text-slate-800 font-bold">
                    {translateService(r.serviceType)}: <span className="text-blue-600 text-lg">{r.newQuota}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${
                  r.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  r.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {translateStatus(r.status)}
                </span>
              </div>
            ))}
            {school?.quotaRequests.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    No hay solicitudes de cupos registradas.
                </div>
            )}
          </div>
        </section>

        {/* RECLAMOS */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 text-red-600">
            <AlertTriangle size={24} />
            Control de Reclamos
          </h2>

          {/* Pendientes */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Pendientes y Reposiciones</h3>
            {pendingClaims.map(c => (
              <div key={c.id} className={`bg-white p-5 rounded-3xl shadow-sm border group transition-all ${
                c.isReplacementAuthorized ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString('es-AR')}</span>
                  <div className="flex gap-2 items-center">
                    {c.isReplacementAuthorized && (
                        <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse">REPOSICIÓN AUTORIZADA</span>
                    )}
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        c.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        c.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {translateStatus(c.status)}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">{c.description}</p>

                {c.isReplacementAuthorized && (
                    <div className="pt-4 border-t border-amber-100 flex justify-end">
                        <ResolveClaimButton claimId={c.id} />
                    </div>
                )}
              </div>
            ))}
            {pendingClaims.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    No tienes reclamos pendientes.
                </div>
            )}
          </div>

          {/* Historial Resueltos */}
          {resolvedClaims.length > 0 && (
              <div className="pt-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                    <History size={14} />
                    Historial de Resueltos
                </h3>
                <div className="space-y-2 opacity-60">
                    {resolvedClaims.map(c => (
                        <div key={c.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-600 truncate max-w-[70%]">{c.description}</span>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-green-600">
                                <CheckCircle2 size={12} />
                                RESUELTO
                            </div>
                        </div>
                    ))}
                </div>
              </div>
          )}
        </section>
      </div>
    </div>
  )
}
