"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, MapPin, Clock, Shield, ExternalLink, CheckCircle, Phone } from "lucide-react"
import Link from "next/link"

interface SafetyAlert {
  id: number
  alert_type: "panic" | "emergency" | "suspicious"
  timestamp: string
  location_address?: string
  location_lat?: number
  location_lng?: number
  tx_hash: string
  status: "pending" | "verified" | "resolved"
  ride_id?: number
  created_at: string
}

export function SafetyAlerts() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("trust-ride-token")
      const response = await fetch("/api/alerts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts)
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "panic":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "emergency":
        return <Phone className="h-4 w-4 text-destructive" />
      case "suspicious":
        return <Shield className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="destructive">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "panic":
        return "Panic Alert"
      case "emergency":
        return "Emergency Call"
      case "suspicious":
        return "Suspicious Activity"
      default:
        return "Safety Alert"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Safety Alerts</CardTitle>
          <CardDescription>Loading your safety alerts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
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
        <CardTitle>Recent Safety Alerts</CardTitle>
        <CardDescription>View and manage your safety alerts and their blockchain verification status.</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>No safety alerts found. Stay safe out there!</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                      {getAlertTypeIcon(alert.alert_type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{getAlertTypeLabel(alert.alert_type)}</h4>
                        {getStatusBadge(alert.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                        {alert.location_address && (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {alert.location_address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/blockchain?tx=${alert.tx_hash}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="pl-13 space-y-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Blockchain TX:</span> {alert.tx_hash}
                  </div>
                  {alert.ride_id && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Related Ride:</span>{" "}
                      <Link href={`/dashboard/ride/${alert.ride_id}`} className="text-primary hover:underline">
                        #{alert.ride_id}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
