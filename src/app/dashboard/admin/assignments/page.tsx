import prisma from "@/lib/prisma";
import { auth } from "@/auth"
import AssignmentForm from "./AssignmentForm"
import { translateService } from "@/lib/utils"

export default async function Page() {
  const schools = await prisma.school.findMany({
    include: {
      provider: true,
      services: true
    }
  });
  const providers = await prisma.provider.findMany()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Gestión de Asignaciones</h1>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Escuela</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Servicios y Cupos</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Proveedor Asignado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schools.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-tight">{s.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {s.services.map(svc => (
                      <div key={svc.id} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">{translateService(svc.serviceType)}:</span>
                        <span className="font-bold text-blue-600">{svc.quota}</span>
                      </div>
                    ))}
                    {s.services.length === 0 && <span className="text-xs text-slate-300 italic">Sin servicios cargados</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AssignmentForm schoolId={s.id} providers={providers} currentProviderId={s.providerId || ""} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
