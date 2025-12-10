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
import { Switch } from "./ui/switch";

// Mock system-wide data
const mockSystemMetrics = {
  totalEvents: 15,
  totalOrganisers: 8,
  totalExhibitors: 156,
  totalLeads: 12847,
  avgSalesIntelScore: 7.4,
  avgConversionScore: 6.9,
  systemHealth: "Excellent"
};

// Mock potential issues with counts
const mockPotentialIssues = [
  { id: 1, type: "unmatched_scans", count: 23, label: "Unmatched Scans", severity: "medium" },
  { id: 2, type: "inactive_Exhibitors", count: 5, label: "Inactive Exhibitors", severity: "high" },
  { id: 3, type: "failed_logins", count: 12, label: "Repeat Failed Logins", severity: "medium" },
  { id: 4, type: "license_usage", count: 8, label: "Low License Usage", severity: "low" },
  { id: 5, type: "missing_data", count: 17, label: "Missing Contact Data", severity: "medium" },
  { id: 6, type: "duplicate_entries", count: 9, label: "Duplicate Entries", severity: "low" }
];

// Mock inbox data for events with issues
const mockInboxData = [
  {
    id: 1,
    eventName: "Tech Conference 2025",
    eventDate: "Jan 22-24, 2025",
    organiser: "Conference Badges Ltd.",
    issues: [
      { type: "unmatched_scans", count: 15, label: "Unmatched Scans" },
      { type: "inactive_Exhibitors", count: 2, label: "Inactive Exhibitors" }
    ]
  },
  {
    id: 2,
    eventName: "Healthcare Innovation Summit",
    eventDate: "Feb 15-17, 2025",
    organiser: "MegaEvents Co",
    issues: [
      { type: "failed_logins", count: 8, label: "Repeat Failed Logins" },
      { type: "license_usage", count: 3, label: "Low License Usage" }
    ]
  },
  {
    id: 3,
    eventName: "FinTech World Expo",
    eventDate: "Mar 10-12, 2025",
    organiser: "EventPro Management",
    issues: [
      { type: "unmatched_scans", count: 8, label: "Unmatched Scans" },
      { type: "failed_logins", count: 4, label: "Repeat Failed Logins" }
    ]
  },
  {
    id: 4,
    eventName: "Innovation Summit",
    eventDate: "Jan 24-26, 2025",
    organiser: "City Events Ltd",
    issues: [
      { type: "missing_data", count: 11, label: "Missing Contact Data" },
      { type: "duplicate_entries", count: 6, label: "Duplicate Entries" }
    ]
  },
  {
    id: 5,
    eventName: "Digital Expo",
    eventDate: "Jan 26-28, 2025",
    organiser: "TradeShow Organization",
    issues: [
      { type: "missing_data", count: 6, label: "Missing Contact Data" },
      { type: "duplicate_entries", count: 3, label: "Duplicate Entries" }
    ]
  }
];

