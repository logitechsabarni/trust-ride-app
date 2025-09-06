import { SafetyAlerts } from "@/components/alerts/safety-alerts"
import { EmergencyControls } from "@/components/alerts/emergency-controls"

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Safety Alerts</h1>
        <p className="text-muted-foreground">Manage your safety alerts and emergency settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SafetyAlerts />
        </div>
        <div>
          <EmergencyControls />
        </div>
      </div>
    </div>
  )
}
