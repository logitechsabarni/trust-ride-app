import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's alerts
    const alerts = await db.getAlertsByUserId(payload.userId)

    return NextResponse.json({
      alerts,
    })
  } catch (error) {
    console.error("Get alerts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
