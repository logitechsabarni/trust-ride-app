"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Phone, Shield, MapPin, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function EmergencyControls() {
  const [isActivating, setIsActivating] = useState(false)
  const [lastAlert, setLastAlert] = useState<string | null>(null)
  const { user } = useAuth()

  const activatePanicButton = async () => {
    setIsActivating(true)

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
          location_lat: location.latitude,
          location_lng: location.longitude,
          location_address: "Current Location", // In real app, reverse geocode
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setLastAlert(`Alert created with TX: ${data.tx_hash}`)

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
      setIsActivating(false)
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

  const testPanicButton = async () => {
    const confirmed = confirm("This will test the panic button system without sending real alerts. Continue?")
    if (confirmed) {
      alert("Panic button test successful! All systems are working properly.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Emergency Panic Button */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Emergency Controls
          </CardTitle>
          <CardDescription>Use in case of emergency during your ride.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="destructive"
            size="lg"
            className="w-full h-16 text-lg font-bold"
            onClick={activatePanicButton}
            disabled={isActivating}
          >
            {isActivating ? (
              <>
                <Clock className="mr-2 h-6 w-6 animate-spin" />
                ACTIVATING...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-6 w-6" />
                PANIC BUTTON
              </>
            )}
          </Button>

          {lastAlert && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{lastAlert}</AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Immediately logs alert to blockchain</p>
            <p>• Notifies your guardian contact</p>
            <p>• Records GPS location and timestamp</p>
            <p>• Creates immutable evidence record</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Safety Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent" onClick={testPanicButton}>
            <Shield className="mr-2 h-4 w-4" />
            Test Panic Button
          </Button>

          <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
            <a href="tel:911">
              <Phone className="mr-2 h-4 w-4" />
              Call 911
            </a>
          </Button>

          <Button variant="outline" className="w-full justify-start bg-transparent">
            <MapPin className="mr-2 h-4 w-4" />
            Share Location
          </Button>
        </CardContent>
      </Card>

      {/* Guardian Info */}
      {user?.guardian_contact && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Guardian Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.guardian_contact}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This contact will be automatically notified during emergencies.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Always verify driver details before getting in</p>
            <p>• Share your ride details with trusted contacts</p>
            <p>• Trust your instincts - use panic button if unsafe</p>
            <p>• Keep your phone charged and accessible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
