// File: components/EventSelectionPage.tsx
import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { DeveloperLabel } from "./DeveloperLabel";
import { Breadcrumbs } from "./Breadcrumbs";
import { Calendar, MapPin, Building, Users, ArrowRight, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Mock events data
const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2025",
    description: "The premier technology conference featuring the latest innovations in AI, cloud computing, and digital transformation.",
    date: "January 22-24, 2025",
    location: "Las Vegas Convention Center",
    exhibitorCount: 450,
    visitorCount: 12000,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    startDate: "2026-01-22"
  },
  {
    id: 2,
    name: "Healthcare Innovation Summit",
    description: "Bringing together healthcare professionals, researchers, and technology companies to explore the future of medicine.",
    date: "February 15-17, 2025",
    location: "Chicago McCormick Place",
    exhibitorCount: 320,
    visitorCount: 8500,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop",
    startDate: "2026-02-15"
  },
  {
    id: 3,
    name: "FinTech World Expo",
    description: "Discover the latest trends in financial technology, blockchain, and digital banking solutions.",
    date: "September 10-12, 2024", 
    location: "New York Javits Center",
    exhibitorCount: 380,
    visitorCount: 9200,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
    startDate: "2025-09-10"
  },
  {
    id: 4,
    name: "Green Energy Forum",
    description: "Connecting renewable energy innovators, investors, and industry leaders for a sustainable future.",
    date: "June 18-20, 2024",
    location: "San Francisco Convention Center", 
    exhibitorCount: 275,
    visitorCount: 6800,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop",
    startDate: "2025-06-18"
  }
];

