"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Shield, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface RideHistoryItem {
  id: number
  pickup_location: string
  destination: string
  status: "completed" | "cancelled" | "active"
  driver_name: string
  fare: number
  blockchain_tx?: string
  created_at: string
  verification_status: "verified" | "pending" | "failed"
}

export function RideHistory() {
  const [rides, setRides] = useState<RideHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching ride history
    const fetchRides = async () => {
      // Mock data - in real app, this would fetch from API
      const mockRides: RideHistoryItem[] = [
        {
          id: 1,
          pickup_location: "123 Main St, Downtown",
          destination: "456 Oak Ave, Uptown",
          status: "completed",
          driver_name: "Sarah Johnson",
          fare: 25.5,
          blockchain_tx: "0x5e6f7890abcdef123456789abcdef1234567890abcd",
          created_at: "2024-01-15T14:30:00Z",
          verification_status: "verified",
        },
        {
          id: 2,
          pickup_location: "789 Pine Rd, Westside",
          destination: "321 Elm St, Eastside",
          status: "completed",
          driver_name: "Mike Davis",
          fare: 18.75,
          blockchain_tx: "0x6f7890abcdef123456789abcdef1234567890abcde",
          created_at: "2024-01-14T09:15:00Z",
          verification_status: "verified",
        },
        {
          id: 3,
          pickup_location: "555 Maple Dr, Northside",
          destination: "777 Cedar Ln, Southside",
          status: "active",
          driver_name: "Lisa Chen",
          fare: 22.0,
          created_at: "2024-01-16T16:45:00Z",
          verification_status: "pending",
        },
      ]

      setTimeout(() => {
        setRides(mockRides)
        setIsLoading(false)
      }, 1000)
    }

    fetchRides()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "active":
        return (
          <Badge variant="default">
            <Clock className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary" className="text-xs">
            <Shield className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-xs">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ride History</CardTitle>
          <CardDescription>Loading your ride history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ride History</CardTitle>
        <CardDescription>View all your rides and their blockchain verification status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{ride.pickup_location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="text-sm">{ride.destination}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  {getStatusBadge(ride.status)}
                  <p className="text-sm font-medium">${ride.fare}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Driver: {ride.driver_name}</span>
                  <span>{new Date(ride.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getVerificationBadge(ride.verification_status)}
                  {ride.blockchain_tx && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/blockchain?tx=${ride.blockchain_tx}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {ride.status === "active" && (
                <div className="pt-2 border-t">
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/ride/${ride.id}`}>
                      <Navigation className="mr-2 h-3 w-3" />
                      Track Ride
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
