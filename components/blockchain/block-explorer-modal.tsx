"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, XCircle, Copy, ExternalLink, Shield, Car, AlertTriangle, User } from "lucide-react"

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
}

interface BlockExplorerModalProps {
  txHash: string
  isOpen: boolean
  onClose: () => void
  record?: BlockchainRecord
}

export function BlockExplorerModal({ txHash, isOpen, onClose, record }: BlockExplorerModalProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In a real app, you'd show a toast notification here
    alert("Copied to clipboard!")
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "driver":
        return <User className="h-5 w-5 text-primary" />
      case "ride":
        return <Car className="h-5 w-5 text-primary" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      default:
        return <Shield className="h-5 w-5 text-primary" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-accent" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5" />
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

  // Mock blockchain data for demonstration
  const mockBlockData = {
    blockHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
    parentHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
    gasLimit: "30000000",
    gasUsed: record?.gas_used?.toString() || "21000",
    timestamp: record?.created_at ? new Date(record.created_at).getTime() / 1000 : Date.now() / 1000,
    nonce: Math.floor(Math.random() * 1000000),
    difficulty: "15000000000000000",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Block Explorer</span>
          </DialogTitle>
          <DialogDescription>Transaction details and blockchain verification information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transaction Overview</h3>
              {record && (
                <Badge variant={record.status === "verified" ? "secondary" : "outline"}>
                  {getStatusIcon(record.status)}
                  <span className="ml-1 capitalize">{record.status}</span>
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Transaction Hash</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-background px-2 py-1 rounded">{txHash}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(txHash)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {record && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Transaction Type</span>
                  <div className="flex items-center space-x-2">
                    {getEntityIcon(record.entity_type)}
                    <span className="text-sm">{getEntityTypeLabel(record.entity_type)}</span>
                  </div>
                </div>
              )}

              {record?.block_number && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Block Number</span>
                  <span className="text-sm font-mono">#{record.block_number.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Gas Used</span>
                <span className="text-sm font-mono">{mockBlockData.gasUsed}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Timestamp</span>
                <span className="text-sm">
                  {record?.created_at
                    ? new Date(record.created_at).toLocaleString()
                    : new Date(mockBlockData.timestamp * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Block Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Block Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Block Hash</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    {mockBlockData.blockHash.slice(0, 20)}...
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(mockBlockData.blockHash)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Parent Hash</span>
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {mockBlockData.parentHash.slice(0, 20)}...
                </code>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Gas Limit</span>
                <span className="text-sm font-mono">{Number.parseInt(mockBlockData.gasLimit).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Nonce</span>
                <span className="text-sm font-mono">{mockBlockData.nonce}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Verification Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Verification Status</h3>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-3">
                {record && getStatusIcon(record.status)}
                <div>
                  <p className="font-medium">
                    {record?.status === "verified"
                      ? "Transaction Verified"
                      : record?.status === "pending"
                        ? "Verification Pending"
                        : "Verification Failed"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {record?.status === "verified"
                      ? "This transaction has been successfully verified on the blockchain."
                      : record?.status === "pending"
                        ? "This transaction is currently being processed and verified."
                        : "This transaction failed verification. Please contact support."}
                  </p>
                  {record?.verified_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Verified at: {new Date(record.verified_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => copyToClipboard(txHash)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Transaction Hash
            </Button>
            <Button variant="outline" onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, "_blank")}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Etherscan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
