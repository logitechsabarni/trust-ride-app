"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface BlockchainRecord {
  status: "pending" | "verified" | "failed"
  entity_type: "driver" | "ride" | "alert"
}

interface BlockchainStatsProps {
  records?: BlockchainRecord[]
  isLoading?: boolean
}

export function BlockchainStats({ records = [], isLoading = false }: BlockchainStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
              <div className="w-4 h-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-muted rounded w-12"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalRecords = records.length
  const verifiedRecords = records.filter((r) => r.status === "verified").length
  const pendingRecords = records.filter((r) => r.status === "pending").length
  const verificationRate = totalRecords > 0 ? ((verifiedRecords / totalRecords) * 100).toFixed(1) : "0"

  const driverRecords = records.filter((r) => r.entity_type === "driver").length
  const rideRecords = records.filter((r) => r.entity_type === "ride").length
  const alertRecords = records.filter((r) => r.entity_type === "alert").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">{driverRecords}</span> drivers,{" "}
            <span className="text-accent">{rideRecords}</span> rides,{" "}
            <span className="text-accent">{alertRecords}</span> alerts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedRecords}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">{verificationRate}%</span> verification rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRecords}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">~2-5 min</span> avg verification time
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Health</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">99.8%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-accent">Excellent</span> network status
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
