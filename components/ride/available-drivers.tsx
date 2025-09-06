"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, Car, Clock } from "lucide-react"

interface Driver {
  id: number
  name: string
  rating: number
  verified_on_blockchain: boolean
  estimatedArrival: string
  vehicleInfo: string
}

export function AvailableDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching available drivers
    const fetchDrivers = async () => {
      // Mock data - in real app, this would fetch from API
      const mockDrivers: Driver[] = [
        {
          id: 1,
          name: "Sarah Johnson",
          rating: 4.9,
          verified_on_blockchain: true,
          estimatedArrival: "3 min",
          vehicleInfo: "Toyota Camry • ABC-123",
        },
        {
          id: 2,
          name: "Mike Davis",
          rating: 4.7,
          verified_on_blockchain: true,
          estimatedArrival: "5 min",
          vehicleInfo: "Honda Accord • XYZ-789",
        },
        {
          id: 3,
          name: "Lisa Chen",
          rating: 4.95,
          verified_on_blockchain: true,
          estimatedArrival: "7 min",
          vehicleInfo: "Nissan Altima • DEF-456",
        },
      ]

      setTimeout(() => {
        setDrivers(mockDrivers)
        setIsLoading(false)
      }, 1000)
    }

    fetchDrivers()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Drivers</CardTitle>
          <CardDescription>Finding verified drivers near you...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
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
        <CardTitle>Available Drivers</CardTitle>
        <CardDescription>All drivers are blockchain-verified for your safety.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">{driver.name.charAt(0)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{driver.name}</p>
                  {driver.verified_on_blockchain && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                    {driver.rating}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {driver.estimatedArrival}
                  </div>
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <Car className="mr-1 h-3 w-3" />
                  {driver.vehicleInfo}
                </div>
              </div>

              <Button size="sm" variant="outline">
                Select
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