export function EventSelectionPage({ user, onEventSelect, onLogout, onNavigate, selectedOrganiser, selectedCompany, selectedUser }) {
  const [events, setEvents] = useState(mockEvents);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  
  // Separate events into upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= today;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate < today;
  }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    openDate: "",
    closeDate: "",
    city: "",
    country: "",
    ccEmail: "",
    organiserEmail: "",
    companyLicenses: 5,
    allowDownload: false,
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);
  // ISO date string for date inputs
  const todayString = new Date().toISOString().split('T')[0];

  const formatDate = (dateString) => {
    return dateString;
  };

  const handleEventClick = (event) => {
    onEventSelect(event);
    // For Event Organiser, go to AdminDashboard after selecting event
    if (user?.role === "Event Organiser") {
      onNavigate && onNavigate("admin-dashboard", { event, organiser: selectedOrganiser });
    } else if (user?.role === "Admin") {
      onNavigate && onNavigate("admin-dashboard", { event });
    } else if (user?.role === "User") {
      // Lead-level users should land on their lead dashboard
      onNavigate && onNavigate("dashboard", { event });
    } else if (user?.role === "Super Admin") {
      onNavigate && onNavigate("event-organiser-dashboard", { event, organiser: selectedOrganiser });
    } else {
      // fallback: go to event dashboard
      onNavigate && onNavigate("event-admin-dashboard", { event });
    }
  };

  const handleAddEventClick = () => {
    // clean up any existing object URL preview
    if (logoPreview) {
      try { URL.revokeObjectURL(logoPreview); } catch (e) {}
      setLogoPreview(null);
    }

    setFormData({
      name: "",
      description: "",
      openDate: "",
      closeDate: "",
      city: "",
      country: "",
      ccEmail: "",
      organiserEmail: "",
      companyLicenses: 5,
      allowDownload: false,
      logo: null
    });
    setIsAddEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    // basic required fields validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.openDate || !formData.closeDate || !formData.city.trim() || !formData.country.trim() || !formData.organiserEmail.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // validate dates: openDate must be >= today, closeDate >= openDate
    const open = new Date(formData.openDate);
    const close = new Date(formData.closeDate);
    const startOfToday = new Date(todayString + "T00:00:00");

    if (open < startOfToday) {
      alert("Open date cannot be in the past");
      return;
    }

    if (close < open) {
      alert("Close date cannot be before open date");
      return;
    }

    // create image URL if a logo file was uploaded
    let imageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop";
    if (formData.logo && formData.logo instanceof File) {
      // Prefer the created preview if available
      try {
        imageUrl = logoPreview || URL.createObjectURL(formData.logo);
      } catch (e) {
        // fallback to default image
      }
    }

    const newEvent = {
      id: Math.max(...events.map(e => e.id), 0) + 1,
      name: formData.name,
      description: formData.description,
      date: `${formData.openDate} - ${formData.closeDate}`,
      location: `${formData.city}, ${formData.country}`,
      exhibitorCount: 0,
      visitorCount: 0,
      image: imageUrl,
      startDate: formData.openDate
    };

    setEvents([...events, newEvent]);
    setIsAddEventDialogOpen(false);
    setFormData({
      name: "",
      description: "",
      openDate: "",
      closeDate: "",
      city: "",
      country: "",
      ccEmail: "",
      organiserEmail: "",
      companyLicenses: 5,
      allowDownload: false,
      logo: null
    });
    // revoke preview URL after consuming it
    if (logoPreview) {
      try { URL.revokeObjectURL(logoPreview); } catch (e) {}
      setLogoPreview(null);
    }
  };

    // cleanup preview object URL on change/unmount
    useEffect(() => {
      return () => {
        if (logoPreview) {
          try { URL.revokeObjectURL(logoPreview); } catch (e) {}
        }
      };
    }, [logoPreview]);

    const showExhibitorVisitorCounts = user?.role !== "User" && user?.role !== "Company Admin";
  const showAddEventButton = user?.role === "Super Admin" || user?.role === "Event Organiser";

  return (
    <div className="min-h-screen bg-muted/30">
      <DeveloperLabel 
        pageName="EventSelectionPage" 
        popups={[]} 
      />
      
      <Navigation 
        user={user} 
        currentPage="events" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
      />

      {/* For Event Organiser, show organiser name as breadcrumb root on EventSelectionPage */}
      <Breadcrumbs
        user={user}
        selectedOrganiser={user?.role === "Event Organiser" ? selectedOrganiser : null}
        selectedEvent={null}
        selectedCompany={selectedCompany}
        selectedUser={selectedUser}
        onNavigate={onNavigate}
        currentPage="events"
      />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {showAddEventButton && (
              <Button onClick={handleAddEventClick} className="ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Event
              </Button>
            )}
          </div>

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold ">Upcoming Events</h2>
              <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Card 
                    key={event.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-md"
                    onClick={() => handleEventClick(event)}
                  >
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
                        
                        {showExhibitorVisitorCounts && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Building className="h-4 w-4 mr-1" />
                              <span>{event.exhibitorCount} exhibitors</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{event.visitorCount.toLocaleString()} visitors</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <div className="bg-muted/50 rounded-lg mt-6 p-6 -mx-6">
              <h2 className="text-2xl font-semibold  px-6">Past Events</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4 px-6">
                {pastEvents.map((event) => (
                  <Card 
                    key={event.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-md opacity-75 hover:opacity-100"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.name}
                        className="object-cover w-full h-full grayscale-[25%]"
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
                        
                        {showExhibitorVisitorCounts && (
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Building className="h-4 w-4 mr-1" />
                              <span>{event.exhibitorCount} exhibitors</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{event.visitorCount.toLocaleString()} visitors</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add New Event Dialog */}
      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Fill in the event details to create a new event
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name *</Label>
              <Input
                id="event-name"
                placeholder="e.g. SPVS Congress 2023"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="event-description">Description *</Label>
              <textarea
                id="event-description"
                placeholder="Event description"
                className="w-full p-2 border rounded-md min-h-20"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Dates (use native date pickers, disable past dates) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="open-date">Open Date *</Label>
                <Input
                  id="open-date"
                  type="date"
                  min={todayString}
                  value={formData.openDate}
                  onChange={(e) => setFormData({...formData, openDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="close-date">Close Date *</Label>
                <Input
                  id="close-date"
                  type="date"
                  min={formData.openDate || todayString}
                  value={formData.closeDate}
                  onChange={(e) => setFormData({...formData, closeDate: e.target.value})}
                />
              </div>
            </div>

            {/* Logo upload */}
            <div className="space-y-2">
              <Label htmlFor="event-logo">Event Logo</Label>
              <div className="flex items-center space-x-4">
                <input
                  id="event-logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                    // revoke previous preview
                    if (logoPreview) {
                      try { URL.revokeObjectURL(logoPreview); } catch (e) {}
                      setLogoPreview(null);
                    }
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      setFormData({...formData, logo: file});
                      setLogoPreview(preview);
                    } else {
                      setFormData({...formData, logo: null});
                    }
                  }}
                  className="border rounded p-1"
                />
                {formData.logo && (
                  <div className="w-20 h-20 overflow-hidden rounded bg-gray-100">
                    <img src={formData.logo instanceof File ? (logoPreview || '') : formData.logo} alt="logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g. London"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  placeholder="e.g. UK"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>

            {/* Emails */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cc-email">CC Email</Label>
                <Input
                  id="cc-email"
                  type="email"
                  placeholder="e.g. ccadmin@org.co.uk"
                  value={formData.ccEmail}
                  onChange={(e) => setFormData({...formData, ccEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organiser-email">Organiser Email *</Label>
                <Input
                  id="organiser-email"
                  type="email"
                  placeholder="e.g. organiser@org.co.uk"
                  value={formData.organiserEmail}
                  onChange={(e) => setFormData({...formData, organiserEmail: e.target.value})}
                />
              </div>
            </div>

            {/* Company Licenses */}
            <div className="space-y-2">
              <Label htmlFor="company-licenses">Company Licenses</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="company-licenses"
                  type="number"
                  min="1"
                  value={formData.companyLicenses}
                  onChange={(e) => setFormData({...formData, companyLicenses: parseInt(e.target.value) || 0})}
                  className="w-24"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allow-download"
                    checked={formData.allowDownload}
                    onChange={(e) => setFormData({...formData, allowDownload: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="allow-download" className="text-sm text-muted-foreground cursor-pointer">
                    Allow users to download data
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => {
                // close and cleanup previews
                if (logoPreview) {
                  try { URL.revokeObjectURL(logoPreview); } catch (e) {}
                  setLogoPreview(null);
                }
                setIsAddEventDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>
                Save Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// cleanup object URLs on unmount
