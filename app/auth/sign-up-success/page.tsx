import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Trust Ride</h1>
          <p className="text-muted-foreground">Safety you can trust, evidence you can verify.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Check your email</CardTitle>
            <CardDescription className="text-center">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              You've successfully signed up for Trust Ride! Please check your email and click the confirmation link to
              activate your account before signing in.
            </p>
            <div className="text-center">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
