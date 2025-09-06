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

    // Get all blockchain logs
    const logs = await db.getBlockchainLogs()

    // Enhance logs with entity details
    const enhancedLogs = await Promise.all(
      logs.map(async (log) => {
        let entityDetails = {}

        switch (log.entity_type) {
          case "driver":
            const driver = await db.getDriverById(log.entity_id)
            if (driver) {
              entityDetails = {
                name: driver.name,
                description: `License: ${driver.license_number}`,
              }
            }
            break

          case "ride":
            const ride = await db.getRideById(log.entity_id)
            if (ride) {
              entityDetails = {
                name: `Ride #${ride.id}`,
                description: `${ride.pickup_location} → ${ride.destination}`,
                location: ride.pickup_location,
              }
            }
            break

          case "alert":
            const alerts = await db.getAlertsByUserId(payload.userId)
            const alert = alerts.find((a) => a.id === log.entity_id)
            if (alert) {
              entityDetails = {
                name: `${alert.alert_type.charAt(0).toUpperCase() + alert.alert_type.slice(1)} Alert`,
                description: `Emergency alert triggered`,
                location: alert.location_address || "Unknown location",
              }
            }
            break
        }

        return {
          ...log,
          entity_details: entityDetails,
        }
      }),
    )

    return NextResponse.json({
      logs: enhancedLogs,
    })
  } catch (error) {
    console.error("Get blockchain logs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
