// File: components/SuperAdminDashboard.tsx
import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { DeveloperLabel } from "./DeveloperLabel";
import { Breadcrumbs } from "./Breadcrumbs";
import { Users, Building2, Calendar, AlertTriangle, TrendingUp, Target, Award, Edit, Plus, HelpCircle, CheckCircle, XCircle, Clock, Filter, X } from "lucide-react";
import { useSelectedScope } from "../contexts/SelectedScopeContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AnimatedCounter } from "./ui/animated-counter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Mock system-wide data
const mockSystemMetrics = {
  totalEvents: 15,
  totalOrganisers: 8,
  totalCompanies: 156,
  totalLeads: 12847,
  avgSalesIntelScore: 7.4,
  avgConversionScore: 6.9,
  systemHealth: "Excellent"
};

// Mock potential issues with counts
const mockPotentialIssues = [
  { id: 1, type: "unmatched_scans", count: 23, label: "Unmatched Scans", severity: "medium" },
  { id: 2, type: "inactive_companies", count: 5, label: "Inactive Companies", severity: "high" },
  { id: 3, type: "failed_logins", count: 12, label: "Repeat Failed Logins", severity: "medium" },
  { id: 4, type: "license_usage", count: 8, label: "Low License Usage", severity: "low" }
];

// Mock inbox data for events with issues
const mockInboxData = [
  {
    id: 1,
    eventName: "Tech Conference 2025",
    eventDate: "Jan 22-24, 2025",
    organiser: "Mike Wilson",
    issues: [
      { type: "unmatched_scans", count: 15, label: "Unmatched Scans" },
      { type: "inactive_companies", count: 2, label: "Inactive Companies" }
    ]
  },
  {
    id: 2,
    eventName: "Healthcare Innovation Summit",
    eventDate: "Feb 15-17, 2025",
    organiser: "Sarah Chen",
    issues: [
      { type: "failed_logins", count: 8, label: "Repeat Failed Logins" },
      { type: "license_usage", count: 3, label: "Low License Usage" }
    ]
  },
  {
    id: 3,
    eventName: "FinTech World Expo",
    eventDate: "Mar 10-12, 2025",
    organiser: "David Rodriguez",
    issues: [
      { type: "unmatched_scans", count: 8, label: "Unmatched Scans" },
      { type: "failed_logins", count: 4, label: "Repeat Failed Logins" }
    ]
  }
];

// Mock event organisers data - now using company names
const mockEventOrganisers = [
  {
    id: 1,
    name: "Event Management Co",
    supportEmail: "support@eventmanagement.com",
    description: "Professional event management and organization services",
    eventsManaged: 3,
    status: "active"
  },
  {
    id: 2,
    name: "EventPro Management",
    supportEmail: "support@eventpro.com", 
    description: "Advanced event planning and execution",
    eventsManaged: 5,
    status: "active"
  },
  {
    id: 3,
    name: "MegaEvents Co",
    supportEmail: "support@megaevents.com",
    description: "Large-scale event organization and coordination", 
    eventsManaged: 2,
    status: "active"
  },
  {
    id: 4,
    name: "Conference Badges L",
    supportEmail: "support@conferencebadges.com",
    description: "Specializing in conference badge solutions and attendee management",
    eventsManaged: 4,
    status: "active"
  }
];

