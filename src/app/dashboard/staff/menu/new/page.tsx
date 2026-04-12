"use client"; import { useState } from "react"; import { useRouter } from "next/navigation"
export default function Page() {
  const [n, setN] = useState(""); const router = useRouter()
  return (<div className="p-8"><h1 className="text-2xl font-bold mb-4">Nuevo Menú</h1><input value={n} onChange={e=>setN(e.target.value)} className="border p-2 mb-4 block w-full" /><button onClick={async ()=>{await fetch("/api/staff/menu",{method:"POST",body:JSON.stringify({name:n,startDate:new Date(),endDate:new Date()})});router.push("/dashboard/staff/menu")}} className="bg-blue-600 text-white p-2 rounded">Guardar</button></div>)
}
