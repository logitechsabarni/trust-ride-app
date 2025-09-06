"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlockchainStats } from "./blockchain-stats"
import { BlockExplorerModal } from "./block-explorer-modal"
import { Shield, Car, AlertTriangle, Clock, CheckCircle, ExternalLink, XCircle, User } from "lucide-react"

interface BlockchainRecord {
  id: number
  entity_type: "driver" | "ride" | "alert"
  entity_id: number
  tx_hash: string
  status: "pending" | "verified" | "failed"
  block_number?: number
  gas_used?: number
  created_at: string
  verified_at?: string
  entity_details?: {
    name?: string
    description?: string
    location?: string
  }
}

export function BlockchainDashboard() {
  const [records, setRecords] = useState<BlockchainRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTx, setSelectedTx] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchBlockchainRecords()
  }, [])

  const fetchBlockchainRecords = async () => {
    try {
      const token = localStorage.getItem("trust-ride-token")
      const response = await fetch("/api/blockchain/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecords(data.logs)
      }
    } catch (error) {
      console.error("Failed to fetch blockchain records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "driver":
        return <User className="h-4 w-4" />
      case "ride":
        return <Car className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getEntityTypeLabel = (type: string) => {
    switch (type) {
      case "driver":
        return "Driver Verification"
      case "ride":
        return "Ride Booking"
      case "alert":
        return "Safety Alert"
      default:
        return "Blockchain Record"
    }
  }

  const filteredRecords = records.filter((record) => {
    if (activeTab === "all") return true
    return record.entity_type === activeTab
  })

  const openBlockExplorer = (txHash: string) => {
    setSelectedTx(txHash)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BlockchainStats isLoading={true} />
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Records</CardTitle>
            <CardDescription>Loading blockchain verification records...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BlockchainStats records={records} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Blockchain Verification Records
          </CardTitle>
          <CardDescription>All blockchain transactions for drivers, rides, and safety alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="driver">Drivers</TabsTrigger>
              <TabsTrigger value="ride">Rides</TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No blockchain records found for this category.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {getEntityIcon(record.entity_type)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{getEntityTypeLabel(record.entity_type)}</h4>
                              {getStatusBadge(record.status)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.entity_details?.name && (
                                <p className="font-medium">{record.entity_details.name}</p>
                              )}
                              {record.entity_details?.description && <p>{record.entity_details.description}</p>}
                              {record.entity_details?.location && <p>📍 {record.entity_details.location}</p>}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Created: {new Date(record.created_at).toLocaleString()}</span>
                              {record.verified_at && (
                                <span>Verified: {new Date(record.verified_at).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openBlockExplorer(record.tx_hash)}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="pl-13 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="space-y-1">
                            <div>
                              <span className="font-medium">Transaction Hash:</span>
                              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">{record.tx_hash}</code>
                            </div>
                            {record.block_number && (
                              <div>
                                <span className="font-medium">Block:</span>
                                <span className="ml-2">#{record.block_number.toLocaleString()}</span>
                              </div>
                            )}
                            {record.gas_used && (
                              <div>
                                <span className="font-medium">Gas Used:</span>
                                <span className="ml-2">{record.gas_used.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTx && (
        <BlockExplorerModal
          txHash={selectedTx}
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          record={records.find((r) => r.tx_hash === selectedTx)}
        />
      )}
    </div>
  )
}
