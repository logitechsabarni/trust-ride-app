import { BlockchainDashboard } from "@/components/blockchain/blockchain-dashboard"

export default function BlockchainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Blockchain Dashboard</h1>
        <p className="text-muted-foreground">
          View all blockchain-verified records for drivers, rides, and safety alerts.
        </p>
      </div>
      <BlockchainDashboard />
    </div>
  )
}
