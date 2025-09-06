import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { generateToken } from "@/lib/auth"
import { verifyGoogleToken } from "@/lib/auth-server"

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json({ error: "Google credential is required" }, { status: 400 })
    }

    // Verify Google token
    const googlePayload = await verifyGoogleToken(credential)
    if (!googlePayload) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 })
    }

    const { email, name, picture } = googlePayload

    // Check if user exists
    let user = await db.getUserByEmail(email)

    if (!user) {
      // Create new user with Google OAuth
      user = await db.createUser({
        name: name || "Google User",
        email,
        password_hash: "", // No password for OAuth users
        guardian_contact: "",
      })
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        guardian_contact: user.guardian_contact,
        picture,
      },
    })
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
