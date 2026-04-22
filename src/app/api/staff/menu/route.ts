import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role
  if (role !== "ADMIN" && role !== "STAFF") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const { name, startDate, endDate, providerId, category, targetType, dishes } = await req.json()

    const m = await prisma.menu.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        providerId,
        category,
        targetType: targetType || null,
        dishes: {
          create: dishes.map((d: any) => ({
            name: d.name,
            dayOfWeek: d.dayOfWeek,
            ingredients: {
              create: d.ingredients.map((i: any) => ({
                name: i.name,
                grammage: parseFloat(i.grammage) || 0
              }))
            }
          }))
        }
      }
    })

    return NextResponse.json(m)
  } catch (error: any) {
    console.error("Error creating menu:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
