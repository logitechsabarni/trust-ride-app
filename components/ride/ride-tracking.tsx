"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Phone, MessageCircle, AlertTriangle, Shield, Navigation, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface RideTrackingProps {
  rideId: string
}

interface RideData {
  id: number
  pickup_location: string
  destination: string
  status: string
  driver: {
    name: string
    rating: number
    phone: string
    vehicle: string
  }
  estimatedArrival: string
  currentLocation: string
}

export function RideTracking({ rideId }: RideTrackingProps) {
  const [rideData, setRideData] = useState<RideData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPanicActivating, setIsPanicActivating] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Simulate fetching ride data
    const fetchRideData = async () => {
      // Mock data - in real app, this would fetch from API
      const mockRide: RideData = {
        id: Number.parseInt(rideId),
        pickup_location: "123 Main St, Downtown",
        destination: "456 Oak Ave, Uptown",
        status: "active",
        driver: {
          name: "Sarah Johnson",
          rating: 4.9,
          phone: "+1 (555) 123-4567",
          vehicle: "Toyota Camry • ABC-123",
        },
        estimatedArrival: "12 minutes",
        currentLocation: "Approaching Main St & 2nd Ave",
      }

      setTimeout(() => {
        setRideData(mockRide)
        setIsLoading(false)
      }, 1000)
    }

    fetchRideData()
  }, [rideId])

  const handlePanicButton = async () => {
    setIsPanicActivating(true)

    try {
      // Get current location
      const location = await getCurrentLocation()

      const token = localStorage.getItem("trust-ride-token")
      const response = await fetch("/api/alerts/panic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alert_type: "panic",
          ride_id: Number.parseInt(rideId),
          location_lat: location.latitude,
          location_lng: location.longitude,
          location_address: rideData?.currentLocation || "Current Location",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Emergency alert activated! TX: ${data.tx_hash}\n\nGuardian and authorities have been notified.`)

        // Simulate guardian notification
        if (user?.guardian_contact) {
          setTimeout(() => {
            alert(`Guardian ${user.guardian_contact} has been notified of your emergency!`)
          }, 2000)
        }
      } else {
        throw new Error("Failed to create alert")
      }
    } catch (error) {
      console.error("Panic button error:", error)
      alert("Failed to activate panic button. Please call 911 directly.")
    } finally {
      setIsPanicActivating(false)
    }
  }

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          // Fallback to mock location for demo
          resolve({
            latitude: 40.7128,
            longitude: -74.006,
          })
        },
        { timeout: 5000 },
      )
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!rideData) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Ride not found or you don't have permission to view this ride.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Ride Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Navigation className="mr-2 h-5 w-5" />
                Ride in Progress
              </CardTitle>
              <CardDescription>Track your ride in real-time</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {rideData.estimatedArrival}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-sm text-muted-foreground">{rideData.pickup_location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-sm text-muted-foreground">{rideData.destination}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">{rideData.currentLocation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Live Map Integration</p>
              <p className="text-xs text-muted-foreground">Google Maps integration would be implemented here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Driver</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-lg">{rideData.driver.name.charAt(0)}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-lg">{rideData.driver.name}</p>
                <Badge variant="secondary">
                  <Shield className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Rating: ⭐ {rideData.driver.rating}</p>
              <p className="text-sm text-muted-foreground">{rideData.driver.vehicle}</p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Controls */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Emergency Controls</CardTitle>
          <CardDescription>Use these controls if you feel unsafe during your ride.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={handlePanicButton}
              disabled={isPanicActivating}
            >
              {isPanicActivating ? (
                <>
                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                  ACTIVATING EMERGENCY ALERT...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  PANIC BUTTON
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/alerts">
                  <Shield className="mr-2 h-4 w-4" />
                  Safety Center
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:911">
                  <Phone className="mr-2 h-4 w-4" />
                  Call 911
                </a>
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p>• Alert will be logged to blockchain immediately</p>
              <p>• Guardian contact will be notified automatically</p>
              <p>• GPS location and timestamp will be recorded</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
