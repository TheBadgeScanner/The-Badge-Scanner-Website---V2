// File: components/LeadDashboard.tsx
import { useState, useRef } from "react";
import { Navigation } from "./Navigation";
import { DeveloperLabel } from "./DeveloperLabel";
import { Breadcrumbs } from "./Breadcrumbs";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { ImageViewer } from "./ImageViewer";
import { EventScansChart } from "./EventScansChart";
import {
  Users,
  TrendingUp,
  Target,
  Award,
  Download,
  Plus,
  HelpCircle,
  Filter,
  X,
  Search,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { LeadsManagementTab } from "./ui/leads-management-tab";
import { AnimatedCounter } from "./ui/animated-counter";
import { TotalLeadsBubble } from "./ui/total-leads-bubble";
import { LicenseUsageBubble } from "./ui/license-usage-bubble";
import { SalesIntelScoreBubble } from "./ui/sales-intel-score-bubble";
import { ConversionScoreBubble } from "./ui/conversion-score-bubble";
import { StackedBarChart } from "./ui/stacked-bar-chart";
import { LeadsByHourChart } from "./ui/leads-by-hour-chart";
import { LeadQualityBarChart } from "./ui/lead-quality-bar-chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Mock data for the current company
const mockCompanyData = {
  totalLeads: 52,
  avgSalesIntelScore: 8.1,
  avgConversionScore: 7.5,
  activeUsers: 4,
  totalUsers: 5,
};

// Mock hourly leads data for multiple event days
const mockDailyHourlyData = {
  "Jan 22": [
    { hour: "9 AM", leads: 3 },
    { hour: "10 AM", leads: 7 },
    { hour: "11 AM", leads: 12 },
    { hour: "12 PM", leads: 8 },
    { hour: "1 PM", leads: 5 },
    { hour: "2 PM", leads: 9 },
    { hour: "3 PM", leads: 6 },
    { hour: "4 PM", leads: 2 },
  ],
  "Jan 23": [
    { hour: "9 AM", leads: 4 },
    { hour: "10 AM", leads: 8 },
    { hour: "11 AM", leads: 6 },
    { hour: "12 PM", leads: 11 },
    { hour: "1 PM", leads: 7 },
    { hour: "2 PM", leads: 5 },
    { hour: "3 PM", leads: 3 },
    { hour: "4 PM", leads: 4 },
  ],
  "Jan 24": [
    { hour: "9 AM", leads: 2 },
    { hour: "10 AM", leads: 5 },
    { hour: "11 AM", leads: 8 },
    { hour: "12 PM", leads: 6 },
    { hour: "1 PM", leads: 3 },
    { hour: "2 PM", leads: 7 },
    { hour: "3 PM", leads: 4 },
    { hour: "4 PM", leads: 2 },
  ],
};

// Keep backwards compatibility
const mockHourlyData = mockDailyHourlyData["Jan 22"];

// Mock warmth distribution data
const mockWarmthData = [
  { name: "Info Only", value: 10, color: "#6B7280" },
  { name: "Cold", value: 15, color: "#3B82F6" },
  { name: "Warm", value: 18, color: "#F97316" },
  { name: "Hot", value: 9, color: "#EF4444" },
];

export function LeadDashboard({
  user,
  selectedEvent,
  onLogout,
  onNavigate,
  onStartTour,
  selectedOrganiser,
  selectedCompany,
  selectedUser,
}) {
  const [leadFilters, setLeadFilters] = useState({});
  const [activeTab, setActiveTab] = useState("leads");
  const [activeChartDay, setActiveChartDay] =
    useState("Jan 22");

  // Sorting state
  const [leadsSortBy, setLeadsSortBy] = useState("capturedAt");
  const [leadsSortOrder, setLeadsSortOrder] = useState("desc");

  // Lead Details Dialog States
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadDialogOpen, setIsLeadDialogOpen] =
    useState(false);
  const [playingMemo, setPlayingMemo] = useState(null);
  const [expandedMemos, setExpandedMemos] = useState({});
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  // Refs for scrolling
  const leadsTabRef = useRef(null);
  
  // Prefer the explicitly selected user (when an admin is viewing a team member), otherwise show the logged-in user.
  const displayUser = selectedUser || user;

  // Mock leads data for "Your Leads"
  const mockYourLeads = [
    {
      id: 1,
      name: "Emily Johnson",
      jobTitle: "Marketing Director",
      company: "TechStart Inc",
      industry: "Technology",
      email: "emily.johnson@techstart.com",
      phone: "+1-555-0456",
      capturedBy: "John Doe",
      salesIntelScore: 8.5,
      conversionScore: 7.8,
      priority: "High",
      leadType: "Hot",
      capturedAt: "2025-01-15T14:30:00Z",
      notes: "Very interested in our AI solutions. Wants a demo next week.",
      hasPhoto: true,
      photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      jobTitle: "CTO",
      company: "Innovate Industries",
      industry: "Manufacturing",
      email: "michael.chen@innovate.com",
      phone: "+1-555-0789",
      capturedBy: "John Doe",
      salesIntelScore: 7.2,
      conversionScore: 6.5,
      priority: "Medium",
      leadType: "Warm",
      capturedAt: "2025-01-15T11:15:00Z",
      notes: "Looking for automation solutions. Budget approved for Q2.",
      hasPhoto: false,
      photoUrl: null
    },
    {
      id: 3,
      name: "Sarah Wilson",
      jobTitle: "VP of Operations",
      company: "StartupX Inc",
      industry: "Software",
      email: "sarah.wilson@startupx.com",
      phone: "+1-555-0321",
      capturedBy: "John Doe",
      salesIntelScore: 6.8,
      conversionScore: 5.9,
      priority: "Low",
      leadType: "Cold",
      capturedAt: "2025-01-15T09:45:00Z",
      notes: "Just collecting information. No immediate buying intent.",
      hasPhoto: true,
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Rodriguez",
      jobTitle: "Product Manager",
      company: "Growth Co",
      industry: "SaaS",
      email: "david.rodriguez@growthco.com",
      phone: "+1-555-0654",
      capturedBy: "John Doe",
      salesIntelScore: 7.9,
      conversionScore: 7.2,
      priority: "High",
      leadType: "Hot",
      capturedAt: "2025-01-14T16:20:00Z",
      notes: "Very interested in our enterprise solutions.",
      hasPhoto: true,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Chen",
      jobTitle: "Operations Director",
      company: "Tech Innovations",
      industry: "Technology",
      email: "lisa.chen@techinnovations.com",
      phone: "+1-555-0987",
      capturedBy: "John Doe",
      salesIntelScore: 6.5,
      conversionScore: 6.1,
      priority: "Medium",
      leadType: "Warm",
      capturedAt: "2025-01-14T13:45:00Z",
      notes: "Interested but needs to check with stakeholders.",
      hasPhoto: false,
      photoUrl: null
    },
    {
      id: 6,
      name: "James Wilson",
      jobTitle: "CFO",
      company: "Finance Plus",
      industry: "Finance",
      email: "james.wilson@financeplus.com",
      phone: "+1-555-1234",
      capturedBy: "John Doe",
      salesIntelScore: 8.2,
      conversionScore: 7.8,
      priority: "High",
      leadType: "Hot",
      capturedAt: "2025-01-14T10:15:00Z",
      notes: "Budget approved. Ready to move forward.",
      hasPhoto: true,
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 7,
      name: "Maria Garcia",
      jobTitle: "Marketing Manager",
      company: "Global Solutions",
      industry: "Consulting",
      email: "maria.garcia@globalsolutions.com",
      phone: "+1-555-5678",
      capturedBy: "John Doe",
      salesIntelScore: 7.0,
      conversionScore: 6.3,
      priority: "Medium",
      leadType: "Warm",
      capturedAt: "2025-01-13T14:30:00Z",
      notes: "Good prospect, needs follow-up next week.",
      hasPhoto: true,
      photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 8,
      name: "Robert Kim",
      jobTitle: "IT Director",
      company: "Tech Systems",
      industry: "Technology",
      email: "robert.kim@techsystems.com",
      phone: "+1-555-9101",
      capturedBy: "John Doe",
      salesIntelScore: 7.6,
      conversionScore: 7.1,
      priority: "High",
      leadType: "Hot",
      capturedAt: "2025-01-13T11:00:00Z",
      notes: "Very engaged, scheduling demo for next week.",
      hasPhoto: false,
      photoUrl: null
    },
    {
      id: 9,
      name: "Jessica Brown",
      jobTitle: "VP Sales",
      company: "Sales Dynamics",
      industry: "Business Services",
      email: "jessica.brown@salesdynamics.com",
      phone: "+1-555-1121",
      capturedBy: "John Doe",
      salesIntelScore: 8.8,
      conversionScore: 8.4,
      priority: "High",
      leadType: "Hot",
      capturedAt: "2025-01-13T09:30:00Z",
      notes: "Top prospect, almost ready to sign.",
      hasPhoto: true,
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 10,
      name: "Thomas Anderson",
      jobTitle: "Operations Manager",
      company: "Logistics Inc",
      industry: "Logistics",
      email: "thomas.anderson@logisticsinc.com",
      phone: "+1-555-3141",
      capturedBy: "John Doe",
      salesIntelScore: 6.3,
      conversionScore: 5.7,
      priority: "Low",
      leadType: "Cold",
      capturedAt: "2025-01-12T15:45:00Z",
      notes: "Initial contact, needs more nurturing.",
      hasPhoto: true,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const leadsCount = mockYourLeads?.length || 0;


  const filterLeadsByWarmth = (warmth) => {
    setLeadFilters((prev) => ({ ...prev, leadType: warmth }));
    // Switch to leads tab and scroll to Team Leads section
    setActiveTab("leads");
    setTimeout(() => {
      leadsTabRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // After scrolling to the management section, scroll down further to ensure the leads list is visible
      setTimeout(() => {
        const leadsContent =
          document.getElementById("leads-content");
        if (leadsContent) {
          leadsContent.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }, 100);
  };

  const filterLeadsByHour = (hour) => {
    setLeadFilters((prev) => ({ ...prev, leadHour: hour }));
    setActiveTab("leads");
    setTimeout(() => {
      leadsTabRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setTimeout(() => {
        const leadsContent = document.getElementById("leads-content");
        if (leadsContent) {
          leadsContent.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }, 100);
  };

  const clearFilters = () => {
    setLeadFilters({});
  };

  const removeFilter = (filterKey) => {
    setLeadFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  // Sorting handler
  const handleLeadsSort = (
    column,
    currentSortBy,
    currentSortOrder,
  ) => {
    if (currentSortBy === column) {
      setLeadsSortOrder(
        currentSortOrder === "desc" ? "asc" : "desc",
      );
    } else {
      setLeadsSortBy(column);
      setLeadsSortOrder("desc");
    }
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    // Mock export functionality
    console.log("Exporting leads to Excel...");
  };

  // Lead Details Dialog Functions
  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsLeadDialogOpen(true);
  };

  const handleCloseLeadDialog = () => {
    setIsLeadDialogOpen(false);
    setSelectedLead(null);
    setPlayingMemo(null);
    setExpandedMemos({});
  };

  const toggleMemoPlayback = (memoId) => {
    if (playingMemo === memoId) {
      setPlayingMemo(null);
    } else {
      setPlayingMemo(memoId);
    }
  };

  const toggleMemoExpansion = (memoId) => {
    setExpandedMemos((prev) => ({
      ...prev,
      [memoId]: !prev[memoId],
    }));
  };

  const openImageViewer = (images, initialIndex = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(initialIndex);
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DeveloperLabel
        pageName="LeadDashboard"
        popups={[
          ...(isLeadDialogOpen ? ["LeadDetailsDialog"] : []),
          ...(isImageViewerOpen ? ["ImageViewer"] : []),
        ]}
      />

      <Navigation
        user={user}
        currentPage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <Breadcrumbs user={user} selectedOrganiser={selectedOrganiser} selectedEvent={selectedEvent} selectedCompany={selectedCompany} selectedUser={selectedUser} onNavigate={onNavigate} currentPage="dashboard" />

      <main className="container mx-auto px-6 py-8 space-y-8 pt-28">
        <TooltipProvider>
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl">
                  {displayUser?.name || "{Firstname Lastname}"} @ {selectedEvent?.name || "{EventName}"}
                </h1>
                <h2 className="text-muted-foreground text-xl">
                  Representing {selectedCompany?.name || displayUser?.company || "{CompanyName}"}
                </h2>
              </div>
              <div className="flex items-center space-x-3">
                {Object.keys(leadFilters).length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {Object.entries(leadFilters).map(
                        ([key, value]) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{value}</span>
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeFilter(key)}
                            />
                          </Badge>
                        ),
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                )}
                <Button
                  variant="blue"
                  onClick={handleExportToExcel}
                  style={{ backgroundColor: '#2563eb', color: 'white', borderColor: '#2563eb' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Leads
                </Button>
                <Button variant="outline" onClick={onStartTour}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Start Tour
                </Button>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TotalLeadsBubble
                totalLeads={mockCompanyData.totalLeads}
                dataStep="2"
                onClick={() => {
                  setActiveTab("leads");
                  setTimeout(() => {
                    leadsTabRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    // After scrolling to tab, scroll to the bottom to show the leads list
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 500);
                  }, 100);
                }}
              />

              <LicenseUsageBubble
                activeUsers={mockCompanyData.activeUsers}
                totalUsers={mockCompanyData.totalUsers}
                dataStep="3"
                isClickable={false}
                hasHoverEffect={false}
              />

              <SalesIntelScoreBubble
                score={mockCompanyData.avgSalesIntelScore}
                dataStep="4"
              />

              <ConversionScoreBubble
                score={mockCompanyData.avgConversionScore}
                dataStep="5"
                title="Conversion Score"
                subtitle="Average interest level"
                helpText="AI-generated score (1-10) rating prospect interest level"
              />
            </div>

            {/* Analytics Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <LeadsByHourChart
                title="Leads by Hour"
                description="When you were most active (click to filter leads)"
                data={mockDailyHourlyData}
                activeChartDay={activeChartDay}
                onChartDayChange={setActiveChartDay}
                onHourClick={filterLeadsByHour}
              />

              <LeadQualityBarChart
                data={mockWarmthData}
                onSegmentClick={filterLeadsByWarmth}
              />
            </div>
          </div>

          {/* Tabbed Management Section */}
          <Card ref={leadsTabRef}>
            <CardHeader>
              {/* <CardTitle className="font-medium">Leads Management</CardTitle> */}
              {/* <CardTitle className="font-medium">Your Leads</CardTitle> */}
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger id="leads-tab" value="leads">
                    Your Leads - <span className="font-bold">{leadsCount}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  id="leads-content"
                  value="leads"
                  className="space-y-4"
                >
                  <LeadsManagementTab
                    filters={leadFilters}
                    onClearFilters={clearFilters}
                    onRemoveFilter={removeFilter}
                    filteredLeads={mockYourLeads}
                    openLeadDialog={handleLeadClick}
                    handleLeadsSort={handleLeadsSort}
                    leadsSortBy={leadsSortBy}
                    leadsSortOrder={leadsSortOrder}
                    handleExportToExcel={handleExportToExcel}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TooltipProvider>
      </main>

      {/* Lead Details Dialog */}
      <LeadDetailsDialog
        isOpen={isLeadDialogOpen}
        onClose={handleCloseLeadDialog}
        selectedLead={selectedLead}
        user={user}
        playingMemo={playingMemo}
        toggleMemoPlayback={toggleMemoPlayback}
        expandedMemos={expandedMemos}
        toggleMemoExpansion={toggleMemoExpansion}
        openImageViewer={openImageViewer}
      />

      {/* Image Viewer */}
      <ImageViewer
        isOpen={isImageViewerOpen}
        onClose={closeImageViewer}
        images={currentImages}
        initialIndex={currentImageIndex}
      />
    </div>
  );
}
