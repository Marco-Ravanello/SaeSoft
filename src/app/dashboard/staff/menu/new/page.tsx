"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"

export default function Page() {
  const [n, setN] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(users => {
        const provs = users.filter((u: any) => u.role === "PROVIDER");
        setProviders(provs);
        if (provs.length > 0) setSelectedProvider(provs[0].id);
      });
  }, []);

  const handleSave = async () => {
    if (!selectedProvider) return alert("Seleccione un proveedor");
    setLoading(true);

    // Necesitamos el provider.id real, no el user.id.
    // Por simplicidad, en el dashboard/staff/menu podemos cargar los providers directamente desde una API o prop.
    const res = await fetch("/api/staff/menu", {
      method: "POST",
      body: JSON.stringify({
        name: n,
        startDate: new Date(),
        endDate: new Date(),
        providerId: selectedProvider
      })
    });

    if (res.ok) {
      router.push("/dashboard/staff/menu");
      router.refresh();
    } else {
      alert("Error al guardar el menú");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mt-10">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Nuevo Menú por Proveedor</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del Menú / Semana</label>
          <input
            value={n}
            onChange={e=>setN(e.target.value)}
            placeholder="Ej: Menú Invierno - Semana 1"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Asignar a Proveedor</label>
          <select
            value={selectedProvider}
            onChange={e=>setSelectedProvider(e.target.value)}
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Seleccione un proveedor...</option>
            {providers.map(p => (
              <option key={p.id} value={p.provider?.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !n || !selectedProvider}
          className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300"
        >
          {loading ? "GUARDANDO..." : "CREAR MENÚ OFICIAL"}
        </button>
      </div>
    </div>
  )
}
