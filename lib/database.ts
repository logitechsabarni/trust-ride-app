// Database connection and query utilities for Trust Ride
// Provides type-safe database operations and connection management

import { hashPassword } from "./auth"

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  guardian_contact?: string
  created_at: Date
  updated_at: Date
}

export interface Driver {
  id: number
  name: string
  license_number: string
  rating: number
  verified_on_blockchain: boolean
  blockchain_tx?: string
  created_at: Date
  updated_at: Date
}

export interface Ride {
  id: number
  user_id: number
  driver_id?: number
  pickup_location: string
  destination: string
  status: "pending" | "active" | "completed" | "cancelled"
  blockchain_tx?: string
  fare?: number
  created_at: Date
  updated_at: Date
}

export interface Alert {
  id: number
  ride_id: number
  user_id: number
  alert_type: "panic" | "emergency" | "suspicious"
  timestamp: Date
  location_lat?: number
  location_lng?: number
  location_address?: string
  tx_hash: string
  status: "pending" | "verified" | "resolved"
  created_at: Date
}

export interface BlockchainLog {
  id: number
  entity_type: "driver" | "ride" | "alert"
  entity_id: number
  tx_hash: string
  status: "pending" | "verified" | "failed"
  block_number?: number
  gas_used?: number
  created_at: Date
  verified_at?: Date
}

// Mock database connection for development
// In production, this would connect to PostgreSQL
class MockDatabase {
  private users: User[] = []
  private drivers: Driver[] = []
  private rides: Ride[] = []
  private alerts: Alert[] = []
  private blockchainLogs: BlockchainLog[] = []

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData()
  }

  private async initializeSampleData() {
    try {
      const sampleUsers = [
        {
          name: "John Doe",
          email: "john@example.com",
          password_hash: await hashPassword("TrustRide2024!John"),
          guardian_contact: "+1234567890",
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          password_hash: await hashPassword("SecurePass#Jane99"),
          guardian_contact: "+0987654321",
        },
      ]

      for (const userData of sampleUsers) {
        const user: User = {
          ...userData,
          id: this.users.length + 1,
          created_at: new Date(),
          updated_at: new Date(),
        }
        this.users.push(user)
      }
    } catch (error) {
      console.error("Error initializing sample users:", error)
    }

    // Sample drivers
    this.drivers = [
      {
        id: 1,
        name: "Sarah Johnson",
        license_number: "DL123456789",
        rating: 4.9,
        verified_on_blockchain: true,
        blockchain_tx: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        created_at: new Date("2024-01-10"),
        updated_at: new Date("2024-01-10"),
      },
      {
        id: 2,
        name: "Mike Davis",
        license_number: "DL987654321",
        rating: 4.7,
        verified_on_blockchain: true,
        blockchain_tx: "0x2b3c4d5e6f7890ab1234567890abcdef1234567890",
        created_at: new Date("2024-01-11"),
        updated_at: new Date("2024-01-11"),
      },
    ]

    // Sample blockchain logs
    this.blockchainLogs = [
      {
        id: 1,
        entity_type: "driver",
        entity_id: 1,
        tx_hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        status: "verified",
        block_number: 18500000,
        gas_used: 21000,
        created_at: new Date("2024-01-10T10:00:00Z"),
        verified_at: new Date("2024-01-10T10:02:00Z"),
      },
      {
        id: 2,
        entity_type: "driver",
        entity_id: 2,
        tx_hash: "0x2b3c4d5e6f7890ab1234567890abcdef1234567890",
        status: "verified",
        block_number: 18500001,
        gas_used: 21000,
        created_at: new Date("2024-01-11T14:30:00Z"),
        verified_at: new Date("2024-01-11T14:32:00Z"),
      },
    ]
  }

  // User operations
  async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const user: User = {
      ...userData,
      id: this.users.length + 1,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.users.push(user)
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  // Driver operations
  async getVerifiedDrivers(): Promise<Driver[]> {
    return this.drivers.filter((driver) => driver.verified_on_blockchain)
  }

  async getDriverById(id: number): Promise<Driver | null> {
    return this.drivers.find((driver) => driver.id === id) || null
  }

  // Ride operations
  async createRide(rideData: Omit<Ride, "id" | "created_at" | "updated_at">): Promise<Ride> {
    const ride: Ride = {
      ...rideData,
      id: this.rides.length + 1,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.rides.push(ride)
    return ride
  }

  async getRidesByUserId(userId: number): Promise<Ride[]> {
    return this.rides.filter((ride) => ride.user_id === userId)
  }

  async getRideById(id: number): Promise<Ride | null> {
    return this.rides.find((ride) => ride.id === id) || null
  }

  async updateRideStatus(id: number, status: Ride["status"], blockchainTx?: string): Promise<Ride | null> {
    const ride = this.rides.find((r) => r.id === id)
    if (ride) {
      ride.status = status
      ride.updated_at = new Date()
      if (blockchainTx) ride.blockchain_tx = blockchainTx
    }
    return ride || null
  }

  // Alert operations
  async createAlert(alertData: Omit<Alert, "id" | "created_at">): Promise<Alert> {
    const alert: Alert = {
      ...alertData,
      id: this.alerts.length + 1,
      created_at: new Date(),
    }
    this.alerts.push(alert)
    return alert
  }

  async getAlertsByUserId(userId: number): Promise<Alert[]> {
    return this.alerts.filter((alert) => alert.user_id === userId)
  }

  // Blockchain log operations
  async createBlockchainLog(logData: Omit<BlockchainLog, "id" | "created_at">): Promise<BlockchainLog> {
    const log: BlockchainLog = {
      ...logData,
      id: this.blockchainLogs.length + 1,
      created_at: new Date(),
    }
    this.blockchainLogs.push(log)
    return log
  }

  async getBlockchainLogs(): Promise<BlockchainLog[]> {
    return [...this.blockchainLogs].sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  }

  async updateBlockchainLogStatus(
    txHash: string,
    status: BlockchainLog["status"],
    blockNumber?: number,
  ): Promise<void> {
    const log = this.blockchainLogs.find((l) => l.tx_hash === txHash)
    if (log) {
      log.status = status
      log.verified_at = new Date()
      if (blockNumber) log.block_number = blockNumber
    }
  }
}

// Export singleton instance
export const db = new MockDatabase()

// Utility functions for blockchain simulation
export function generateTxHash(): string {
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

export function simulateBlockchainVerification(txHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate network delay and 95% success rate
    setTimeout(
      () => {
        const success = Math.random() > 0.05
        resolve(success)
      },
      2000 + Math.random() * 3000,
    )
  })
}