export function SuperAdminDashboard({ user, selectedEvent, onLogout, onNavigate, selectedOrganiser, selectedCompany, selectedUser }) {
  const [organisers, setOrganisers] = useState(mockEventOrganisers);
  const [editingOrganiser, setEditingOrganiser] = useState(null);
  const [isOrganiserDialogOpen, setIsOrganiserDialogOpen] = useState(false);
  const [inboxFilters, setInboxFilters] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    supportEmail: "",
    description: ""
  });

  // Get context values for breadcrumbs
  const {
    selectedEvent: contextSelectedEvent,
    selectedOrganiser: contextSelectedOrganiser,
    selectedCompany: contextSelectedCompany,
    selectedUser: contextSelectedUser,
    setSelectedOrganiser: setContextSelectedOrganiser,
    setSelectedEvent: setContextSelectedEvent,
    setSelectedCompany: setContextSelectedCompany,
    setSelectedUser: setContextSelectedUser,
  } = useSelectedScope();

  // Clear deeper selections when on SuperAdminDashboard and scroll to top
  useEffect(() => {
    // Keep organiser selection but clear event/company/user when viewing SuperAdminDashboard at top level
    // This ensures breadcrumbs only show what's relevant
    
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditOrganiser = (organiser) => {
    setEditingOrganiser(organiser);
    setFormData({
      name: organiser.name,
      supportEmail: organiser.supportEmail,
      description: organiser.description
    });
    setIsOrganiserDialogOpen(true);
  };

  const handleAddOrganiser = () => {
    setEditingOrganiser(null);
    setFormData({
      name: "",
      supportEmail: "",
      description: ""
    });
    setIsOrganiserDialogOpen(true);
  };

  const handleSaveOrganiser = () => {
    if (!formData.name.trim() || !formData.supportEmail.trim() || !formData.description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (editingOrganiser) {
      // Update existing organiser
      setOrganisers(organisers.map(org => 
        org.id === editingOrganiser.id 
          ? { ...org, name: formData.name, supportEmail: formData.supportEmail, description: formData.description }
          : org
      ));
    } else {
      // Add new organiser
      const newOrganiser = {
        id: Math.max(...organisers.map(o => o.id), 0) + 1,
        name: formData.name,
        supportEmail: formData.supportEmail,
        description: formData.description,
        eventsManaged: 0,
        status: "active"
      };
      setOrganisers([...organisers, newOrganiser]);
    }
    
    setIsOrganiserDialogOpen(false);
    setFormData({ name: "", supportEmail: "", description: "" });
  };

  const handleOrganiserClick = (organiser) => {
    // Navigate to EventOrganiserDashboard and pass the organiser data
    onNavigate("event-organiser-dashboard", { organiser });
  };

  const handleEditOrganiserClick = (organiser) => {
    setEditingOrganiser(organiser);
    setIsOrganiserDialogOpen(true);
  };

  const handleInboxIssueClick = (eventId, issueType) => {
    // Set filters for the event organiser dashboard
    const filters = { [issueType]: true };
    setInboxFilters(filters);
    
    // Navigate to event organiser dashboard with filters
    onNavigate("event-organiser-dashboard", { filters });
  };

  const clearInboxFilters = () => {
    setInboxFilters({});
  };

  const handleEventClick = (event) => {
    // Navigate to EventAdminDashboard for the selected event
    onNavigate("event-admin-dashboard", { event });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DeveloperLabel 
        pageName="SuperAdminDashboard" 
        popups={isOrganiserDialogOpen ? ["OrganiserDialog"] : []} 
      />

      <Navigation 
        user={user} 
        currentPage="super-admin-dashboard" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
      />

      <div className="invisible">
        <Breadcrumbs
          user={user}
          selectedOrganiser={contextSelectedOrganiser}
          selectedEvent={null}
          selectedCompany={null}
          selectedUser={null}
          onNavigate={onNavigate}
          currentPage="super-admin-dashboard"
        />
      </div>

      <main className="container mx-auto px-6 py-4 space-y-8 pt-28">
        <TooltipProvider>
          {/* Hero Section */}
          <div className="space-y-6 space-x-6">
            <div className="flex items-center gap-6 lg:gap-8">
              <h1 className="text-4xl sm:text-3xl lg:text-4xl font-bold whitespace-nowrap">System Overview</h1>
              
              {/* System Metrics Cards - Compact inline version */}
              <div className="flex gap-6 sm:gap-3 lg:gap-4 flex-1 justify-evenly -mt-4 sm:-mt-5">
                <Card className="bg-blue-50 border-blue-200 border flex-1 min-w-0">
                  <CardContent className="flex items-center gap-3 sm:gap-3 p-2 sm:p-2">
                    {/* Icon size: h-12/w-12 (small), h-14/w-14 (medium), h-16/w-16 (large) */}
                    <Calendar className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-blue-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1 text-center">
                      {/* Title size: text-base (small), text-lg (medium), text-xl (large) */}
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground whitespace-nowrap">Total Events</div>
                      {/* Number size: text-2xl (small), text-3xl (medium), text-4xl (large) */}
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 leading-tight">
                        <AnimatedCounter value={mockSystemMetrics.totalEvents} duration={1500} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200 border flex-1 min-w-0">
                  <CardContent className="flex items-center gap-3 sm:gap-3 p-2 sm:p-2">
                    {/* Icon size: h-12/w-12 (small), h-14/w-14 (medium), h-16/w-16 (large) */}
                    <Building2 className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-purple-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1 text-center">
                      {/* Title size: text-base (small), text-lg (medium), text-xl (large) */}
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground whitespace-nowrap">Total Exhibitors</div>
                      {/* Number size: text-xl (small), text-2xl (medium), text-3xl (large) */}
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 leading-tight">
                        <AnimatedCounter value={mockSystemMetrics.totalCompanies} duration={1500} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-50 border-emerald-200 border flex-1 min-w-0">
                  <CardContent className="flex items-center gap-3 sm:gap-3 p-2 sm:p-2">
                    {/* Icon size: h-12/w-12 (small), h-14/w-14 (medium), h-16/w-16 (large) */}
                    <Users className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-emerald-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1 text-center">
                      {/* Title size: text-base (small), text-lg (medium), text-xl (large) */}
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground whitespace-nowrap">Total Leads</div>
                      {/* Number size: text-xl (small), text-2xl (medium), text-3xl (large) */}
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 leading-tight">
                        <AnimatedCounter value={mockSystemMetrics.totalLeads} duration={1500} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Event Organiser Management Section (moved up) */}
            <Card>
              <CardHeader>
                <CardTitle>Event Organiser Management</CardTitle>
                <CardDescription>Manage event organisers and quick access to their events</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Event Organisers</h3>
                    <Button size="sm" onClick={handleAddOrganiser}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event Organiser
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {organisers.map((org) => (
                      <div
                        key={org.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOrganiserClick(org)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleOrganiserClick(org); }}
                        className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{org.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{org.supportEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-medium block">{org.eventsManaged}</span>
                            <span className="text-xs text-muted-foreground">events</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleEditOrganiserClick(org);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Section Layout moved down: Upcoming Events, Calendar & Potential Issues */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Column - Upcoming Events */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>Upcoming Events</CardTitle>
                  <Calendar className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick({
                      id: 1,
                      name: "Tech Conference 2025",
                      date: "January 22-24, 2025",
                      location: "Las Vegas Convention Center",
                      exhibitorCount: 45,
                      visitorCount: 1200
                    })}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-500 text-white rounded flex-shrink-0">
                      <span className="text-xs">Wed</span>
                      <span className="font-bold">22</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Tech Conference 2025</h4>
                      <p className="text-sm text-muted-foreground truncate">EventPro Management • 45 companies</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick({
                      id: 2,
                      name: "Innovation Summit",
                      date: "January 24-26, 2025",
                      location: "Chicago Convention Center",
                      exhibitorCount: 32,
                      visitorCount: 850
                    })}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-green-500 text-white rounded flex-shrink-0">
                      <span className="text-xs">Fri</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Innovation Summit</h4>
                      <p className="text-sm text-muted-foreground truncate">City Events Ltd • 32 companies</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick({
                      id: 3,
                      name: "Digital Expo",
                      date: "January 26-28, 2025",
                      location: "San Francisco Expo Center",
                      exhibitorCount: 28,
                      visitorCount: 620
                    })}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-purple-500 text-white rounded flex-shrink-0">
                      <span className="text-xs">Sun</span>
                      <span className="font-bold">26</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Digital Expo</h4>
                      <p className="text-sm text-muted-foreground truncate">TradeShow Organization • 28 companies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Middle Column - Calendar */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>January 2025</CardTitle>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Calendar Header - Days of Week */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Week 1 - Empty cells for days before month starts (Jan 1 is Wed) */}
                      <div className="aspect-square"></div>
                      <div className="aspect-square"></div>
                      <div className="aspect-square"></div>
                      
                      {/* Jan 1-4 */}
                      {[1, 2, 3, 4].map(day => (
                        <div key={day} className="aspect-square flex items-center justify-center text-sm border rounded hover:bg-muted/50">
                          {day}
                        </div>
                      ))}

                      {/* Week 2 - Jan 5-11 */}
                      {[5, 6, 7, 8, 9, 10, 11].map(day => (
                        <div key={day} className="aspect-square flex items-center justify-center text-sm border rounded hover:bg-muted/50">
                          {day}
                        </div>
                      ))}

                      {/* Week 3 - Jan 12-18 */}
                      {[12, 13, 14, 15, 16, 17, 18].map(day => (
                        <div key={day} className="aspect-square flex items-center justify-center text-sm border rounded hover:bg-muted/50">
                          {day}
                        </div>
                      ))}

                      {/* Week 4 - Jan 19-25 */}
                      {[19, 20, 21].map(day => (
                        <div key={day} className="aspect-square flex items-center justify-center text-sm border rounded hover:bg-muted/50">
                          {day}
                        </div>
                      ))}
                      
                      {/* Jan 22-24 - Tech Conference (Blue) */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="aspect-square flex items-center justify-center text-sm border-2 border-blue-500 bg-blue-100 rounded font-semibold cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={() => handleEventClick({
                              id: 1,
                              name: "Tech Conference 2025",
                              date: "January 22-24, 2025",
                              location: "Las Vegas Convention Center",
                              exhibitorCount: 45,
                              visitorCount: 1200
                            })}
                          >
                            22
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">Tech Conference 2025</p>
                            <p className="text-xs">Jan 22-24, 2025</p>
                            <p className="text-xs">45 exhibitors • 1,200 visitors</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="aspect-square flex items-center justify-center text-sm border-2 border-blue-500 bg-blue-100 rounded font-semibold cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={() => handleEventClick({
                              id: 1,
                              name: "Tech Conference 2025",
                              date: "January 22-24, 2025",
                              location: "Las Vegas Convention Center",
                              exhibitorCount: 45,
                              visitorCount: 1200
                            })}
                          >
                            23
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">Tech Conference 2025</p>
                            <p className="text-xs">Jan 22-24, 2025</p>
                            <p className="text-xs">45 exhibitors • 1,200 visitors</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="aspect-square flex items-center justify-center text-sm relative cursor-pointer"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const clickY = e.clientY - rect.top;
                              if (clickY < rect.height / 2) {
                                handleEventClick({
                                  id: 1,
                                  name: "Tech Conference 2025",
                                  date: "January 22-24, 2025",
                                  location: "Las Vegas Convention Center",
                                  exhibitorCount: 45,
                                  visitorCount: 1200
                                });
                              } else {
                                handleEventClick({
                                  id: 2,
                                  name: "Innovation Summit",
                                  date: "January 24-26, 2025",
                                  location: "Chicago Convention Center",
                                  exhibitorCount: 32,
                                  visitorCount: 850
                                });
                              }
                            }}
                          >
                            <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-blue-500 bg-blue-100 rounded-t hover:bg-blue-200 transition-colors" style={{ height: '50%' }}></div>
                            <div className="absolute inset-0 top-1/2 border-b-2 border-l-2 border-r-2 border-green-500 bg-green-100 rounded-b hover:bg-green-200 transition-colors" style={{ height: '50%' }}></div>
                            <span className="relative z-10 font-semibold">24</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-2">
                            <div className="space-y-1 border-b pb-2">
                              <p className="font-semibold text-blue-600">Tech Conference 2025</p>
                              <p className="text-xs">Jan 22-24, 2025</p>
                              <p className="text-xs">45 exhibitors • 1,200 visitors</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-green-600">Innovation Summit</p>
                              <p className="text-xs">Jan 24-26, 2025</p>
                              <p className="text-xs">32 exhibitors • 850 visitors</p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      <div className="aspect-square flex items-center justify-center text-sm border rounded hover:bg-muted/50">
                        25
                      </div>

                      {/* Week 5 - Jan 26-31 */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="aspect-square flex items-center justify-center text-sm relative cursor-pointer"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const clickY = e.clientY - rect.top;
                              if (clickY < rect.height / 2) {
                                handleEventClick({
                                  id: 2,
                                  name: "Innovation Summit",
                                  date: "January 24-26, 2025",
                                  location: "Chicago Convention Center",
                                  exhibitorCount: 32,
                                  visitorCount: 850
                                });
                              } else {
                                handleEventClick({
                                  id: 3,
                                  name: "Digital Expo",
                                  date: "January 26-28, 2025",
                                  location: "San Francisco Expo Center",
                                  exhibitorCount: 28,
                                  visitorCount: 620
                                });
                              }
                            }}
                          >
                            <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-green-500 bg-green-100 rounded-t hover:bg-green-200 transition-colors" style={{ height: '50%' }}></div>
                            <div className="absolute inset-0 top-1/2 border-b-2 border-l-2 border-r-2 border-purple-500 bg-purple-100 rounded-b hover:bg-purple-200 transition-colors" style={{ height: '50%' }}></div>
                            <span className="relative z-10 font-semibold">26</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-2">
                            <div className="space-y-1 border-b pb-2">
                              <p className="font-semibold text-green-600">Innovation Summit</p>
                              <p className="text-xs">Jan 24-26, 2025</p>
                              <p className="text-xs">32 exhibitors • 850 visitors</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-purple-600">Digital Expo</p>
                              <p className="text-xs">Jan 26-28, 2025</p>
                              <p className="text-xs">28 exhibitors • 620 visitors</p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="aspect-square flex items-center justify-center text-sm border-2 border-purple-500 bg-purple-100 rounded font-semibold cursor-pointer hover:bg-purple-200 transition-colors"
                            onClick={() => handleEventClick({
                              id: 3,
                              name: "Digital Expo",
                              date: "January 26-28, 2025",
                              location: "San Francisco Expo Center",
                              exhibitorCount: 28,
                              visitorCount: 620
                            })}
                          >
                            27
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">Digital Expo</p>
                            <p className="text-xs">Jan 26-28, 2025</p>
                            <p className="text-xs">28 exhibitors • 620 visitors</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="aspect-square flex items-center justify-center text-sm border-2 border-purple-500 bg-purple-100 rounded font-semibold cursor-pointer hover:bg-purple-200 transition-colors"
                            onClick={() => handleEventClick({
                              id: 3,
                              name: "Digital Expo",
                              date: "January 26-28, 2025",
                              location: "San Francisco Expo Center",
                              exhibitorCount: 28,
                              visitorCount: 620
                            })}
                          >
                            28
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">Digital Expo</p>
                            <p className="text-xs">Jan 26-28, 2025</p>
                            <p className="text-xs">28 exhibitors • 620 visitors</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      {[29, 30, 31].map(day => (
                        <div key={day} className="aspect-square flex items-center justify-center text-sm border rounded hover:bg-muted/50">
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Potential Issues */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>Potential Issues</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full">
                        <span className="text-lg font-bold">24</span>
                      </div>
                      <span className="font-medium">unmatched scans</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full">
                        <span className="text-lg font-bold">6</span>
                      </div>
                      <span className="font-medium">inactive companies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>



            {/* Inbox Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inbox</CardTitle>
                    <CardDescription>
                      Event-specific issues requiring attention
                      {Object.keys(inboxFilters).length > 0 && ` (filters will be applied when navigating)`}
                    </CardDescription>
                  </div>
                  {Object.keys(inboxFilters).length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {Object.keys(inboxFilters).map((filterKey) => (
                          <Badge key={filterKey} variant="secondary" className="flex items-center space-x-1">
                            <span>{filterKey.replace('_', ' ')}</span>
                            <X 
                              className="h-3 w-3 cursor-pointer hover:text-destructive" 
                              onClick={() => {
                                const newFilters = { ...inboxFilters };
                                delete newFilters[filterKey];
                                setInboxFilters(newFilters);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" onClick={clearInboxFilters}>
                        <Filter className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Organiser</TableHead>
                      <TableHead>Issues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInboxData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.eventName}</p>
                            <p className="text-sm text-muted-foreground">{item.eventDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{item.organiser}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.issues.map((issue, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleInboxIssueClick(item.id, issue.type)}
                              >
                                {issue.label} ({issue.count})
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>


        </TooltipProvider>
      </main>

      {/* Edit/Add Organiser Dialog */}
      <Dialog open={isOrganiserDialogOpen} onOpenChange={setIsOrganiserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOrganiser ? "Edit Event Organiser" : "Add New Event Organiser"}</DialogTitle>
            <DialogDescription>
              {editingOrganiser ? "Update event organiser information" : "Add a new event organiser to the system"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Event Organiser Name</Label>
              <Input 
                placeholder="Enter event organiser name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input 
                type="email"
                placeholder="support@organiser.com" 
                value={formData.supportEmail}
                onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <textarea 
                className="w-full p-2 border rounded-md min-h-24"
                placeholder="Enter a description for this event organiser" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOrganiserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveOrganiser}>
                {editingOrganiser ? "Update Organiser" : "Save Organiser"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
