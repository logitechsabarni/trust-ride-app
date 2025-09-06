"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { getGoogleMapsScript } from "@/lib/maps-server"

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
  const [scriptUrl, setScriptUrl] = useState<string>("")

  useEffect(() => {
    const getScriptUrl = async () => {
      try {
        const url = await getGoogleMapsScript()
        setScriptUrl(url)
      } catch (error) {
        console.error("Failed to get Google Maps script:", error)
      }
    }

    getScriptUrl()
  }, [])

  useEffect(() => {
    if (!scriptUrl) return

    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete()
        return
      }

      const script = document.createElement("script")
      script.src = scriptUrl
      script.async = true
      script.defer = true
      script.onload = initializeAutocomplete
      document.head.appendChild(script)
    }

    const initializeAutocomplete = () => {
      if (window.google && window.google.maps && inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
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
  }, [onChange, scriptUrl])

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
