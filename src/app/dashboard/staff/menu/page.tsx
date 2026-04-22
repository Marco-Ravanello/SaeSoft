import prisma from "@/lib/prisma"
import Link from "next/link"
import { Utensils, Plus, ChevronRight, Calendar, Filter } from "lucide-react"
import { translateService, translateSchoolType } from "@/lib/utils"

export default async function Page() {
  const menus = await prisma.menu.findMany({
    include: {
      provider: true
    },
    orderBy: { startDate: "desc" }
  })

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Gestión de Menús</h1>
          <p className="text-slate-500 font-medium mt-1 italic">Administra los planes alimentarios por proveedor y tipo de institución.</p>
        </div>
        <Link
          href="/dashboard/staff/menu/new"
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200"
        >
          <Plus size={18} />
          CREAR NUEVO MENÚ
        </Link>
      </header>

      {menus.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
              <Utensils size={64} className="text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-400 italic">No hay menús registrados.</h3>
              <p className="text-slate-400 mt-2">Comienza creando un menú para un proveedor.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {menus.map(m => (
            <div key={m.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] block mb-1">
                        {translateService(m.category)}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 italic uppercase leading-none">{m.name}</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2 mt-2">
                        <Utensils size={14} /> {m.provider.name}
                    </p>
                  </div>
                  <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg">
                      <Calendar size={20} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                        <Filter size={12} />
                        PARA: {m.targetType ? translateSchoolType(m.targetType) : 'TODAS LAS ESCUELAS'}
                    </div>
                </div>
              </div>

              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-slate-900 transition-colors duration-300">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                      Creado el {new Date(m.startDate).toLocaleDateString('es-AR')}
                  </span>
                  <Link href={`#`} className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                      VER DETALLE <ChevronRight size={14} />
                  </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
