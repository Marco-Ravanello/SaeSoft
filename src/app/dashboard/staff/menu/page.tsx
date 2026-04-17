import prisma from "@/lib/prisma"
import Link from "next/link"
import { Utensils, Plus } from "lucide-react"

export default async function Page() {
  const providers = await prisma.provider.findMany({
    include: {
      menus: {
        orderBy: { startDate: "desc" },
        take: 1
      }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Menús por Proveedor</h1>
        <Link
          href="/dashboard/staff/menu/new"
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-100"
        >
          <Plus size={20} />
          Nuevo Menú
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Utensils size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{p.name}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Proveedor asignado</p>
              </div>
            </div>

            {p.menus[0] ? (
              <div className="py-2">
                <p className="text-slate-600 font-medium">Menú Actual:</p>
                <p className="text-lg font-bold text-blue-600 italic">{p.menus[0].name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Válido desde {new Date(p.menus[0].startDate).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 italic py-4">Sin menú asignado actualmente.</p>
            )}

            <Link
              href="/dashboard/staff/menu/new"
              className="block text-center text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Actualizar Menú →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
