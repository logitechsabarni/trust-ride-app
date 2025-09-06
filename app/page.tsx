import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, MapPin, Smartphone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-primary mb-4">Trust Ride</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Safety you can trust, evidence you can verify.
          </p>
          <p className="text-lg text-foreground max-w-3xl mx-auto">
            Experience the future of ride-sharing with blockchain-verified safety, real-time tracking, and emergency
            protection that keeps you secure every mile.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Blockchain Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Every ride and safety alert is recorded on the blockchain for immutable verification
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Live Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time GPS tracking with route monitoring and location sharing with guardians
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Panic Button</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instant emergency alerts with automatic guardian notification and blockchain logging
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Verified Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All drivers undergo blockchain verification for enhanced safety and accountability
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready for Safer Journeys?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users who trust our blockchain-verified platform for their daily commutes and travels.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/auth/signup">Start Your Safe Journey</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
