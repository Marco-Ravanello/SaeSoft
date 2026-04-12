"use client"; import { useState } from "react"; import { signIn } from "next-auth/react"
export default function Page() {
  const [u, setU] = useState(""); const [p, setP] = useState("")
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">SAE 3F</h1>
        <input type="text" placeholder="Usuario" className="w-full border p-2 mb-4" onChange={e=>setU(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full border p-2 mb-6" onChange={e=>setP(e.target.value)} />
        <button onClick={()=>signIn("credentials",{username:u,password:p,callbackUrl:"/dashboard"})} className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
      </div>
    </div>
  )
}
