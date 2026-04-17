"use client"

import { ClipboardCheck } from "lucide-react"

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition-all flex items-center gap-2"
    >
      <ClipboardCheck size={18} /> Imprimir Remito
    </button>
  )
}
