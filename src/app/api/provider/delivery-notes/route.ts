import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth(); if ((session?.user as any)?.role !== "PROVIDER") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const provider = await prisma.provider.findUnique({ where: { userId: (session as any).user.id } })
  if (!provider) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { schoolId, items } = await req.json()
  const note = await prisma.deliveryNote.create({
    data: {
      providerId: provider.id,
      schoolId,
      items,
      status: "PENDING"
    }
  })
  return NextResponse.json(note)
}
