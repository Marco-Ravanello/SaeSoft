import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const school = await prisma.school.findUnique({ where: { userId: (session.user as any).id } })
  if (!school) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { description } = await req.json()
  const claim = await prisma.claim.create({
    data: {
      schoolId: school.id,
      description,
      status: "PENDING"
    }
  })
  return NextResponse.json(claim)
}
