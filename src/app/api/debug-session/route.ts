import { auth } from "@/auth"; import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  return NextResponse.json({
    hasSession: !!session,
    user: session?.user ? { name: session.user.name, role: (session.user as any).role } : null,
    timestamp: new Date().toISOString()
  })
}
