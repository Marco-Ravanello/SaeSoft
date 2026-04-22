import prisma from "@/lib/prisma";
import { auth } from "@/auth"
import AssignmentForm from "./AssignmentForm"
import { translateService } from "@/lib/utils"
import { ShieldCheck, School as SchoolIcon } from "lucide-react"

export default async function Page() {
  const schools = await prisma.school.findMany({
    include: {
      provider: true,
      services: true
    },
    orderBy: { name: 'asc' }
  });
  const providers = await prisma.provider.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Gestión de Asignaciones</h1>
          <p className="text-slate-500 mt-1">Configura proveedores, tipos de institución y habilitación de servicios.</p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl flex items-center gap-2 text-xs font-bold">
          <ShieldCheck size={18} />
          Panel Administrativo
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {schools.map(s => (
          <AssignmentForm
            key={s.id}
            school={s}
            providers={providers}
            currentProviderId={s.providerId || ""}
          />
        ))}
      </div>
    </div>
  )
}
