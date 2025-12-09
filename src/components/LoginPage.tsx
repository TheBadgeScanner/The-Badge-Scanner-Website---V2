// File: components/LoginPage.tsx
import { useState } from "react";
import { DeveloperLabel } from "./DeveloperLabel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Copy } from "lucide-react";
import { copyWithFeedback } from "./utils/clipboardUtils";

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  const demoCredentials = [
    { role: "User", email: "user@company.com", password: "password123" },
    { role: "Admin", email: "admin@company.com", password: "password123" },
    { role: "Event Admin", email: "eventadmin@events.com", password: "password123" },
    { role: "Event Organiser", email: "organiser@events.com", password: "password123" },
    { role: "Super Admin", email: "superadmin@system.com", password: "password123" }
  ];

  const handleDemoLogin = (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    onLogin(credentials);
  };

  const handleCopyCredentials = async (e, cred) => {
    e.stopPropagation();
    const textToCopy = `Email: ${cred.email}\nPassword: ${cred.password}`;
    await copyWithFeedback(textToCopy);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <DeveloperLabel pageName="LoginPage" popups={[]} />
      
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary-foreground text-2xl font-bold">TBS</span>
            </div>
            <CardTitle className="text-2xl">Welcome to The Badge Scanner</CardTitle>
            <CardDescription>
              Sign in to your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>
              Click any credential below to automatically sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoCredentials.map((cred, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleDemoLogin(cred)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {cred.role}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{cred.email}</p>
                  <p className="text-xs text-muted-foreground">{cred.password}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleCopyCredentials(e, cred)}
                  title="Copy credentials to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
