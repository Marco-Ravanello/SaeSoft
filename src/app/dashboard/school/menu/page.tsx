import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Utensils, Calendar, Filter, ChevronRight, Clock } from "lucide-react"
import { translateService } from "@/lib/utils"

export default async function SchoolMenuPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const school = await prisma.school.findUnique({
    where: { userId: (session?.user as any).id },
    include: { services: true }
  })

  if (!school?.providerId) {
      return (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-4">
            <Utensils size={64} className="text-slate-200 mx-auto" />
            <p className="text-slate-400 font-black uppercase tracking-widest italic">No tienes un proveedor asignado.</p>
        </div>
      )
  }

  // Buscamos menús que apliquen a esta escuela (mismo proveedor y que sea general o para su tipo específico)
  const menus = await prisma.menu.findMany({
    where: {
        providerId: school.providerId,
        OR: [
            { targetType: null },
            { targetType: school.type }
        ]
    },
    include: { dishes: { include: { ingredients: true } } },
    orderBy: { startDate: "desc" }
  })

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase flex items-center gap-3">
            <Utensils className="text-blue-600" />
            Planes Alimentarios
        </h1>
        <p className="text-slate-500 font-medium mt-1">Consulta los menús vigentes para tu institución.</p>
      </header>

      {menus.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-4">
            <Clock size={64} className="text-slate-200 mx-auto" />
            <p className="text-slate-400 font-black uppercase tracking-widest italic">Aún no hay menús publicados para tu categoría o tipo de institución.</p>
        </div>
      ) : (
        <div className="space-y-12">
            {menus.map(menu => (
                <div key={menu.id} className="space-y-6">
                    <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
                        <div className="bg-blue-500 p-3 rounded-2xl">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">{translateService(menu.category)}</span>
                            <h2 className="text-2xl font-black italic uppercase leading-none">{menu.name}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(day => {
                        const dishes = menu.dishes.filter(d => d.dayOfWeek === day)
                        return (
                        <div key={day} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-md transition-all">
                            <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-50 pb-3 mb-4 flex justify-between items-center">
                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][day-1]}
                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            {dishes.length === 0 ? (
                                <p className="text-[10px] text-slate-300 font-bold italic py-4">Sin platos</p>
                            ) : (
                                dishes.map(dish => (
                                <div key={dish.id} className="mb-6 last:mb-0">
                                    <p className="text-sm font-black text-slate-800 mb-2 leading-tight uppercase italic">{dish.name}</p>
                                    <ul className="space-y-2">
                                    {dish.ingredients.map(i => (
                                        <li key={i.id} className="text-[10px] text-slate-500 font-medium flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                        <span className="truncate pr-2">{i.name}</span>
                                        <span className="text-blue-600 font-black whitespace-nowrap">{i.grammage}g</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                ))
                            )}
                        </div>
                        )
                    })}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}
