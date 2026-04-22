"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Utensils, Plus, Trash2, Save, Calendar, School, Filter } from "lucide-react"

export default function Page() {
  const [name, setName] = useState("")
  const [providers, setProviders] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("BREAKFAST_SNACK")
  const [selectedTargetType, setSelectedTargetType] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
      category: selectedCategory,
      targetType: selectedTargetType || null,
      dishes: days.flatMap(d => d.dishes.map((dish: any) => ({
        dayOfWeek: d.id,
        name: dish.name,
        ingredients: dish.ingredients.map((ing: any) => ({
          name: ing.name,
          grammage: parseFloat(ing.grammage) || 0
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

  const schoolTypes = [
    { id: '', label: 'Todos los Tipos' },
    { id: 'JARDIN_MUNICIPAL', label: 'Jardín Municipal' },
    { id: 'JARDIN_PROVINCIAL', label: 'Jardín Provincial' },
    { id: 'PRIMARIA', label: 'Primaria' },
    { id: 'SECUNDARIA', label: 'Secundaria' },
    { id: 'DISPOSITIVO_TERRITORIAL', label: 'Dispositivo Territorial' },
    { id: 'TALLER_PROTEGIDO', label: 'Taller Protegido' },
  ];

  const categories = [
    { id: 'BREAKFAST_SNACK', label: 'Desayuno/Merienda' },
    { id: 'LUNCH', label: 'Comedor' },
    { id: 'NUTRITIONAL_REINFORCEMENT', label: 'Refuerzo Nutricional' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tight uppercase">Crear Nuevo Menú</h1>
          <p className="text-slate-500 font-medium">Define el plan alimentario por categoría y tipo de institución.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:bg-slate-300"
        >
          <Save size={24} /> {loading ? "GUARDANDO..." : "PUBLICAR MENÚ"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> Identificación del Menú
          </label>
          <input
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Ej: Semana 1 - Verano 2026"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Utensils size={14} /> Proveedor
          </label>
          <select
            value={selectedProvider}
            onChange={e=>setSelectedProvider(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 appearance-none"
          >
            <option value="">Seleccionar...</option>
            {providers.map(p => (
              <option key={p.id} value={p.provider?.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Filter size={14} /> Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={e=>setSelectedCategory(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 appearance-none"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-blue-100 bg-blue-50/30 shadow-sm space-y-4">
        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
          <School size={14} /> Aplicar a Tipo de Institución (Opcional)
        </label>
        <div className="flex flex-wrap gap-2">
            {schoolTypes.map(t => (
                <button
                    key={t.id}
                    onClick={() => setSelectedTargetType(t.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                        selectedTargetType === t.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
        <p className="text-[10px] text-slate-400 italic">Si no seleccionas un tipo, el menú será visible para todas las escuelas del proveedor seleccionado en esta categoría.</p>
      </div>

      <div className="space-y-8">
        {days.map(day => (
          <div key={day.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <h2 className="text-xl font-black text-white italic uppercase tracking-wider">{day.label}</h2>
              <button
                onClick={() => addDish(day.id)}
                className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <Plus size={16} /> AGREGAR PLATO
              </button>
            </div>

            <div className="p-8 space-y-8">
              {day.dishes.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-slate-300 font-bold italic">No hay platos configurados para el {day.label.toLowerCase()}.</p>
                </div>
              )}

              {day.dishes.map((dish: any) => (
                <div key={dish.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                      onClick={() => removeDish(day.id, dish.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="max-w-xl space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Plato</label>
                    <input
                      value={dish.name}
                      onChange={e => updateDishName(day.id, dish.id, e.target.value)}
                      placeholder="Ej: Pollo al horno con ensalada"
                      className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ingredientes y Gramajes</label>
                        <button
                            onClick={() => addIngredient(day.id, dish.id)}
                            className="text-[10px] font-black text-blue-600 uppercase hover:text-blue-800 flex items-center gap-1"
                        >
                            <Plus size={12} /> Añadir Ingrediente
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dish.ingredients.map((ing: any) => (
                        <div key={ing.id} className="flex gap-2 items-center bg-white p-2 rounded-xl shadow-sm border border-slate-50">
                          <input
                            placeholder="Ingrediente"
                            value={ing.name}
                            onChange={e => updateIngredient(day.id, dish.id, ing.id, "name", e.target.value)}
                            className="flex-1 p-2 bg-transparent outline-none text-sm font-medium"
                          />
                          <div className="flex items-center gap-1 bg-slate-50 px-2 rounded-lg">
                            <input
                                type="number"
                                placeholder="0"
                                value={ing.grammage}
                                onChange={e => updateIngredient(day.id, dish.id, ing.id, "grammage", e.target.value)}
                                className="w-12 p-2 bg-transparent outline-none text-sm font-black text-center text-blue-600"
                            />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">g</span>
                          </div>
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
