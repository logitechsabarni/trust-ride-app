import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db, generateTxHash } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pickup_location, destination, scheduled_time } = await request.json()

    // Validate input
    if (!pickup_location || !destination) {
      return NextResponse.json({ error: "Pickup location and destination are required" }, { status: 400 })
    }

    // Get available verified drivers
    const availableDrivers = await db.getVerifiedDrivers()
    if (availableDrivers.length === 0) {
      return NextResponse.json({ error: "No verified drivers available" }, { status: 404 })
    }

    // Select first available driver (in real app, this would be more sophisticated)
    const selectedDriver = availableDrivers[0]

    // Calculate estimated fare (mock calculation)
    const estimatedFare = Math.round((Math.random() * 30 + 10) * 100) / 100

    // Create ride
    const ride = await db.createRide({
      user_id: payload.userId,
      driver_id: selectedDriver.id,
      pickup_location,
      destination,
      status: "pending",
      fare: estimatedFare,
    })

    // Generate blockchain transaction hash
    const txHash = generateTxHash()

    // Update ride with blockchain transaction
    await db.updateRideStatus(ride.id, "active", txHash)

    // Create blockchain log entry
    await db.createBlockchainLog({
      entity_type: "ride",
      entity_id: ride.id,
      tx_hash: txHash,
      status: "pending",
    })

    return NextResponse.json({
      ride: {
        ...ride,
        blockchain_tx: txHash,
        status: "active",
      },
      driver: selectedDriver,
      message: "Ride booked successfully! Your driver is on the way.",
    })
  } catch (error) {
    console.error("Book ride error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
