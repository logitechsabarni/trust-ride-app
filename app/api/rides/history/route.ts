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

    // Get user's ride history
    const rides = await db.getRidesByUserId(payload.userId)

    // Get driver names for each ride
    const ridesWithDrivers = await Promise.all(
      rides.map(async (ride) => {
        const driver = ride.driver_id ? await db.getDriverById(ride.driver_id) : null
        return {
          ...ride,
          driver_name: driver?.name || "Unknown Driver",
          verification_status: ride.blockchain_tx ? "verified" : "pending",
        }
      }),
    )

    return NextResponse.json({
      rides: ridesWithDrivers,
    })
  } catch (error) {
    console.error("Get ride history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
