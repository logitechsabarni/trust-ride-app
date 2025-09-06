"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, Car, Loader2 } from "lucide-react"
import { GoogleMapsAutocomplete } from "@/components/maps/google-maps-autocomplete"

export function RideBookingForm() {
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    scheduledTime: "",
    pickupCoords: null as { lat: number; lng: number } | null,
    destinationCoords: null as { lat: number; lng: number } | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLocationChange = (field: "pickup" | "destination") => (value: string, placeDetails?: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      [`${field}Coords`]: placeDetails ? { lat: placeDetails.lat, lng: placeDetails.lng } : null,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("trust-ride-token")
      const response = await fetch("/api/rides/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickup_location: formData.pickup,
          destination: formData.destination,
          scheduled_time: formData.scheduledTime || null,
          pickup_coords: formData.pickupCoords,
          destination_coords: formData.destinationCoords,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to book ride")
      }

      router.push(`/dashboard/ride/${data.ride.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="mr-2 h-5 w-5" />
          Book Your Ride
        </CardTitle>
        <CardDescription>Enter your pickup and destination to find verified drivers nearby.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <GoogleMapsAutocomplete
            label="Pickup Location"
            placeholder="Enter pickup address"
            value={formData.pickup}
            onChange={handleLocationChange("pickup")}
            disabled={isLoading}
          />

          <GoogleMapsAutocomplete
            label="Destination"
            placeholder="Enter destination address"
            value={formData.destination}
            onChange={handleLocationChange("destination")}
            disabled={isLoading}
          />

          <div className="space-y-2">
            <Label htmlFor="scheduledTime" className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              Schedule Time (Optional)
            </Label>
            <Input
              id="scheduledTime"
              name="scheduledTime"
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={handleChange}
              disabled={isLoading}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Drivers...
              </>
            ) : (
              <>
                <Car className="mr-2 h-4 w-4" />
                Book Ride Now
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
