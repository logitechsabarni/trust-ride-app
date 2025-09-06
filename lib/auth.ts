// Authentication utilities for Trust Ride
// Handles JWT tokens, password hashing, session management, and Google OAuth

import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { GoogleAuth } from "google-auth-library"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "trust-ride-secret-key-change-in-production")

export interface JWTPayload {
  userId: number
  email: string
  name: string
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}

// Middleware helper for protected routes
export async function authenticateRequest(request: Request): Promise<JWTPayload | null> {
  const authHeader = request.headers.get("Authorization")
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return null
  }

  return verifyToken(token)
}

// Google OAuth configuration
const googleAuth = new GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  },
})

// Verify Google OAuth token
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
