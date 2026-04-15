import prisma from "@/lib/prisma"

export default async function ProviderMenuPage() {
  const menu = await prisma.menu.findFirst({
    include: { dishes: { include: { ingredients: true } } },
    orderBy: { startDate: "desc" }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Menú Semanal (Gramajes)</h1>
      {menu ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(day => {
            const dishes = menu.dishes.filter(d => d.dayOfWeek === day)
            return (
              <div key={day} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 border">
                <h3 className="font-bold border-b mb-2">{["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][day-1]}</h3>
                {dishes.map(dish => (
                  <div key={dish.id} className="mb-4">
                    <p className="text-sm font-bold text-blue-600">{dish.name}</p>
                    <ul className="text-xs text-gray-500 mt-1">
                      {dish.ingredients.map(i => (
                        <li key={i.id}>{i.name}: {i.grammage}g/pibe</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : <p>No hay menú cargado.</p>}
    </div>
  )
}
