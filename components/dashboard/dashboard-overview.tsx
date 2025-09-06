"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Shield, AlertTriangle, Clock, MapPin, CheckCircle, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your safety overview for today.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/book-ride">
            <Car className="mr-2 h-4 w-4" />
            Book New Ride
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Rides</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">91.7%</span> verification rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">Resolved</span> within 2 minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+1.2</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Rides
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/book-ride">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Downtown to Airport</p>
                <p className="text-xs text-muted-foreground">With Sarah Johnson • 2 hours ago</p>
              </div>
              <Badge variant="secondary">
                <CheckCircle className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Home to Office</p>
                <p className="text-xs text-muted-foreground">With Mike Davis • Tomorrow 8:00 AM</p>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Blockchain Activity
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/blockchain">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Ride Verification</p>
                <p className="text-xs text-muted-foreground">Block #18500003 • 2 hours ago</p>
              </div>
              <Badge variant="secondary">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Safety Alert Logged</p>
                <p className="text-xs text-muted-foreground">Block #18500002 • 1 day ago</p>
              </div>
              <Badge variant="secondary">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you stay safe and connected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              asChild
            >
              <Link href="/dashboard/book-ride">
                <Car className="h-6 w-6" />
                <span>Book Emergency Ride</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              asChild
            >
              <Link href="/dashboard/alerts">
                <AlertTriangle className="h-6 w-6" />
                <span>Test Panic Button</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              asChild
            >
              <Link href="/dashboard/profile">
                <MapPin className="h-6 w-6" />
                <span>Update Guardian Contact</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
