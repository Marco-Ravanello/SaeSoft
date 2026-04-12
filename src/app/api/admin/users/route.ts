import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const session = await auth(); if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "No" }, { status: 403 })
  const { username, password, name, role } = await req.json()
  const user = await prisma.user.create({ data: { username, password, name, role } })
  if (role === "PROVIDER") await prisma.provider.create({ data: { name, userId: user.id } })
  else if (role === "SCHOOL") await prisma.school.create({ data: { name, userId: user.id } })
  return NextResponse.json(user)
}
