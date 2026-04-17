"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Utensils, Plus, Trash2, Save, Calendar, ChevronRight } from "lucide-react"

export default function Page() {
  const [name, setName] = useState("")
  const [providers, setProviders] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Estructura del menú: 5 días (L-V)
  const [days, setDays] = useState<any[]>([
    { id: 1, label: "Lunes", dishes: [] },
    { id: 2, label: "Martes", dishes: [] },
    { id: 3, label: "Miércoles", dishes: [] },
    { id: 4, label: "Jueves", dishes: [] },
    { id: 5, label: "Viernes", dishes: [] },
  ])

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(users => {
        const provs = users.filter((u: any) => u.role === "PROVIDER")
        setProviders(provs)
        if (provs.length > 0) setSelectedProvider(provs[0].provider?.id || "")
      })
  }, [])

  const addDish = (dayId: number) => {
    setDays(days.map(d => d.id === dayId ? {
      ...d,
      dishes: [...d.dishes, { id: Date.now(), name: "", ingredients: [{ id: Date.now()+1, name: "", grammage: "" }] }]
    } : d))
  }

  const removeDish = (dayId: number, dishId: number) => {
    setDays(days.map(d => d.id === dayId ? {
      ...d,
      dishes: d.dishes.filter((dish: any) => dish.id !== dishId)
    } : d))
  }

  const updateDishName = (dayId: number, dishId: number, value: string) => {
    setDays(days.map(d => d.id === dayId ? {
      ...d,
      dishes: d.dishes.map((dish: any) => dish.id === dishId ? { ...dish, name: value } : dish)
    } : d))
  }

  const addIngredient = (dayId: number, dishId: number) => {
    setDays(days.map(d => d.id === dayId ? {
      ...d,
      dishes: d.dishes.map((dish: any) => dish.id === dishId ? {
        ...dish,
        ingredients: [...dish.ingredients, { id: Date.now(), name: "", grammage: "" }]
      } : dish)
    } : d))
  }

  const updateIngredient = (dayId: number, dishId: number, ingId: number, field: string, value: string) => {
    setDays(days.map(d => d.id === dayId ? {
      ...d,
      dishes: d.dishes.map((dish: any) => dish.id === dishId ? {
        ...dish,
        ingredients: dish.ingredients.map((ing: any) => ing.id === ingId ? { ...ing, [field]: value } : ing)
      } : dish)
    } : d))
  }

  const handleSave = async () => {
    if (!selectedProvider || !name) return alert("Complete nombre y proveedor")
    setLoading(true)

    const payload = {
      name,
      startDate: new Date(),
      endDate: new Date(),
      providerId: selectedProvider,
      dishes: days.flatMap(d => d.dishes.map((dish: any) => ({
        dayOfWeek: d.id,
        name: dish.name,
        ingredients: dish.ingredients.map((ing: any) => ({
          name: ing.name,
          grammage: ing.grammage
        }))
      })))
    }

    const res = await fetch("/api/staff/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      router.push("/dashboard/staff/menu")
      router.refresh()
    } else {
      alert("Error al guardar")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tight">Nuevo Plan Alimentario</h1>
          <p className="text-slate-500 font-medium">Configure el menú semanal detallado por proveedor.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2 disabled:bg-slate-300"
        >
          <Save size={20} /> {loading ? "GUARDANDO..." : "PUBLICAR MENÚ"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> Identificación del Menú
          </label>
          <input
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Ej: Semana 1 - Invierno 2024"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-800"
          />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Utensils size={14} /> Proveedor Responsable
          </label>
          <select
            value={selectedProvider}
            onChange={e=>setSelectedProvider(e.target.value)}
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-800 appearance-none"
          >
            <option value="">Seleccionar proveedor...</option>
            {providers.map(p => (
              <option key={p.id} value={p.provider?.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {days.map(day => (
          <div key={day.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <h2 className="text-xl font-black text-white italic uppercase tracking-wider">{day.label}</h2>
              <button
                onClick={() => addDish(day.id)}
                className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2"
              >
                <Plus size={14} /> AGREGAR PLATO
              </button>
            </div>

            <div className="p-8 space-y-8">
              {day.dishes.length === 0 && (
                <p className="text-center text-slate-400 font-bold italic py-4">No hay platos configurados para este día.</p>
              )}

              {day.dishes.map((dish: any) => (
                <div key={dish.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Plato</label>
                      <input
                        value={dish.name}
                        onChange={e => updateDishName(day.id, dish.id, e.target.value)}
                        placeholder="Ej: Guiso de Lentejas"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-800"
                      />
                    </div>
                    <button
                      onClick={() => removeDish(day.id, dish.id)}
                      className="mt-6 p-3 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center">
                      Ingredientes y Gramajes (por chico)
                      <button
                        onClick={() => addIngredient(day.id, dish.id)}
                        className="text-blue-600 hover:underline"
                      >
                        + Agregar Ingrediente
                      </button>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dish.ingredients.map((ing: any) => (
                        <div key={ing.id} className="flex gap-2">
                          <input
                            placeholder="Ingrediente"
                            value={ing.name}
                            onChange={e => updateIngredient(day.id, dish.id, ing.id, "name", e.target.value)}
                            className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm"
                          />
                          <input
                            type="number"
                            placeholder="g"
                            value={ing.grammage}
                            onChange={e => updateIngredient(day.id, dish.id, ing.id, "grammage", e.target.value)}
                            className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
