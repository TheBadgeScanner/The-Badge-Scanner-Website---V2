// File: components/AdminEventSelectionPage.tsx
import { Navigation } from "./Navigation";
import { Calendar, Users, TrendingUp, ArrowRight, MapPin, Building } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2025",
    date: "Jan 22-24, 2025",
    location: "San Francisco Convention Center",
    description: "Annual technology conference featuring the latest innovations",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    status: "Active",
    companies: 45,
    teamLeads: 127,
    myLeads: 12
  },
  {
    id: 2,
    name: "Innovation Summit",
    date: "Feb 14-16, 2025", 
    location: "Innovation Hub NYC",
    description: "Summit focused on breakthrough technologies and startups",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop",
    status: "Upcoming",
    companies: 32,
    teamLeads: 0,
    myLeads: 0
  },
  {
    id: 3,
    name: "Digital Expo",
    date: "Mar 10-12, 2025",
    location: "Los Angeles Convention Center", 
    description: "Digital transformation and industry 4.0 expo",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
    status: "Upcoming",
    companies: 28,
    teamLeads: 0,
    myLeads: 0
  }
];

export function AdminEventSelectionPage({ user, onEventSelect, onLogout, onNavigate }) {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Upcoming": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Completed": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Developer Label */}
      <div className="fixed bottom-4 right-4 z-50 bg-yellow-200 border-2 border-yellow-400 px-3 py-2 rounded-lg shadow-lg font-mono text-sm">
        AdminEventSelectionPage
      </div>

      <Navigation 
        user={user} 
        currentPage="events" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
      />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl">Select Event</h1>
          </div>
          
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-blue-50 border-blue-200 border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Events</CardTitle>
                <Calendar className="h-8 w-8 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{mockEvents.length}</div>
                <p className="text-sm text-muted-foreground">available events</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Active Events</CardTitle>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {mockEvents.filter(e => e.status === "Active").length}
                </div>
                <p className="text-sm text-muted-foreground">currently running</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Team Leads</CardTitle>
                <Users className="h-8 w-8 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {mockEvents.reduce((sum, event) => sum + event.teamLeads, 0)}
                </div>
                <p className="text-sm text-muted-foreground">across all events</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl">Your Events</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockEvents.map((event) => (
              <Card 
                key={event.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onEventSelect(event)}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusBadgeColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-medium line-clamp-1">{event.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>{event.companies} companies</span>
                      </div>
                    </div>

                    {/* Event Statistics */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{event.teamLeads}</div>
                        <div className="text-xs text-muted-foreground">Team Leads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{event.companies}</div>
                        <div className="text-xs text-muted-foreground">Companies</div>
                      </div>
                    </div>

                    <Button className="w-full mt-4 group">
                      <span>Manage Event</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
