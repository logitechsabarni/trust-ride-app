// Server-only authentication utilities for Trust Ride
// Handles Google OAuth verification - DO NOT IMPORT IN CLIENT CODE

import { GoogleAuth } from "google-auth-library"

// Google OAuth configuration - Server only
const googleAuth = new GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  },
})

// Verify Google OAuth token - Server only
export async function verifyGoogleToken(token: string): Promise<any> {
  try {
    const client = googleAuth.getClient()
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    return payload
  } catch (error) {
    console.error("Google token verification failed:", error)
    return null
  }
}
