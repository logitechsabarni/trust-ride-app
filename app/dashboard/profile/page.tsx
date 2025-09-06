import { ProfileSettings } from "@/components/dashboard/profile-settings"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and safety preferences.</p>
      </div>
      <ProfileSettings />
    </div>
  )
}
