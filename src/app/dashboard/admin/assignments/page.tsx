import prisma from "@/lib/prisma"; import { auth } from "@/auth"
import AssignmentForm from "./AssignmentForm"
export default async function Page() {
  const schools = await prisma.school.findMany({ include: { provider: true } }); const providers = await prisma.provider.findMany()
  return (
    <div><h1 className="text-3xl font-bold text-slate-900 mb-8">Asignaciones</h1>
      <table className="min-w-full bg-white shadow rounded"><thead><tr className="bg-slate-50"><th className="p-3 text-left">Escuela</th><th className="p-3 text-left">Proveedor</th></tr></thead>
      <tbody>{schools.map(s=>(<tr key={s.id} className="border-t"><td className="p-3">{s.name}</td><td className="p-3"><AssignmentForm schoolId={s.id} providers={providers} currentProviderId={s.providerId || ""} /></td></tr>))}</tbody></table>
    </div>
  )
}