// Mock recently completed events data
const mockRecentlyCompletedEvents = [
  {
    id: 1,
    name: "AI & Machine Learning Summit 2024",
    date: "December 8-10, 2024",
    exhibitorCount: 52,
    visitorCount: 1450,
    leadCount: 533,
    organiser: "EventPro Management"
  },
  {
    id: 2,
    name: "Sustainable Business Conference",
    date: "December 5-7, 2024",
    exhibitorCount: 38,
    visitorCount: 950,
    leadCount: 1238,
    organiser: "Event Management Co"
  },
  {
    id: 3,
    name: "Cybersecurity Summit 2024",
    date: "November 29 - Dec 1, 2024",
    exhibitorCount: 11,
    visitorCount: 680,
    leadCount: 842,
    organiser: "MegaEvents Co"
  },
  {
    id: 7,
    name: "Cloud Computing Expo 2024",
    date: "November 20-22, 2024",
    exhibitorCount: 44,
    visitorCount: 1120,
    leadCount: 678,
    organiser: "EventPro Management"
  },
  {
    id: 8,
    name: "Digital Marketing Summit",
    date: "November 15-17, 2024",
    exhibitorCount: 29,
    visitorCount: 780,
    leadCount: 456,
    organiser: "Event Management Co"
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
    name: "Conference Badges Ltd.",
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
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January 2025
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);
  const [isEventSelectDialogOpen, setIsEventSelectDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    supportEmail: "",
    description: "",
    firstName: "",
    lastName: "",
    sendInvite: true,
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
      description: organiser.description,
      firstName: organiser.firstName || "",
      lastName: organiser.lastName || "",
      sendInvite: organiser.sendInvite ?? true,
    });
    setIsOrganiserDialogOpen(true);
  };

  const handleAddOrganiser = () => {
    setEditingOrganiser(null);
    setFormData({
      name: "",
      supportEmail: "",
      description: "",
      firstName: "",
      lastName: "",
      sendInvite: true,
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
          ? { 
              ...org, 
              name: formData.name, 
              supportEmail: formData.supportEmail, 
              description: formData.description,
              firstName: formData.firstName,
              lastName: formData.lastName,
              sendInvite: formData.sendInvite,
            }
          : org
      ));
    } else {
      // Add new organiser
      const newOrganiser = {
        id: Math.max(...organisers.map(o => o.id), 0) + 1,
        name: formData.name,
        supportEmail: formData.supportEmail,
        description: formData.description,
        firstName: formData.firstName,
        lastName: formData.lastName,
        sendInvite: formData.sendInvite,
        eventsManaged: 0,
        status: "active"
      };
      setOrganisers([...organisers, newOrganiser]);
    }
    
    setIsOrganiserDialogOpen(false);
    setFormData({ name: "", supportEmail: "", description: "", firstName: "", lastName: "", sendInvite: true });
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
    const inboxItem = mockInboxData.find((item) => item.id === eventId);
    const calendarEvent = inboxItem ? calendarEventByName[inboxItem.eventName] : null;

    const event = calendarEvent || {
      id: -1,
      name: inboxItem?.eventName || "",
      date: inboxItem?.eventDate || "",
      location: "",
      exhibitorCount: undefined,
      visitorCount: undefined,
      leadCount: undefined
    };

    // Determine navigation parameters based on issue type
    let navigationParams: any = { event };
    
    if (issueType === "unmatched_scans") {
      // Navigate to Event Admin Dashboard with Leads tab open and filter for unmatched scans (has badgeCode)
      navigationParams.tab = "leads";
      navigationParams.filter = { type: "unmatchedScans" };
    } else if (issueType === "inactive_Exhibitors") {
      // Navigate to Event Admin Dashboard with Companies tab open and filter for inactive
      navigationParams.tab = "companies";
      navigationParams.filter = { type: "inactiveExhibitors" };
      navigationParams.scrollTo = "companies";
    } else if (issueType === "missing_data") {
      // Navigate to Event Admin Dashboard with Leads tab open and filter for leads without email
      navigationParams.tab = "leads";
      navigationParams.filter = { type: "noEmail" };
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    onNavigate("event-admin-dashboard", navigationParams);
  };

  const clearInboxFilters = () => {
    setInboxFilters({});
  };

  const handleEventClick = (event: any, organiser: any = null) => {
    // Navigate to EventAdminDashboard for the selected event with organiser info
    // If organiser not provided, try to map event to organiser
    let eventOrganiser = organiser;
    if (!eventOrganiser) {
      // Map events to their organisers
      const eventOrganiserMap: any = {
        1: organisers[1], // Tech Conference -> EventPro Management
        2: organisers[0], // Innovation Summit -> Event Management Co
        3: organisers[2]  // Digital Expo -> MegaEvents Co
      };
      eventOrganiser = eventOrganiserMap[event.id];
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    onNavigate("event-admin-dashboard", { event, organiser: eventOrganiser });
  };

  const handleCalendarDateClick = (events) => {
    if (events.length === 1) {
      handleEventClick(events[0]);
    } else if (events.length > 1) {
      setSelectedDateEvents(events);
      setIsEventSelectDialogOpen(true);
    }
  };

  const getMonthName = (monthIndex) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthIndex];
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = prev + direction;
      // Allow navigation between January (0) and December (11)
      if (newMonth < 0) return 11;
      if (newMonth > 11) return 0;
      return newMonth;
    });
  };

  // Mock events data with dates for calendar
  const calendarEvents = [
    {
      id: 1,
      name: "Tech Conference 2025",
      date: "January 22-24, 2025",
      location: "Las Vegas Convention Center",
      exhibitorCount: 45,
      visitorCount: 1200,
      startDate: new Date(2025, 0, 22), // Jan 22
      endDate: new Date(2025, 0, 24),
      color: "blue"
    },
    {
      id: 2,
      name: "Innovation Summit",
      date: "January 24-26, 2025",
      location: "Chicago Convention Center",
      exhibitorCount: 32,
      visitorCount: 850,
      startDate: new Date(2025, 0, 24), // Jan 24
      endDate: new Date(2025, 0, 26),
      color: "green"
    },
    {
      id: 3,
      name: "Digital Expo",
      date: "January 26-28, 2025",
      location: "San Francisco Expo Center",
      exhibitorCount: 28,
      visitorCount: 620,
      startDate: new Date(2025, 0, 26), // Jan 26
      endDate: new Date(2025, 0, 28),
      color: "purple"
    }
  ];

  // Build quick lookup from event name to calendar event (if present)
  const calendarEventByName = calendarEvents.reduce((acc, evt) => {
    acc[evt.name] = evt;
    return acc;
  }, {} as Record<string, typeof calendarEvents[number]>);

  // Derive issue entries (all issue types) with event info
  const issueEntries = ["unmatched_scans", "inactive_Exhibitors", "failed_logins", "license_usage", "missing_data", "duplicate_entries"].map((type) => {
    const firstMatch = mockInboxData.find((item) => item.issues.some((iss) => iss.type === type));
    const issueMeta = mockPotentialIssues.find((p) => p.type === type);
    const count = issueMeta?.count ?? 0;
    const eventName = firstMatch?.eventName || "Unknown event";
    const eventDate = firstMatch?.eventDate || "";
    const calendarEvent = calendarEventByName[eventName];
    const event = calendarEvent || {
      id: -1,
      name: eventName,
      date: eventDate,
      location: firstMatch?.organiser || "",
      exhibitorCount: undefined,
      visitorCount: undefined,
    };
    return {
      type,
      label: issueMeta?.label || type.replace("_", " "),
      count,
      event,
      organiser: firstMatch?.organiser || null,
      eventDate,
    };
  });

  // Get events for a specific date
  const getEventsForDate = (year, month, day) => {
    const checkDate = new Date(year, month, day);
    // Set to start of day for proper comparison
    checkDate.setHours(0, 0, 0, 0);
    
    return calendarEvents.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      return checkDate >= start && checkDate <= end;
    });
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = 2025;
    const month = currentMonth;
    let firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 6, and shift Monday (1) to 0
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(year, month, day);
      days.push({ day, events });
    }
    
    return days;
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
                        <AnimatedCounter value={mockSystemMetrics.totalExhibitors} duration={1500} />
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

            {/* Event Organiser Management and Calendar Side by Side */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Column - Event Organiser Management Section (2/3 width) */}
              <Card className="md:col-span-2">
                <CardContent>
                  <div>
                    <div className="flex items-center justify-between mt-6 mb-4">
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

              {/* Right Column - Calendar (1/3 width) */}
              <Card className="md:col-span-1">
                <CardHeader className="space-y-1 pb-1">
                  <div className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="font-bold">Event Calendar</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)} className="h-6 w-6 p-0 flex-shrink-0">
                      <span className="text-lg">‹</span>
                    </Button>
                    <div className="text-sm font-medium w-[140px] text-center">{getMonthName(currentMonth)} 2025</div>
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)} className="h-6 w-6 p-0 flex-shrink-0">
                      <span className="text-lg">›</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  {/* Calendar Header - Days of Week */}
                  <div className="grid grid-cols-7 gap-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    <div className="text-center text-[10px] font-semibold text-muted-foreground py-1">M</div>
                    <div className="text-center text-[10px] font-semibold text-muted-foreground py-1">T</div>
                    <div className="text-center text-[10px] font-semibold text-muted-foreground py-1">W</div>
                    <div className="text-center text-[10px] font-semibold text-muted-foreground py-1">T</div>
                    <div className="text-center text-[10px] font-semibold text-muted-foreground py-1">F</div>
                    <div className="text-center text-[10px] font-semibold text-muted-foreground py-1">S</div>
                    <div className="text-center text-[10px] font-semibold text-muted-foreground py-1">S</div>
                  </div>

                  {/* Calendar Grid - Fixed aspect ratio grid */}
                  <div className="grid grid-cols-7 gap-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {generateCalendarDays().map((dayData, index) => {
                      if (!dayData) {
                        return <div key={`empty-${index}`} className="aspect-square"></div>;
                      }

                      const { day, events } = dayData;
                      const today = new Date();
                      const isToday = day === today.getDate() && currentMonth === today.getMonth();
                      
                      if (events.length === 0) {
                        return (
                          <div 
                            key={day} 
                            className={`aspect-square flex items-center justify-center text-[10px] border rounded transition-colors ${
                              isToday ? 'bg-primary text-primary-foreground font-bold border-primary' : 'hover:bg-muted/50'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      }

                      // Define color map once for reuse
                      const colorMap = {
                        blue: { border: "border-blue-500", bg: "bg-blue-100", hover: "hover:bg-blue-200", text: "text-blue-600" },
                        green: { border: "border-green-500", bg: "bg-green-100", hover: "hover:bg-green-200", text: "text-green-600" },
                        purple: { border: "border-purple-500", bg: "bg-purple-100", hover: "hover:bg-purple-200", text: "text-purple-600" }
                      };

                      if (events.length === 1) {
                        const event = events[0];
                        const colors = colorMap[event.color as keyof typeof colorMap] || colorMap.blue;

                        return (
                          <Tooltip key={day}>
                            <TooltipTrigger asChild>
                              <div 
                                className={`aspect-square flex items-center justify-center text-[10px] border ${colors.border} ${colors.bg} rounded font-semibold cursor-pointer ${colors.hover} transition-colors ${
                                  isToday ? 'ring-1 ring-primary ring-offset-1' : ''
                                }`}
                                onClick={() => handleEventClick(event)}
                              >
                                {day}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="p-3 text-sm leading-snug max-w-xs cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleEventClick(event)}>
                              <div className="space-y-1.5">
                                <p className="font-semibold text-base">{event.name}</p>
                                <p className="text-sm">{event.exhibitorCount} exhibitors • {event.visitorCount.toLocaleString()} visitors</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      // Multiple events (2 or more) - show split color view with clickable list tooltip
                      return (
                        <Tooltip key={day}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`aspect-square text-[10px] relative rounded overflow-hidden border cursor-pointer ${
                                isToday ? 'ring-1 ring-primary ring-offset-1 border-primary' : 'border-gray-300'
                              }`}
                            >
                              <div className="absolute inset-0 flex">
                                {events.map((event, idx) => {
                                  const colors = colorMap[event.color as keyof typeof colorMap] || colorMap.blue;
                                  const isFirst = idx === 0;
                                  
                                  return (
                                    <div 
                                      key={event.id}
                                      className={`flex-1 ${colors.bg} flex items-center justify-center relative group ${
                                        isFirst ? '' : 'border-l'
                                      } ${colors.border} hover:opacity-80 transition-opacity`}
                                    />
                                  );
                                })}
                              </div>
                              <span className="absolute inset-0 flex items-center justify-center z-10 font-semibold pointer-events-none">{day}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="p-3 text-sm leading-snug max-w-xs w-auto">
                            <div className="space-y-2">
                              {events.map((event) => {
                                const colors = colorMap[event.color as keyof typeof colorMap] || colorMap.blue;
                                return (
                                  <div 
                                    key={event.id}
                                    className={`p-2 rounded cursor-pointer hover:bg-muted/70 transition-colors ${colors.bg} ${colors.text}`}
                                    onClick={() => handleEventClick(event)}
                                  >
                                    <p className="font-semibold text-sm">{event.name}</p>
                                    <p className="text-xs mt-1">{event.exhibitorCount} exhibitors • {event.visitorCount.toLocaleString()} visitors</p>
                                  </div>
                                );
                              })}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events & Potential Issues & Recently Completed Events */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Column - Upcoming Events */}
              <Card className="flex flex-col gap-3 h-[320px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="font-bold">Upcoming Events</CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Calendar className="h-5 w-5 text-blue-600 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="text-base p-3">in the next 7 days</TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto px-6 pb-6 space-y-4" style={{ scrollbarWidth: 'thin' }}>
                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 1,
                        name: "Tech Conference 2025",
                        date: "January 22-24, 2025",
                        location: "Las Vegas Convention Center",
                        exhibitorCount: 45,
                        visitorCount: 1200
                      },
                      organisers[1]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Wed</span>
                      <span className="font-bold">22</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Tech Conference 2025</h4>
                      <p className="text-sm text-muted-foreground truncate">EventPro Management • 45 Exhibitors</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 2,
                        name: "Innovation Summit",
                        date: "January 24-26, 2025",
                        location: "Chicago Convention Center",
                        exhibitorCount: 32,
                        visitorCount: 850
                      },
                      organisers[0]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Fri</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Innovation Summit</h4>
                      <p className="text-sm text-muted-foreground truncate">City Events Ltd • 32 Exhibitors</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 3,
                        name: "Digital Expo",
                        date: "January 26-28, 2025",
                        location: "San Francisco Expo Center",
                        exhibitorCount: 28,
                        visitorCount: 620
                      },
                      organisers[2]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Sun</span>
                      <span className="font-bold">26</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Digital Expo</h4>
                      <p className="text-sm text-muted-foreground truncate">TradeShow Organization • 28 Exhibitors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Middle Column - Potential Issues */}
              <Card className="flex flex-col gap-3 h-[320px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="font-bold">Potential Issues</CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="h-5 w-5 text-red-600 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="text-base p-3">in the last 7 days</TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto px-6 pb-6 space-y-3" style={{ scrollbarWidth: 'thin' }}>
                  {issueEntries.map((issue) => (
                    <div
                      key={issue.type}
                      className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      onClick={() => handleEventClick(issue.event, issue.organiser)}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-700 rounded flex-shrink-0">
                        <span className="text-lg font-bold">{issue.count}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{issue.label}</h4>
                        <p className="text-sm text-muted-foreground truncate">{issue.event.name}</p>
                        {issue.eventDate && <p className="text-xs text-muted-foreground truncate">{issue.eventDate}</p>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Right Column - Recently Completed Events */}
              <Card className="flex flex-col gap-3 h-[320px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="font-bold">Recently Completed Events</CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircle className="h-5 w-5 text-green-600 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="text-base p-3">in the last 7 days</TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto px-6 pb-6 space-y-4" style={{ scrollbarWidth: 'thin' }}>
                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 4,
                        name: "AI & Machine Learning Summit 2024",
                        date: "December 8-10, 2024",
                        location: "San Jose Convention Center",
                        exhibitorCount: 52,
                        visitorCount: 1450,
                        leadCount: 533
                      },
                      organisers[1]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Dec</span>
                      <span className="font-bold">8-10</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">AI & Machine Learning Summit 2024</h4>
                      <p className="text-sm text-muted-foreground truncate">EventPro Management • 52 Exhibitors • 152 Leads</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 5,
                        name: "Sustainable Business Conference",
                        date: "December 5-7, 2024",
                        location: "Austin Convention Center",
                        exhibitorCount: 38,
                        visitorCount: 950
                      },
                      organisers[0]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Dec</span>
                      <span className="font-bold">5-7</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Sustainable Business Conference</h4>
                      <p className="text-sm text-muted-foreground truncate">Event Management Co • 38 Exhibitors • 78 Leads</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 6,
                        name: "Cybersecurity Summit 2024",
                        date: "November 29 - Dec 1, 2024",
                        location: "Denver Convention Center",
                        exhibitorCount: 11,
                        visitorCount: 680,
                        leadCount: 842
                      },
                      organisers[2]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Nov</span>
                      <span className="font-bold">29-1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Cybersecurity Summit 2024</h4>
                      <p className="text-sm text-muted-foreground truncate">MegaEvents Co • 11 Exhibitors • 842 Leads</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 7,
                        name: "Cloud Computing Expo 2024",
                        date: "November 20-22, 2024",
                        location: "Seattle Convention Center",
                        exhibitorCount: 44,
                        visitorCount: 1120,
                        leadCount: 678
                      },
                      organisers[1]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Nov</span>
                      <span className="font-bold">20-22</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Cloud Computing Expo 2024</h4>
                      <p className="text-sm text-muted-foreground truncate">EventPro Management • 44 Exhibitors • 678 Leads</p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => handleEventClick(
                      {
                        id: 8,
                        name: "Digital Marketing Summit",
                        date: "November 15-17, 2024",
                        location: "Boston Convention Center",
                        exhibitorCount: 29,
                        visitorCount: 780,
                        leadCount: 456
                      },
                      organisers[0]
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                      <span className="text-xs">Nov</span>
                      <span className="font-bold">15-17</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">Digital Marketing Summit</h4>
                      <p className="text-sm text-muted-foreground truncate">Event Management Co • 29 Exhibitors • 456 Leads</p>
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
              {editingOrganiser ? "Update event organiser information" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
              <Label>Event Organiser Name</Label>
              <Input 
                placeholder="Enter event organiser name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  placeholder="Enter first name" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  placeholder="Enter last name" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
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

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <Label htmlFor="send-invite-toggle">Send Invitation Email</Label>
                <p className="text-sm text-muted-foreground">Send an invite to the organiser contact.</p>
              </div>
              <Switch
                id="send-invite-toggle"
                checked={formData.sendInvite}
                onCheckedChange={(checked) => setFormData({...formData, sendInvite: checked})}
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

      {/* Event Selection Dialog for dates with multiple events */}
      <Dialog open={isEventSelectDialogOpen} onOpenChange={setIsEventSelectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Event</DialogTitle>
            <DialogDescription>
              Multiple events on this date. Choose one to view:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {selectedDateEvents?.map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  handleEventClick(event);
                  setIsEventSelectDialogOpen(false);
                }}
              >
                <h4 className="font-semibold mb-1">{event.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{event.exhibitorCount} exhibitors</span>
                  <span>•</span>
                  <span>{event.visitorCount.toLocaleString()}.{event.leadCount.toLocaleString()} visitors</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
