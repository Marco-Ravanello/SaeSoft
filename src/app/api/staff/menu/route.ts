import { auth } from "@/auth"; import prisma from "@/lib/prisma"; import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role
  if (role !== "ADMIN" && role !== "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { name, startDate, endDate, providerId, dishes } = await req.json()

  // dishes: [{ name: string, dayOfWeek: number, ingredients: [{ name: string, grammage: number }] }]

  const m = await prisma.menu.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      providerId,
      dishes: {
        create: dishes.map((d: any) => ({
          name: d.name,
          dayOfWeek: d.dayOfWeek,
          ingredients: {
            create: d.ingredients.map((i: any) => ({
              name: i.name,
              grammage: parseFloat(i.grammage)
            }))
          }
        }))
      }
    }
  })

  return NextResponse.json(m)
}
