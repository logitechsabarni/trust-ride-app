import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db, generateTxHash, simulateBlockchainVerification } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { alert_type, ride_id, location_lat, location_lng, location_address } = await request.json()

    // Validate input
    if (!alert_type) {
      return NextResponse.json({ error: "Alert type is required" }, { status: 400 })
    }

    // Generate blockchain transaction hash
    const txHash = generateTxHash()

    // Create alert
    const alert = await db.createAlert({
      ride_id: ride_id || undefined,
      user_id: payload.userId,
      alert_type: alert_type || "panic",
      timestamp: new Date(),
      location_lat,
      location_lng,
      location_address,
      tx_hash: txHash,
      status: "pending",
    })

    // Create blockchain log entry
    await db.createBlockchainLog({
      entity_type: "alert",
      entity_id: alert.id,
      tx_hash: txHash,
      status: "pending",
    })

    // Simulate blockchain verification (in background)
    simulateBlockchainVerification(txHash).then((success) => {
      if (success) {
        db.updateBlockchainLogStatus(txHash, "verified", 18500000 + Math.floor(Math.random() * 1000))
      } else {
        db.updateBlockchainLogStatus(txHash, "failed")
      }
    })

    // Get user details for guardian notification
    const user = await db.getUserById(payload.userId)

    // Simulate guardian notification (in real app, this would send SMS/email)
    if (user?.guardian_contact) {
      console.log(`[GUARDIAN NOTIFICATION] Sending alert to ${user.guardian_contact}`)
      console.log(`Emergency alert from ${user.name} at ${location_address || "Unknown location"}`)
      console.log(`Blockchain TX: ${txHash}`)
    }

    return NextResponse.json({
      alert,
      tx_hash: txHash,
      message: "Emergency alert created successfully",
      guardian_notified: !!user?.guardian_contact,
    })
  } catch (error) {
    console.error("Create panic alert error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
