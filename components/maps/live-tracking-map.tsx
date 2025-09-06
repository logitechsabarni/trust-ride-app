"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"

interface LiveTrackingMapProps {
  pickup: { lat: number; lng: number; address: string }
  destination: { lat: number; lng: number; address: string }
  driverLocation?: { lat: number; lng: number }
  userLocation?: { lat: number; lng: number }
}

export function LiveTrackingMap({ pickup, destination, driverLocation, userLocation }: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [eta, setEta] = useState<string>("Calculating...")

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,directions`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: pickup,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        mapInstanceRef.current = map

        // Add markers
        new window.google.maps.Marker({
          position: pickup,
          map,
          title: "Pickup Location",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#10b981"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          },
        })

        new window.google.maps.Marker({
          position: destination,
          map,
          title: "Destination",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          },
        })

        // Add driver marker if available
        if (driverLocation) {
          new window.google.maps.Marker({
            position: driverLocation,
            map,
            title: "Driver Location",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#3b82f6"/>
                  <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
            },
          })
        }

        // Calculate and display route
        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#3b82f6",
            strokeWeight: 4,
          },
        })

        directionsRenderer.setMap(map)

        directionsService.route(
          {
            origin: pickup,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result)
              const route = result.routes[0]
              const leg = route.legs[0]
              setEta(leg.duration.text)
            }
          },
        )

        setIsLoaded(true)
      }
    }

    loadGoogleMaps()
  }, [pickup, destination, driverLocation])

  // Update driver location in real-time
  useEffect(() => {
    if (driverLocation && mapInstanceRef.current && isLoaded) {
      // In a real app, this would update the driver marker position
      console.log("[v0] Driver location updated:", driverLocation)
    }
  }, [driverLocation, isLoaded])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Navigation className="mr-2 h-5 w-5" />
            Live Tracking
          </div>
          <Badge variant="secondary">ETA: {eta}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-64 rounded-lg bg-muted flex items-center justify-center">
          {!isLoaded && (
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
            <span className="font-medium">Pickup:</span>
            <span className="ml-2 text-muted-foreground">{pickup.address}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-destructive rounded-full mr-2"></div>
            <span className="font-medium">Destination:</span>
            <span className="ml-2 text-muted-foreground">{destination.address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
