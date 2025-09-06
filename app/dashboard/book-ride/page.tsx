import { RideBookingForm } from "@/components/ride/ride-booking-form"
import { AvailableDrivers } from "@/components/ride/available-drivers"

export default function BookRidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Book a Ride</h1>
        <p className="text-muted-foreground">Choose your destination and get matched with a verified driver.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RideBookingForm />
        <AvailableDrivers />
      </div>
    </div>
  )
}
