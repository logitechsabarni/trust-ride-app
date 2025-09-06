import { RideHistory } from "@/components/ride/ride-history"

export default function RidesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Rides</h1>
        <p className="text-muted-foreground">View your ride history and blockchain verification status.</p>
      </div>
      <RideHistory />
    </div>
  )
}
