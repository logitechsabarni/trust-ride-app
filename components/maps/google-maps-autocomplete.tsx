"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

interface GoogleMapsAutocompleteProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string, placeDetails?: any) => void
  disabled?: boolean
}

export function GoogleMapsAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}: GoogleMapsAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeAutocomplete
      document.head.appendChild(script)
    }

    const initializeAutocomplete = () => {
      if (window.google && window.google.maps && inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" }, // Restrict to US addresses
        })

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace()
          if (place.formatted_address) {
            onChange(place.formatted_address, {
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng(),
              placeId: place.place_id,
            })
          }
        })

        setIsLoaded(true)
      }
    }

    loadGoogleMaps()

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onChange])

  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="flex items-center">
        <MapPin className="mr-1 h-4 w-4 text-primary" />
        {label}
      </Label>
      <Input
        ref={inputRef}
        placeholder={isLoaded ? placeholder : "Loading Google Maps..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || !isLoaded}
      />
    </div>
  )
}
