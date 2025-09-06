import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Authenticate the request
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rideId = Number.parseInt(params.id)
    if (isNaN(rideId)) {
      return NextResponse.json({ error: "Invalid ride ID" }, { status: 400 })
    }

    // Get ride details
    const ride = await db.getRideById(rideId)
    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 })
    }

    // Check if user owns this ride
    if (ride.user_id !== payload.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get driver details
    const driver = ride.driver_id ? await db.getDriverById(ride.driver_id) : null

    return NextResponse.json({
      ride,
      driver,
    })
  } catch (error) {
    console.error("Get ride error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
