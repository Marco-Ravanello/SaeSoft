import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const { name, startDate, endDate } = await req.json()
  const m = await prisma.menu.create({ data: { name, startDate: new Date(startDate), endDate: new Date(endDate) } })
  return NextResponse.json(m)
}
