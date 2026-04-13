"use client"
import { useRouter } from "next/navigation"

export default function RequestActionButtons({ requestId, type }: { requestId: string, type: "quota" | "claim" }) {
  const router = useRouter()

  const handleAction = async (action: "APPROVED" | "REJECTED") => {
    await fetch(`/api/staff/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, type }),
    })
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("APPROVED")}
        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
      >
        Aprobar
      </button>
      <button
        onClick={() => handleAction("REJECTED")}
        className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
      >
        Rechazar
      </button>
    </div>
  )
}
