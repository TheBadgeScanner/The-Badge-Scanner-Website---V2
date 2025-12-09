// File: components/SettingsPage.tsx
import { Navigation } from "./Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Badge,
  Shield,
  User,
  Mail,
  Building,
} from "lucide-react";

export function SettingsPage({ user, onLogout, onNavigate }) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Developer Label */}
      <div className="fixed bottom-4 right-4 z-50 bg-yellow-200 border-2 border-yellow-400 px-3 py-2 rounded-lg shadow-lg font-mono text-sm">
        SettingsPage
      </div>

      <Navigation
        user={user}
        currentPage="settings"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and profile
            information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Settings */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile
                  details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">
                      First Name
                    </Label>
                    <Input id="firstName" defaultValue="{Firstname " />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Lastname}" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    defaultValue={user?.company}
                  />
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Sales Manager"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security</span>
                </CardTitle>
                <CardDescription>
                  Update your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">
                    Current Password
                  </Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div>
                  <Label htmlFor="newPassword">
                    New Password
                  </Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirm New Password
                  </Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-semibold">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.role}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.company}</span>
                  </div>
                </div>

                <Separator />

                <div className="text-sm">
                  <p className="text-muted-foreground">
                    Account since
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p>January 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
