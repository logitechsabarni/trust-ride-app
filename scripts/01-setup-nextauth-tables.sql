-- Create NextAuth required tables
-- This script sets up the database schema for NextAuth.js

-- Users table (enhanced with Trust Ride specific fields)
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    "emailVerified" TIMESTAMP,
    image TEXT,
    role TEXT DEFAULT 'user',
    "guardianContact" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table for OAuth providers
CREATE TABLE IF NOT EXISTS "Account" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    UNIQUE(provider, "providerAccountId")
);

-- Sessions table for session management
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT PRIMARY KEY,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Verification tokens for email verification
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    UNIQUE(identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
