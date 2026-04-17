import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role
  if (role !== "ADMIN" && role !== "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { name, startDate, endDate, providerId } = await req.json()
  const m = await prisma.menu.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      providerId
    }
  })
  return NextResponse.json(m)
}
