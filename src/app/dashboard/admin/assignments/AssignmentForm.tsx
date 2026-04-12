"use client"; import { useState } from "react"; import { useRouter } from "next/navigation"
export default function Form({ schoolId, providers, currentProviderId }: any) {
  const [s, setS] = useState(currentProviderId); const router = useRouter()
  const ch = async (v: string) => {
    setS(v); await fetch("/api/admin/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ schoolId, providerId: v }) })
    router.refresh()
  }
  return (<select value={s} onChange={e=>ch(e.target.value)} className="border p-1 rounded"><option value="">-</option>{providers.map((p:any)=>(<option key={p.id} value={p.id}>{p.name}</option>))}</select>)
}
