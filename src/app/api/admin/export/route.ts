import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import * as XLSX from 'xlsx'
import { translateService } from "@/lib/utils"

export async function GET(req: Request) {
  const session = await auth()
  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const providerId = searchParams.get("providerId")
  const month = searchParams.get("month") // YYYY-MM

  try {
    const where: any = {
      status: "SIGNED"
    }

    if (providerId) where.providerId = providerId
    if (month) {
      const [year, m] = month.split('-')
      where.date = {
        gte: new Date(parseInt(year), parseInt(m) - 1, 1),
        lt: new Date(parseInt(year), parseInt(m), 1, 23, 59, 59)
      }
    }

    const deliveries = await prisma.deliveryNote.findMany({
      where,
      include: {
        school: true,
        provider: true
      },
      orderBy: { date: 'asc' }
    })

    if (deliveries.length === 0) {
      return NextResponse.json({ error: "No hay remitos firmados para los filtros seleccionados" }, { status: 404 })
    }

    // Transformar datos para el Excel siguiendo el formato solicitado
    const rows = deliveries.flatMap(d => {
      let items = []
      try {
        items = JSON.parse(d.items)
      } catch (e) {
        console.error("Error parsing items for delivery", d.id)
        return []
      }

      return items.map((item: any) => ({
        FECHA: new Date(d.date).toLocaleDateString('es-AR'),
        SUCURSAL: d.school.name,
        'NRO DE REMITO': d.id.slice(-8).toUpperCase(),
        SERVICIO: translateService(item.serviceType),
        CUPOS: item.quantity,
        OBSERVACIONES: d.rejectionReason || 'OK',
        TOTAL: item.quantity
      }))
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturación")

    // Generar buffer
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new Response(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="SAE_Export_${month || 'Reporte'}.xlsx"`
      }
    })
  } catch (error: any) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Error al generar el reporte: " + error.message }, { status: 500 })
  }
}
