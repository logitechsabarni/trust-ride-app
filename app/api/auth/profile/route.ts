import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function PUT(request: NextRequest) {
  try {
    // Authenticate the request
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email, guardian_contact } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Get current user
    const user = await db.getUserById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user (mock implementation - in real app, this would update the database)
    const updatedUser = {
      ...user,
      name,
      email,
      guardian_contact: guardian_contact || undefined,
      updated_at: new Date(),
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        guardian_contact: updatedUser.guardian_contact,
      },
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
