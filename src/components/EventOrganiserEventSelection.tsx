// File: components/EventOrganiserEventSelection.tsx
import { useState } from "react";
import { Navigation } from "./Navigation";
import { DeveloperLabel } from "./DeveloperLabel";
import { Calendar, MapPin, Building, Users, ArrowRight, Plus, Edit, Trash2, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Mock events data
const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2025",
    description: "The premier technology conference featuring the latest innovations in AI, cloud computing, and digital transformation.",
    date: "January 22-24, 2025",
    location: "Las Vegas Convention Center",
    exhibitorCount: 450,
    attendeeCount: 12000,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    tags: ["Technology", "AI", "Innovation"],
    openDate: "2025-01-22",
    closeDate: "2025-01-24",
    organiserEmail: "organiser@techconf.com",
    defaultLicenses: 5,
    allowReports: true,
    dataDeletionDate: "2025-04-24"
  },
  {
    id: 2,
    name: "Healthcare Innovation Summit",
    description: "Bringing together healthcare professionals, researchers, and technology companies to explore the future of medicine.",
    date: "February 15-17, 2025",
    location: "Chicago McCormick Place",
    exhibitorCount: 320,
    attendeeCount: 8500,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop",
    tags: ["Healthcare", "Medical", "Research"],
    openDate: "2025-02-15",
    closeDate: "2025-02-17",
    organiserEmail: "organiser@healthsummit.com",
    defaultLicenses: 3,
    allowReports: true,
    dataDeletionDate: "2025-05-17"
  }
];

export function AdvancedOrganiserEventSelection({ user, onEventSelect, onLogout, onNavigate }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [allowReports, setAllowReports] = useState(true);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleContinue = () => {
    if (selectedEvent) {
      onEventSelect(selectedEvent);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setAllowReports(true);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setAllowReports(event.allowReports);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (event, e) => {
    e.stopPropagation();
    console.log("Delete event:", event.name);
  };

  const formatDate = (dateString) => {
    return dateString;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DeveloperLabel 
        pageName="AdvancedOrganiserEventSelection" 
        popups={[
          ...(isEventDialogOpen ? ["EventDialog"] : [])
        ]} 
      />
      
      <Navigation 
        user={user} 
        currentPage="events" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
      />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl mb-4">Manage Your Events</h1>
                <p className="text-xl text-muted-foreground">
                  Select an event to manage or create a new one
                </p>
              </div>
              <Button onClick={handleAddEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockEvents.map((event) => (
              <Card 
                key={event.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg relative ${
                  selectedEvent?.id === event.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleEventClick(event)}
              >
                <div className="absolute top-2 right-2 z-10 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => handleEditEvent(event, e)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-destructive hover:text-destructive"
                    onClick={(e) => handleDeleteEvent(event, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{event.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{event.exhibitorCount} exhibitors</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.attendeeCount.toLocaleString()} attendees</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedEvent && (
            <div className="mt-8 text-center">
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">You've selected:</h3>
                      <p className="text-primary font-medium">{selectedEvent.name}</p>
                    </div>
                    <Button onClick={handleContinue} className="w-full">
                      Continue to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update event information and settings" : "Create a new event with all necessary details"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input 
                  id="eventName"
                  placeholder="Enter event name" 
                  defaultValue={editingEvent?.name || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventLocation">Event Location *</Label>
                <Input 
                  id="eventLocation"
                  placeholder="Enter venue location" 
                  defaultValue={editingEvent?.location || ""} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea 
                id="eventDescription"
                placeholder="Describe your event..." 
                className="min-h-[100px]"
                defaultValue={editingEvent?.description || ""} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openDate">Open Date *</Label>
                <Input 
                  id="openDate"
                  type="date"
                  defaultValue={editingEvent?.openDate || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeDate">Close Date *</Label>
                <Input 
                  id="closeDate"
                  type="date"
                  defaultValue={editingEvent?.closeDate || ""} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataDeletionDate">Data Deletion Date</Label>
              <Input 
                id="dataDeletionDate"
                type="date"
                defaultValue={editingEvent?.dataDeletionDate || ""} 
              />
              <p className="text-sm text-muted-foreground">
                Date when all event data will be automatically deleted
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventLogo">Event Logo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop your event logo
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organiserEmail">Organiser Email *</Label>
                <Input 
                  id="organiserEmail"
                  type="email"
                  placeholder="organiser@company.com" 
                  defaultValue={editingEvent?.organiserEmail || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultLicenses">Default Licenses per Company</Label>
                <Input 
                  id="defaultLicenses"
                  type="number"
                  min="1"
                  max="50"
                  placeholder="5" 
                  defaultValue={editingEvent?.defaultLicenses || 5} 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="allowReports">Allow Exhibitor Report Downloads</Label>
                <p className="text-sm text-muted-foreground">
                  Enable exhibitors to download their lead reports
                </p>
              </div>
              <Switch 
                id="allowReports"
                checked={allowReports}
                onCheckedChange={setAllowReports}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
