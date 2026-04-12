import prisma from "@/lib/prisma"; import { auth } from "@/auth"
export default async function Page() {
  const s = await auth(); const p = await prisma.provider.findUnique({ where: { userId: (s?.user as any).id }, include: { schools: true } })
  return (<div className="p-8"><h1 className="text-2xl font-bold mb-4">Mis Escuelas</h1>{p?.schools.map(sc=>(<div key={sc.id} className="p-4 bg-white shadow mb-2">{sc.name} <a href={`/dashboard/provider/deliveries/new?schoolId=${sc.id}`} className="text-blue-600 ml-4 underline">Nuevo Remito</a></div>))}</div>)
}
