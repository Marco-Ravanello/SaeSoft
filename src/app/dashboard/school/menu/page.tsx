import prisma from "@/lib/prisma"
import { auth } from "@/auth"

import { redirect } from "next/navigation"

export default async function SchoolMenuPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const school = await prisma.school.findUnique({
    where: { userId: (session?.user as any).id }
  })

  const menu = school?.providerId ? await prisma.menu.findFirst({
    where: { providerId: school.providerId },
    include: { dishes: { include: { ingredients: true } } },
    orderBy: { startDate: "desc" }
  }) : null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Menú Semanal</h1>
      </div>

      {menu ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(day => {
            const dishes = menu.dishes.filter(d => d.dayOfWeek === day)
            return (
              <div key={day} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs border-b border-slate-50 pb-3 mb-4">
                  {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][day-1]}
                </h3>
                {dishes.map(dish => (
                  <div key={dish.id} className="mb-6 last:mb-0">
                    <p className="text-sm font-bold text-blue-600 mb-2">{dish.name}</p>
                    <ul className="space-y-1">
                      {dish.ingredients.map(i => (
                        <li key={i.id} className="text-[10px] text-slate-500 font-medium">
                          • {i.name}: <span className="text-slate-700 font-bold">{i.grammage}g</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest italic">Aún no se ha cargado el menú para tu proveedor.</p>
        </div>
      )}
    </div>
  )
}
