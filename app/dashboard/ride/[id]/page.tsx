import { RideTracking } from "@/components/ride/ride-tracking"

interface RideTrackingPageProps {
  params: {
    id: string
  }
}

export default function RideTrackingPage({ params }: RideTrackingPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Live Ride Tracking</h1>
        <p className="text-muted-foreground">Track your current ride in real-time.</p>
      </div>
      <RideTracking rideId={params.id} />
    </div>
  )
}
