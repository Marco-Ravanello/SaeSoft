import prisma from "@/lib/prisma";
import { auth } from "@/auth"
import { translateService } from "@/lib/utils"

export default async function Page() {
  const s = await auth();
  const p = await prisma.provider.findUnique({
    where: { userId: (s?.user as any).id },
    include: {
      schools: {
        include: {
          services: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Mis Escuelas Asignadas</h1>
      <div className="grid grid-cols-1 gap-4">
        {p?.schools.map(sc => (
          <div key={sc.id} className="p-6 bg-white shadow rounded-xl border flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{sc.name}</h3>
              <div className="mt-2 space-y-1">
                {sc.services.map(svc => (
                  <p key={svc.id} className="text-sm text-slate-600">
                    <span className="font-semibold">{translateService(svc.serviceType)}:</span> {svc.quota} cupos
                  </p>
                ))}
              </div>
            </div>
            <a
              href={`/dashboard/provider/deliveries/new?schoolId=${sc.id}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Nuevo Remito
            </a>
          </div>
        ))}
        {p?.schools.length === 0 && (
          <p className="text-slate-500 italic">No tienes escuelas asignadas actualmente.</p>
        )}
      </div>
    </div>
  )
}
