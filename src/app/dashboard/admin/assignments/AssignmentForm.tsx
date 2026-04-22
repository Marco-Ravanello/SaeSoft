"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ShieldAlert, School as SchoolIcon } from "lucide-react";

export default function AssignmentForm({ school, providers, currentProviderId }: any) {
  const [providerId, setProviderId] = useState(currentProviderId);
  const [schoolType, setSchoolType] = useState(school.type);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const services = school.services || [];
  const hasService = (type: string) => services.some((s: any) => s.serviceType === type);

  const updateAssignment = async (v: string) => {
    setProviderId(v);
    await fetch("/api/admin/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId: school.id, providerId: v })
    });
    router.refresh();
  };

  const updateType = async (type: string) => {
    setSchoolType(type);
    await fetch(`/api/admin/users/${school.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolType: type })
    });
    router.refresh();
  };

  const toggleService = async (serviceType: string, current: boolean) => {
    setLoading(true);
    await fetch("/api/admin/assignments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId: school.id, serviceType, enabled: !current })
    });
    setLoading(false);
    router.refresh();
  };

  const schoolTypes = [
    { id: 'JARDIN_MUNICIPAL', label: 'Jardín Municipal' },
    { id: 'JARDIN_PROVINCIAL', label: 'Jardín Provincial' },
    { id: 'PRIMARIA', label: 'Primaria' },
    { id: 'SECUNDARIA', label: 'Secundaria' },
    { id: 'DISPOSITIVO_TERRITORIAL', label: 'Dispositivo Territorial' },
    { id: 'TALLER_PROTEGIDO', label: 'Taller Protegido' },
  ];

  const serviceTypes = [
    { id: 'BREAKFAST_SNACK', label: 'Desayuno/Merienda' },
    { id: 'LUNCH', label: 'Comedor' },
    { id: 'NUTRITIONAL_REINFORCEMENT', label: 'Refuerzo Nutricional' },
    { id: 'MESA_BOX', label: 'Cajas MESA' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
            <SchoolIcon size={20} />
        </div>
        <h3 className="font-bold text-slate-800">{school.name}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asignación y Tipo */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Proveedor Asignado</label>
            <select
              value={providerId}
              onChange={e => updateAssignment(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="">Sin Proveedor</option>
              {providers.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Tipo de Institución</label>
            <select
              value={schoolType}
              onChange={e => updateType(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              {schoolTypes.map((t: any) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Servicios */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Servicios Habilitados</label>
          <div className="grid grid-cols-1 gap-2">
            {serviceTypes.map(st => {
              const active = hasService(st.id);
              // Lógica de restricción comentada por el usuario (Jardines/Dispositivos sin MESA)
              const restricted = (st.id === 'MESA_BOX' && (schoolType === 'JARDIN_MUNICIPAL' || schoolType === 'DISPOSITIVO_TERRITORIAL'));

              return (
                <button
                  key={st.id}
                  disabled={loading || restricted}
                  onClick={() => toggleService(st.id, active)}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${
                    restricted ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50' :
                    active ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold flex items-center gap-2">
                    {restricted && <ShieldAlert size={14} className="text-amber-500" />}
                    {st.label}
                  </span>
                  {active ? <Check size={18} /> : <X size={18} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
