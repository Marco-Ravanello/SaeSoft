import prisma from "@/lib/prisma"
export default async function Page() {
  const m = await prisma.menu.findFirst({ orderBy: { startDate: "desc" } })
  return (<div className="p-8"><h1 className="text-2xl font-bold mb-4">Menú Semanal</h1>{m ? <p>{m.name}</p> : <p>No hay menú.</p>}<a href="/dashboard/staff/menu/new" className="bg-green-600 text-white p-2 rounded inline-block mt-4">Nuevo Menú</a></div>)
}
