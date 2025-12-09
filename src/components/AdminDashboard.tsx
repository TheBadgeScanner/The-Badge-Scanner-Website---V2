// File: components/AdminDashboard.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import { Navigation } from "./Navigation";
import { Breadcrumbs } from "./Breadcrumbs";
import { DeveloperLabel } from "./DeveloperLabel";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { ImageViewer } from "./ImageViewer";
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
  Calendar,
  UserPlus,
  Edit,
  CheckSquare,
  UserCheck,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { LeadsManagementTab } from "./ui/leads-management-tab";
import { TeamManagementTab } from "./ui/team-management-tab";
import { ProductsManagementTab } from "./ui/products-management-tab";
import { AnimatedCounter } from "./ui/animated-counter";
import { StackedBarChart } from "./ui/stacked-bar-chart";
import { TotalLeadsBubble } from "./ui/total-leads-bubble";
import { LicenseUsageBubble } from "./ui/license-usage-bubble";
import { SalesIntelScoreBubble } from "./ui/sales-intel-score-bubble";
import { ConversionScoreBubble } from "./ui/conversion-score-bubble";
import { LeadsByHourChart } from "./ui/leads-by-hour-chart";
import { LeadQualityBarChart } from "./ui/lead-quality-bar-chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  mockAllLeads,
  mockTeamUsers,
} from "./constants/mockData";

// Mock data for the current company - calculated from actual leads
const mockCompanyData = {
  totalLeads: mockAllLeads.length, // 12 leads total
  avgSalesIntelScore: 7.2, // Average of all sales intel scores
  avgConversionScore: 6.8, // Average of all conversion scores
  activeUsers: 4,
  totalUsers: 5,
};

// Mock hourly leads data for multiple event days
const mockDailyHourlyData = {
  "Jan 22": [
    { hour: "9 AM", leads: 1 },
    { hour: "10 AM", leads: 1 },
    { hour: "11 AM", leads: 2 },
    { hour: "12 PM", leads: 1 },
    { hour: "1 PM", leads: 2 },
    { hour: "2 PM", leads: 2 },
    { hour: "3 PM", leads: 2 },
    { hour: "4 PM", leads: 1 },
  ],
  "Jan 23": [
    { hour: "9 AM", leads: 2 },
    { hour: "10 AM", leads: 3 },
    { hour: "11 AM", leads: 1 },
    { hour: "12 PM", leads: 4 },
    { hour: "1 PM", leads: 3 },
    { hour: "2 PM", leads: 2 },
    { hour: "3 PM", leads: 1 },
    { hour: "4 PM", leads: 2 },
  ],
  "Jan 24": [
    { hour: "9 AM", leads: 1 },
    { hour: "10 AM", leads: 2 },
    { hour: "11 AM", leads: 3 },
    { hour: "12 PM", leads: 2 },
    { hour: "1 PM", leads: 1 },
    { hour: "2 PM", leads: 3 },
    { hour: "3 PM", leads: 2 },
    { hour: "4 PM", leads: 1 },
  ],
};

// Keep backwards compatibility
const mockHourlyData = mockDailyHourlyData["Jan 22"];

// Mock warmth distribution data - based on actual lead types
const mockWarmthData = [
  { name: "Info Only", value: 2, color: "#6B7280" }, // David Kim, James Wilson
  { name: "Cold", value: 2, color: "#3B82F6" }, // Rachel Green, Sophie Clark
  { name: "Warm", value: 4, color: "#F97316" }, // Michael Chen, Alex Thompson, Amanda Foster, Kevin Zhang
  { name: "Hot", value: 4, color: "#EF4444" }, // Sarah Johnson, Emily Rodriguez, Jessica Taylor, Robert Martinez
];

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Analytics Platform",
    description: "Advanced data analytics and visualization platform",
    leadsInterested: 23
  },
  {
    id: 2,
    name: "API Gateway",
    description: "Secure and scalable API management solution",
    leadsInterested: 18
  },
  {
    id: 3,
    name: "Security Suite",
    description: "Comprehensive cybersecurity solution",
    leadsInterested: 31
  },
  {
    id: 4,
    name: "Dashboard Tools",
    description: "Customizable dashboard creation tools",
    leadsInterested: 15
  }
];

