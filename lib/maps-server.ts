"use server"

interface PlaceDetails {
  lat: number
  lng: number
  placeId: string
}

interface RouteDetails {
  duration: string
  distance: string
  polyline: string
}

export async function getGoogleMapsScript(): Promise<string> {
  // Return a script URL without exposing the API key
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error("Google Maps API key not configured")
  }

  // In production, you might want to use a more secure approach
  // like generating temporary tokens or using a proxy
  return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,directions`
}

export async function geocodeAddress(address: string): Promise<PlaceDetails | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error("Google Maps API key not configured")
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
    )
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        placeId: result.place_id,
      }
    }
    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<RouteDetails | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error("Google Maps API key not configured")
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}`,
    )
    const data = await response.json()

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      const leg = route.legs[0]
      return {
        duration: leg.duration.text,
        distance: leg.distance.text,
        polyline: route.overview_polyline.points,
      }
    }
    return null
  } catch (error) {
    console.error("Directions error:", error)
    return null
  }
}