export function AdminDashboard({
  user,
  selectedEvent,
  onLogout,
  onNavigate,
  selectedOrganiser,
  selectedCompany,
  selectedUser,
  initialFilters = {},
  onStartTour,
  tourActiveTab,
  onTourScrollToTop,
  onScrollToTop,
}) {
  const [leadFilters, setLeadFilters] =
    useState(initialFilters);
  const [activeTab, setActiveTab] = useState(
    initialFilters.tab || "leads",
  );
  const [activeChartDay, setActiveChartDay] =
    useState("Jan 22");
  const [editingUser, setEditingUser] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] =
    useState(false);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] =
    useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] =
    useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Sorting state
  const [leadsSortBy, setLeadsSortBy] = useState("capturedAt");
  const [leadsSortOrder, setLeadsSortOrder] = useState("desc");

  // Products Bulk Edit state
  const [
    isBulkProductEditDialogOpen,
    setIsBulkProductEditDialogOpen,
  ] = useState(false);
  const [bulkProductEditText, setBulkProductEditText] =
    useState("");

  // Add Product state
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] =
    useState(false);
  const [newProductName, setNewProductName] = useState("");

  // Lead Details Dialog States
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadDialogOpen, setIsLeadDialogOpen] =
    useState(false);
  const [playingMemo, setPlayingMemo] = useState(null);
  const [expandedMemos, setExpandedMemos] = useState({});
  const [isImageViewerOpen, setIsImageViewerOpen] =
    useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  // Refs for scrolling
  const teamTabRef = useRef(null);
  const leadsTabRef = useRef(null);
  const pageTopRef = useRef(null);

  // Memoized tab counts
  const leadsCount = useMemo(() => mockAllLeads?.length || 0, []);
  const teamCount = useMemo(() => mockTeamUsers?.length || 0, []);
  const productsCount = useMemo(() => mockProducts?.length || 0, []);

  // Effect to handle tour-driven tab changes
  useEffect(() => {
    if (tourActiveTab && tourActiveTab !== activeTab) {
      setActiveTab(tourActiveTab);
    }
  }, [tourActiveTab]);

  // Function to scroll to top (called by tour)
  useEffect(() => {
    // Accept either onTourScrollToTop (existing) or onScrollToTop (newer prop)
    if (onTourScrollToTop || onScrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [onTourScrollToTop, onScrollToTop]);

  // Filter functions for charts
  const filterLeadsByHour = (hour) => {
    const hourKey = hour.replace(" ", "_").toLowerCase();
    setLeadFilters((prev) => ({ ...prev, hour: hourKey }));
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

  const handleUserLicensesClick = () => {
    setActiveTab("team");
    setTimeout(() => {
      teamTabRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // After scrolling to tab, scroll to the bottom to show the team list
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 500);
    }, 100);
  };

  const handleProductInterestClick = (productName) => {
    setLeadFilters((prev) => ({
      ...prev,
      product: productName,
    }));
    setActiveTab("leads");
    setTimeout(() => {
      leadsTabRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    // Mock export functionality
    console.log("Exporting leads to Excel...");
  };

  // User management handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setSendWelcomeEmail(true);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setSendWelcomeEmail(false);
    setIsUserDialogOpen(true);
  };

  const handleBulkEdit = () => {
    setIsBulkEditDialogOpen(true);
  };

  const handleViewUserDashboard = (teamUser) => {
    // Navigate to lead dashboard for this user
    if (onNavigate) {
      onNavigate("dashboard", { event: selectedEvent, organiser: selectedOrganiser, company: selectedCompany, user: teamUser });
      // ensure page scrolls to top after navigation
      try {
        // allow a tiny delay for navigation/render
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
      } catch (e) {
        // ignore in non-browser environments
      }
    }
  };

  const getSubmitButtonText = () => {
    const baseText = editingUser ? "Update User" : "Add User";
    return sendWelcomeEmail
      ? `${baseText} & Send Email`
      : baseText;
  };

  // Products Bulk Edit handlers
  const handleOpenProductBulkEdit = () => {
    setBulkProductEditText(
      "Enterprise Platform\nIntegration Module\nSecurity Suite\nAnalytics Dashboard\nDeveloper Tools\nHigh Sustainability Matrix",
    );
    setIsBulkProductEditDialogOpen(true);
  };

  const handleSaveProductBulkEdit = () => {
    // Parse the text and update the products list
    const products = bulkProductEditText
      .split("\n")
      .filter((line) => line.trim() !== "");
    console.log("Updating products list:", products);
    setIsBulkProductEditDialogOpen(false);
  };

  // Add Product handlers
  const handleAddProduct = () => {
    setIsAddProductDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (newProductName.trim()) {
      console.log("Adding product:", newProductName);
      setIsAddProductDialogOpen(false);
      setNewProductName("");
    }
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

  // Filter the leads based on current filters
  const getFilteredLeads = () => {
    let filteredLeads = [...mockAllLeads];

    // Apply filters
    if (leadFilters.leadType) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.leadType === leadFilters.leadType,
      );
    }
    if (leadFilters.hour) {
      const hourMap = {
        "9_am": "9 AM",
        "10_am": "10 AM",
        "11_am": "11 AM",
        "12_pm": "12 PM",
        "1_pm": "1 PM",
        "2_pm": "2 PM",
        "3_pm": "3 PM",
        "4_pm": "4 PM",
        "5_pm": "5 PM",
      };
      const targetHour = hourMap[leadFilters.hour];
      if (targetHour) {
        filteredLeads = filteredLeads.filter(
          (lead) => lead.capturedHour === targetHour,
        );
      }
    }
    if (leadFilters.product) {
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.products &&
          lead.products.includes(leadFilters.product),
      );
    }

    return filteredLeads;
  };

  const filteredLeads = getFilteredLeads();

  // inside your component:
  const [activeBar, setActiveBar] = useState<number | null>(
    null,
  );

  return (
    <div ref={pageTopRef} className="min-h-screen bg-muted/30">
      <DeveloperLabel
        pageName="AdminDashboard"
        popups={[
          ...(isUserDialogOpen ? ["EditUserDialog"] : []),
          ...(isBulkEditDialogOpen ? ["BulkEditDialog"] : []),
          ...(isBulkProductEditDialogOpen
            ? ["ProductsBulkEditDialog"]
            : []),
          ...(isAddProductDialogOpen
            ? ["AddProductDialog"]
            : []),
          ...(isLeadDialogOpen ? ["LeadDetailsDialog"] : []),
          ...(isImageViewerOpen ? ["ImageViewer"] : []),
        ]}
      />

      <Navigation
        user={user}
        currentPage="admin-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <Breadcrumbs user={user} selectedOrganiser={selectedOrganiser} selectedEvent={selectedEvent} selectedCompany={selectedCompany} selectedUser={null} onNavigate={onNavigate} currentPage="admin-dashboard" />

      <main className="container mx-auto px-6 py-8 space-y-8 pt-28">
        <TooltipProvider>
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="mr-8">
                <h1 className="text-4xl">
                  {selectedCompany?.name || "{CompanyName}"} 
                  {" "}@{" "}
                  {selectedEvent?.name || "{EventName}"}
                </h1>
                <div className="text-sm text-muted-foreground mt-2">
                </div>
                <h2 className="text-muted-foreground text-xl mt-3">
                  Team Dashboard
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
                  variant="outline"
                  onClick={handleExportToExcel}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Company Leads
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
                helpText="Total number of leads captured by your team"
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
                onClick={handleUserLicensesClick}
                dataStep="user-licenses-card"
              />

              <SalesIntelScoreBubble
                score={mockCompanyData.avgSalesIntelScore}
                dataStep="4"
                helpText="AI-generated score (1-10) rating information capture quality"
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
              <CardTitle>Management Dashboard</CardTitle>
              <CardDescription>
                Manage your leads, team, and products
                {Object.keys(leadFilters).length > 0 &&
                  ` (${Object.keys(leadFilters).length} filter${Object.keys(leadFilters).length !== 1 ? "s" : ""} applied)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    id="leads-tab"
                    value="leads"
                    className="rounded-full"
                  >
                    Team Leads - <span className="font-bold">{leadsCount}</span>
                  </TabsTrigger>
                  <TabsTrigger id="team-tab" value="team" ref={teamTabRef}>
                    Team -{" "}
                    <span className="font-bold">
                      <span>3</span>
                      <span className="text-black">/</span>
                      <span>5 accounts</span>
                    </span>
                    {/* Team - <span className="font-bold">{teamCount}</span> */}
                  </TabsTrigger>
                  <TabsTrigger
                    id="products-tab"
                    value="products"
                  >
                    Products - <span className="font-bold">{productsCount}</span>
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
                    handleExportToExcel={handleExportToExcel}
                    filteredLeads={filteredLeads}
                    openLeadDialog={handleLeadClick}
                    mockTeamUsers={mockTeamUsers}
                    handleLeadsSort={handleLeadsSort}
                    leadsSortBy={leadsSortBy}
                    leadsSortOrder={leadsSortOrder}
                  />
                </TabsContent>

                <TabsContent
                  id="team-content"
                  value="team"
                  className="space-y-4"
                >
                  <TeamManagementTab
                    handleAddUser={handleAddUser}
                    handleEditUser={handleEditUser}
                    handleBulkEdit={handleBulkEdit}
                    onViewUserDashboard={handleViewUserDashboard}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                  />
                </TabsContent>

                <TabsContent
                  id="products-content"
                  value="products"
                  className="space-y-4"
                >
                  <ProductsManagementTab
                    onProductInterestClick={
                      handleProductInterestClick
                    }
                    openBulkEdit={handleOpenProductBulkEdit}
                    setIsAddProductDialogOpen={
                      setIsAddProductDialogOpen
                    }
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TooltipProvider>
      </main>

      {/* Edit User Dialog */}
      <Dialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update user information and permissions"
                : "Add a new team member to your company"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  placeholder="Enter first name"
                  defaultValue={
                    editingUser?.name?.split(" ")[0] || ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Enter last name"
                  defaultValue={
                    editingUser?.name?.split(" ")[1] || ""
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="user@company.com"
                  defaultValue={editingUser?.email || ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  defaultValue="User"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="user-activated">Account Activated</Label>
                <p className="text-sm text-muted-foreground">
                  Allow this user to access the Badge Scanner app
                </p>
              </div>
              <Switch 
                id="user-activated"
                defaultChecked={editingUser?.isActivated || false}
              />
            </div> */}

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="send-welcome">
                  Send Welcome Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send setup instructions and login details to
                  the user
                </p>
              </div>
              <Switch
                id="send-welcome"
                checked={sendWelcomeEmail}
                onCheckedChange={setSendWelcomeEmail}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button>{getSubmitButtonText()}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog
        open={isBulkEditDialogOpen}
        onOpenChange={setIsBulkEditDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Edit Users</DialogTitle>
            <DialogDescription>
              Apply changes to {selectedUsers.length} selected
              user{selectedUsers.length !== 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="bulk-activated">
                    Account Status
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activate or deactivate selected users
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Activate
                  </Button>
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Deactivate
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="bulk-role">
                    Role Assignment
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Change role for selected users
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Make User
                  </Button>
                  <Button variant="outline" size="sm">
                    Make Admin
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="bulk-welcome">
                    Welcome Email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send welcome email to activated users
                  </p>
                </div>
                <Switch id="bulk-welcome" defaultChecked />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsBulkEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button>Apply Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Products Bulk Edit Dialog */}
      <Dialog
        open={isBulkProductEditDialogOpen}
        onOpenChange={setIsBulkProductEditDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Edit Products</DialogTitle>
            <DialogDescription>
              Edit products one per line. Save to update your
              product list.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-products">Products</Label>
              <Textarea
                id="bulk-products"
                placeholder="Enter products, one per line..."
                value={bulkProductEditText}
                onChange={(e) =>
                  setBulkProductEditText(e.target.value)
                }
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  setIsBulkProductEditDialogOpen(false)
                }
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProductBulkEdit}
                className="bg-black text-white hover:bg-gray-800"
              >
                Save Products
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the name of the new product to add to your
              product list.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-product">Product Name</Label>
              <Input
                id="new-product"
                placeholder="Enter product name"
                value={newProductName}
                onChange={(e) =>
                  setNewProductName(e.target.value)
                }
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsAddProductDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProduct}
                className="bg-black text-white hover:bg-gray-800"
              >
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
