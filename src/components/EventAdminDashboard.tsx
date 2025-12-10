// File: components/EventAdminDashboard.tsx
import { useState, useRef } from "react";
import { Navigation } from "./Navigation";
import { Breadcrumbs } from "./Breadcrumbs";
import { DeveloperLabel } from "./DeveloperLabel";
import { LeaderPerformanceCards } from "./ui/leader-performance-cards";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { ImageViewer } from "./ImageViewer";
import {
  Users,
  Building2,
  TrendingUp,
  Target,
  Award,
  Download,
  Filter,
  FilterX,
  Edit,
  Plus,
  HelpCircle,
  Upload,
  UserPlus,
  Maximize2,
  X,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { mockAllLeads } from "./constants/mockData";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { AnimatedCounter } from "./ui/animated-counter";
import { StackedBarChart } from "./ui/stacked-bar-chart";
import { TotalLeadsBubble } from "./ui/total-leads-bubble";
import { LicenseUsageBubble } from "./ui/license-usage-bubble";
import { SalesIntelScoreBubble } from "./ui/sales-intel-score-bubble";
import { ConversionScoreBubble } from "./ui/conversion-score-bubble";
import { LeadsByHourChart } from "./ui/leads-by-hour-chart";
import { LeadQualityBarChart } from "./ui/lead-quality-bar-chart";
import { LeadsManagementTab } from "./ui/leads-management-tab";
import { CompaniesManagementTab } from "./ui/companies-management-tab";
import { VisitorsManagementTab } from "./ui/visitors-management-tab";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EventManagementPanel } from "./EventManagementPanel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  LineChart,
  Line,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Tooltip as RechartsTooltip,
  ReferenceLine,
} from "recharts";

// Mock event-wide data
const mockEventMetrics = {
  totalLeads: 847,
  totalCompanies: 23,
  avgSalesIntelScore: 7.2,
  avgConversionScore: 6.8,
  totalLicensesActive: 89,
  totalLicensesAssigned: 115,
  totalLicensesAvailable: 150,
};

// Mock hourly leads data for entire event
const mockEventHourlyData = [
  { hour: "9 AM", leads: 45 },
  { hour: "10 AM", leads: 78 },
  { hour: "11 AM", leads: 112 },
  { hour: "12 PM", leads: 89 },
  { hour: "1 PM", leads: 67 },
  { hour: "2 PM", leads: 124 },
  { hour: "3 PM", leads: 156 },
  { hour: "4 PM", leads: 143 },
  { hour: "5 PM", leads: 73 },
];

// Mock warmth distribution data for entire event - reordered with Information Only first
const mockWarmthData = [
  { name: "Info Only", value: 128, color: "#6B7280" },
  { name: "Cold", value: 234, color: "#3B82F6" },
  { name: "Warm", value: 298, color: "#F97316" },
  { name: "Hot", value: 187, color: "#EF4444" },
];

// Mock companies data
const mockCompanies = [
  {
    id: 1,
    companyName: "TechCorp Solutions",
    contactFirstName: "Jane",
    contactLastName: "Smith",
    contactEmail: "jane.smith@techcorp.com",
    leadsCapured: 52,
    avgSalesIntelScore: 8.1,
    avgConversionScore: 7.5,
    licensesActive: 4,
    licensesAssigned: 5,
    licensesAvailable: 5,
    useAI: true,
    sendOnboardingEmail: true,
  },
  {
    id: 2,
    companyName: "Innovate Industries",
    contactFirstName: "Michael",
    contactLastName: "Chen",
    contactEmail: "michael.chen@innovate.com",
    leadsCapured: 47,
    avgSalesIntelScore: 7.2,
    avgConversionScore: 6.8,
    licensesActive: 3,
    licensesAssigned: 4,
    licensesAvailable: 8,
    useAI: true,
    sendOnboardingEmail: true,
  },
  {
    id: 3,
    companyName: "StartupX Inc",
    contactFirstName: "Sarah",
    contactLastName: "Wilson",
    contactEmail: "sarah.wilson@startupx.com",
    leadsCapured: 41,
    avgSalesIntelScore: 7.8,
    avgConversionScore: 7.1,
    licensesActive: 2,
    licensesAssigned: 3,
    licensesAvailable: 3,
    useAI: false,
    sendOnboardingEmail: true,
  },
  {
    id: 4,
    companyName: "Growth Co Ltd",
    contactFirstName: "David",
    contactLastName: "Rodriguez",
    contactEmail: "david.rodriguez@growthco.com",
    leadsCapured: 33,
    avgSalesIntelScore: 6.4,
    avgConversionScore: 5.9,
    licensesActive: 1,
    licensesAssigned: 2,
    licensesAvailable: 5,
    useAI: true,
    sendOnboardingEmail: false,
  },
  {
    id: 5,
    companyName: "MegaCorp Systems",
    contactFirstName: "Lisa",
    contactLastName: "Park",
    contactEmail: "lisa.park@megacorp.com",
    leadsCapured: 38,
    avgSalesIntelScore: 8.2,
    avgConversionScore: 7.8,
    licensesActive: 3,
    licensesAssigned: 3,
    licensesAvailable: 6,
    useAI: true,
    sendOnboardingEmail: true,
  },
  {
    id: 6,
    companyName: "NextGen Technologies",
    contactFirstName: "Alex",
    contactLastName: "Chen",
    contactEmail: "alex.chen@nextgen.com",
    leadsCapured: 29,
    avgSalesIntelScore: 7.0,
    avgConversionScore: 6.5,
    licensesActive: 2,
    licensesAssigned: 3,
    licensesAvailable: 4,
    useAI: true,
    sendOnboardingEmail: true,
  },
  {
    id: 7,
    companyName: "Digital Dynamics",
    contactFirstName: "Maria",
    contactLastName: "Garcia",
    contactEmail: "maria.garcia@digitaldynamics.com",
    leadsCapured: 44,
    avgSalesIntelScore: 7.6,
    avgConversionScore: 7.2,
    licensesActive: 3,
    licensesAssigned: 4,
    licensesAvailable: 6,
    useAI: true,
    sendOnboardingEmail: true,
  },
  {
    id: 8,
    companyName: "Innovation Labs",
    contactFirstName: "Robert",
    contactLastName: "Kim",
    contactEmail: "robert.kim@innovationlabs.com",
    leadsCapured: 36,
    avgSalesIntelScore: 6.8,
    avgConversionScore: 6.3,
    licensesActive: 2,
    licensesAssigned: 3,
    licensesAvailable: 5,
    useAI: false,
    sendOnboardingEmail: false,
  },
];

// Mock visitors data
const mockVisitors = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    company: "ABC Corp",
    jobTitle: "VP of Sales",
    phone: "+1-555-0123",
    imported: "15/01/2025 10:30:00",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@techstart.com",
    company: "TechStart Inc",
    jobTitle: "Marketing Director",
    phone: "+1-555-0456",
    imported: "15/01/2025 10:30:00",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Brown",
    email: "m.brown@globaltech.com",
    company: "GlobalTech Solutions",
    jobTitle: "CTO",
    phone: "+1-555-0789",
    imported: "15/01/2025 10:30:00",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@innovate.co",
    company: "Innovate Co",
    jobTitle: "Product Manager",
    phone: "+1-555-0321",
    imported: "15/01/2025 10:30:00",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Wilson",
    email: "david.w@futuretech.net",
    company: "FutureTech Networks",
    jobTitle: "Lead Developer",
    phone: "+1-555-0654",
    imported: "15/01/2025 10:30:00",
    avatar: null,
  },
  {
    id: 6,
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@smartsys.com",
    company: "SmartSys Ltd",
    jobTitle: "Operations Manager",
    phone: "+1-555-0987",
    imported: "15/01/2025 10:30:00",
    avatar: null,
  },
];

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

export function EventAdminDashboard({
  user,
  selectedEvent,
  selectedOrganiser,
  selectedCompany,
  selectedUser,
  onLogout,
  onNavigate,
}) {
  const [leadFilters, setLeadFilters] = useState({});
  const [editingCompany, setEditingCompany] = useState(null);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] =
    useState(false);
  const [
    isVisitorImportDialogOpen,
    setIsVisitorImportDialogOpen,
  ] = useState(false);
  const [importMode, setImportMode] = useState("add");
  const [selectedVisitorFile, setSelectedVisitorFile] = useState<File | null>(null);
  const [companySortBy, setCompanySortBy] =
    useState("leadsCapured");
  const [companySortOrder, setCompanySortOrder] =
    useState("desc");
  const [visitorSortBy, setVisitorSortBy] =
    useState("lastName");
  const [visitorSortOrder, setVisitorSortOrder] =
    useState("asc");
  const [activeTab, setActiveTab] = useState("companies");
  const [isNormalized, setIsNormalized] = useState(false);
  const [isBubbleChartExpanded, setIsBubbleChartExpanded] =
    useState(false);
  const [sendOnboardingEmail, setSendOnboardingEmail] =
    useState(true);
  const [showChartTips, setShowChartTips] = useState(true);
  const [showCompanyPerformance, setShowCompanyPerformance] =
    useState(false);
  const [activeChartDay, setActiveChartDay] =
    useState("Jan 22");
  const [hoveredTip, setHoveredTip] = useState(null);

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

  // Ref for bubble chart container
  const bubbleChartRef = useRef(null);

  // Ref for leads section scrolling
  const leadsTabRef = useRef(null);

  // Pagination states
  const [companiesCurrentPage, setCompaniesCurrentPage] =
    useState(1);
  const [visitorsCurrentPage, setVisitorsCurrentPage] =
    useState(1);
  const [leadsCurrentPage, setLeadsCurrentPage] = useState(1);

  // Sorting state
  const [leadsSortBy, setLeadsSortBy] = useState("capturedAt");
  const [leadsSortOrder, setLeadsSortOrder] = useState("desc");

  // Search states
  const [leadsSearchQuery, setLeadsSearchQuery] = useState("");

  const itemsPerPage = 5;

  // Get event-specific leads based on selectedEvent
  const getEventLeads = () => {
    if (!selectedEvent) return mockAllLeads;

    // Different events have different lead sets
    switch (selectedEvent.id) {
      case 1: // Tech Conference 2025 - has all leads
        return mockAllLeads;
      case 2: // AI Summit 2025 - has subset of leads
        return mockAllLeads.slice(0, 4);
      case 3: // Digital Transform Conference - has different subset
        return mockAllLeads.slice(2, 6);
      case 4: // Startup Showcase 2025 - empty event for fresh interface
        return [];
      case 5: // Cloud Computing Expo - one lead only
        return mockAllLeads.slice(0, 1);
      default:
        return mockAllLeads;
    }
  };

  const eventLeads = getEventLeads();

  const handleCompanySort = (column) => {
    if (companySortBy === column) {
      setCompanySortOrder(
        companySortOrder === "desc" ? "asc" : "desc",
      );
    } else {
      setCompanySortBy(column);
      setCompanySortOrder("desc");
    }
  };

  const getSortIcon = (
    column,
    currentSortBy,
    currentSortOrder,
  ) => {
    if (currentSortBy !== column) return "↕";
    return currentSortOrder === "desc" ? "↓" : "↑";
  };

  const handleVisitorSort = (column) => {
    if (visitorSortBy === column) {
      setVisitorSortOrder(
        visitorSortOrder === "desc" ? "asc" : "desc",
      );
    } else {
      setVisitorSortBy(column);
      setVisitorSortOrder("desc");
    }
  };

  const sortedCompanies = [...mockCompanies].sort((a, b) => {
    const aVal = a[companySortBy] || 0;
    const bVal = b[companySortBy] || 0;
    return companySortOrder === "desc"
      ? bVal - aVal
      : aVal - bVal;
  });

  const sortedVisitors = [...mockVisitors].sort((a, b) => {
    let aVal, bVal;

    if (visitorSortBy === "imported") {
      aVal = new Date(a[visitorSortBy]).getTime();
      bVal = new Date(b[visitorSortBy]).getTime();
    } else {
      aVal = (a[visitorSortBy] || "").toString().toLowerCase();
      bVal = (b[visitorSortBy] || "").toString().toLowerCase();
    }

    if (typeof aVal === "string") {
      return visitorSortOrder === "desc"
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }
    return visitorSortOrder === "desc"
      ? bVal - aVal
      : aVal - bVal;
  });

  // Filter and sort leads
  const getFilteredLeads = () => {
    let filteredLeads = [...eventLeads];

    // Apply search query
    if (leadsSearchQuery) {
      const query = leadsSearchQuery.toLowerCase();
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.jobTitle.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.capturedBy.toLowerCase().includes(query),
      );
    }

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

    return filteredLeads;
  };

  const filteredLeads = getFilteredLeads();

  // Pagination logic
  const totalCompaniesPages = Math.ceil(
    sortedCompanies.length / itemsPerPage,
  );
  const totalVisitorsPages = Math.ceil(
    sortedVisitors.length / itemsPerPage,
  );
  const totalLeadsPages = Math.ceil(
    filteredLeads.length / itemsPerPage,
  );

  const paginatedCompanies = sortedCompanies.slice(
    (companiesCurrentPage - 1) * itemsPerPage,
    companiesCurrentPage * itemsPerPage,
  );

  const paginatedVisitors = sortedVisitors.slice(
    (visitorsCurrentPage - 1) * itemsPerPage,
    visitorsCurrentPage * itemsPerPage,
  );

  const paginatedLeads = filteredLeads.slice(
    (leadsCurrentPage - 1) * itemsPerPage,
    leadsCurrentPage * itemsPerPage,
  );

  const getScoreBadgeColor = (score) => {
    if (!score)
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    if (score >= 8)
      return "bg-red-100 text-red-800 hover:bg-red-100";
    if (score >= 6)
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    if (score >= 4)
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  };

  // Filter functions for charts
  const filterLeadsByHour = (hour) => {
    const hourKey = hour.replace(" ", "_").toLowerCase();
    setLeadFilters((prev) => ({ ...prev, hour: hourKey }));
    // Switch to leads tab and scroll to leads section
    setActiveTab("leads");
    setTimeout(() => {
      // Try to find the management card or fallback to different methods
      const managementCard = leadsTabRef.current;
      if (managementCard) {
        managementCard.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // After scrolling to the management section, scroll further down
        setTimeout(() => {
          // Try multiple fallback strategies for scrolling to leads content
          const leadsContent =
            document.getElementById("leads-content") ||
            document.querySelector(
              '[data-state="active"][data-value="leads"]',
            ) ||
            document.querySelector(
              '[value="leads"][data-state="active"]',
            );

          if (leadsContent) {
            leadsContent.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            // Final fallback: scroll to bottom of page
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 600);
      } else {
        // If no ref found, scroll to bottom directly
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }, 300);
      }
    }, 300);
  };

  const filterLeadsByWarmth = (warmth) => {
    setLeadFilters((prev) => ({ ...prev, leadType: warmth }));
  };

  // Add filter functions for Leader Cards
  const filterLeadsByCompany = (companyName) => {
    setLeadFilters((prev) => ({
      ...prev,
      company: companyName,
    }));
  };

  const filterLeadsByUser = (userName) => {
    setLeadFilters((prev) => ({ ...prev, user: userName }));
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

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setSendOnboardingEmail(
      company ? company.sendOnboardingEmail : true,
    );
    setIsCompanyDialogOpen(true);
  };

  const handleLeadsClick = (e, company) => {
    e.stopPropagation();
    // Navigate to Admin Dashboard filtered to this company
    onNavigate("admin-dashboard", selectedEvent, {
      companyFilter: company.id,
    });
  };

  const handleActiveLicensesClick = (e, company) => {
    e.stopPropagation();
    // Navigate to Admin Dashboard Team tab
    onNavigate("admin-dashboard", selectedEvent, {
      tab: "team",
    });
  };

  const handleVisitorImport = () => {
    setIsVisitorImportDialogOpen(true);
    setSelectedVisitorFile(null);
  };

  const handleVisitorFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVisitorFile(file);
    }
  };

  const handleDownloadVisitorTemplate = () => {
    const template = "First Name,Last Name,Email,Phone,Company,Job Title\nJohn,Doe,john@example.com,+1234567890,Example Corp,Manager";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitor_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (selectedVisitorFile) {
      console.log(`Importing visitors from file: ${selectedVisitorFile.name} with mode: ${importMode}`);
      setIsVisitorImportDialogOpen(false);
      setSelectedVisitorFile(null);
    }
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    // Mock export functionality
    console.log("Exporting entire event's leads to Excel...");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Prepare bubble chart data
  const bubbleChartData = mockCompanies.map((company) => {
    const leadsPerActiveUser =
      isNormalized && company.licensesActive > 0
        ? company.leadsCapured / company.licensesActive
        : company.leadsCapured;

    // Convert to 0-100 scale
    const salesIntelScore = company.avgSalesIntelScore * 10;
    const conversionScore = company.avgConversionScore * 10;

    // Determine quadrant based on reference lines
    const xThreshold = isNormalized ? 15 : 40;
    const yThreshold = 70;

    let quadrant;
    if (
      leadsPerActiveUser < xThreshold &&
      salesIntelScore >= yThreshold
    ) {
      quadrant = "topLeft";
    } else if (
      leadsPerActiveUser >= xThreshold &&
      salesIntelScore >= yThreshold
    ) {
      quadrant = "topRight";
    } else if (
      leadsPerActiveUser < xThreshold &&
      salesIntelScore < yThreshold
    ) {
      quadrant = "bottomLeft";
    } else {
      quadrant = "bottomRight";
    }

    // Generate color based on conversion score (original logic)
    const getColor = (score) => {
      const normalized = Math.max(0, Math.min(100, score));
      const red = Math.round(255 * (1 - normalized / 100));
      const green = Math.round(255 * (normalized / 100));
      return `rgb(${red}, ${green}, 0)`;
    };

    return {
      x: leadsPerActiveUser,
      y: salesIntelScore,
      z: company.leadsCapured, // bubble size
      company: company.companyName,
      activeUsers: company.licensesActive,
      totalLeads: company.leadsCapured,
      salesIntelScore: company.avgSalesIntelScore,
      conversionScore: company.avgConversionScore,
      quadrant,
      color: getColor(conversionScore),
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.company}</p>
          <p className="text-sm">
            Active Users: {data.activeUsers}
          </p>
          <p className="text-sm">
            Leads Captured: {data.totalLeads}
          </p>
          <p className="text-sm">
            Sales Intel Score: {data.salesIntelScore}
          </p>
          <p className="text-sm">
            Conversion Probability: {data.conversionScore}%
          </p>
        </div>
      );
    }
    return null;
  };

  const getCompanySubmitButtonText = () => {
    const baseText = editingCompany
      ? "Update Company"
      : "Add Company";
    return sendOnboardingEmail
      ? `${baseText} & Send Email`
      : baseText;
  };

  const handleCompanySubmit = () => {
    if (!editingCompany) {
      // When adding a company, create a Admin from contact details
      console.log(
        "Creating Admin from contact details and adding company",
      );
    }
    setIsCompanyDialogOpen(false);
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

  const getLeadTypeColor = (leadType) => {
    switch (leadType) {
      case "Hot":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Warm":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Cold":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Handle leader card clicks to filter and switch to leads tab
  const handleCompanyCardClick = (companyName) => {
    setLeadFilters((prev) => ({
      ...prev,
      company: companyName,
    }));
    setActiveTab("leads");
  };

  const handleUserCardClick = (userName) => {
    setLeadFilters((prev) => ({ ...prev, user: userName }));
    setActiveTab("leads");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DeveloperLabel
        pageName="EventAdminDashboard"
        popups={[
          ...(isCompanyDialogOpen ? ["CompanyDialog"] : []),
          ...(isVisitorImportDialogOpen
            ? ["VisitorImportDialog"]
            : []),
          ...(isBubbleChartExpanded
            ? ["ExpandedBubbleChart"]
            : []),
          ...(isLeadDialogOpen ? ["LeadDetailsDialog"] : []),
          ...(isImageViewerOpen ? ["ImageViewer"] : []),
        ]}
      />

      <Navigation
        user={user}
        currentPage="event-admin-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <Breadcrumbs
        user={user}
        selectedOrganiser={selectedOrganiser}
        selectedEvent={selectedEvent}
        selectedCompany={selectedCompany}
        selectedUser={selectedUser}
        onNavigate={onNavigate}
        currentPage="event-admin-dashboard"
      />

      <main className="container mx-auto px-6 py-8 space-y-8 pt-28">
        <TooltipProvider>
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {selectedEvent?.image && (
                  <ImageWithFallback
                    src={selectedEvent.image}
                    alt={selectedEvent.name || "Event"}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                )}
                <div>
                  <h1 className="text-4xl">
                    {selectedEvent
                      ? `${selectedEvent.name}`
                      : "Tech Conference 2025"}
                  </h1>
                  <h2 className="text-muted-foreground text-xl">
                    Event Admin Dashboard
                  </h2>
                </div>
              </div>
              <Button
                variant="blue"
                onClick={handleExportToExcel}
                style={{ backgroundColor: '#2563eb', color: 'white', borderColor: '#2563eb' }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Event Leads
              </Button>
            </div>

            {/* Event Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TotalLeadsBubble
                totalLeads={eventLeads.length}
                dataStep="2"
                subtitle={`${mockEventMetrics.totalCompanies} exhibiting companies`}
                helpText="Total number of leads captured across all exhibiting companies at this event"
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
                activeUsers={
                  mockEventMetrics.totalLicensesActive
                }
                totalUsers={
                  mockEventMetrics.totalLicensesAssigned
                }
                dataStep="3"
                subtitle="Across all companies"
                helpText="Total active users vs assigned licenses for the entire event"
              />

              <SalesIntelScoreBubble
                score={mockEventMetrics.avgSalesIntelScore}
                subtitle="Event-wide average"
                helpText="AI-generated score (1-10) rating overall lead qualification quality across all companies at this event"
              />

              <ConversionScoreBubble
                score={mockEventMetrics.avgConversionScore}
                subtitle="Event-wide average"
                helpText="AI-generated average score (1-10) rating prospect interest level across all companies"
              />
            </div>

            {/* Event Analytics Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle asChild>
                      <h4 className="font-medium">
                        Event Leads by Hour
                      </h4>
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Lead capture activity across all
                          companies throughout the day (click
                          bars to filter)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={activeChartDay}
                    onValueChange={setActiveChartDay}
                    className="space-y-4"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="Jan 22">
                        Day 1 (Jan 22)
                      </TabsTrigger>
                      <TabsTrigger value="Jan 23">
                        Day 2 (Jan 23)
                      </TabsTrigger>
                      <TabsTrigger value="Jan 24">
                        Day 3 (Jan 24)
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(mockDailyHourlyData).map(
                      ([day, data]) => (
                        <TabsContent
                          key={day}
                          value={day}
                          className="space-y-0 mt-4"
                        >
                          <div
                            className="h-64"
                            style={{ outline: "none" }}
                          >
                            <ResponsiveContainer
                              width="100%"
                              height="100%"
                              style={{ outline: "none" }}
                            >
                              <LineChart
                                data={data}
                                margin={{
                                  top: 8,
                                  right: 12,
                                  left: 0,
                                  bottom: 4,
                                }}
                                onClick={(chartData) => {
                                  if (
                                    chartData &&
                                    chartData.activeLabel
                                  ) {
                                    filterLeadsByHour(
                                      chartData.activeLabel,
                                    );
                                  }
                                }}
                                style={{
                                  outline: "none",
                                  cursor: "pointer",
                                }}
                              >
                                {/* defs for gradient stroke + glow */}
                                <defs>
                                  <linearGradient
                                    id={`lineGradient-${day}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#1D4ED8"
                                      stopOpacity={0.9}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="#3B82F6"
                                      stopOpacity={0.6}
                                    />
                                  </linearGradient>
                                  <filter
                                    id={`glow-${day}`}
                                    x="-50%"
                                    y="-50%"
                                    width="200%"
                                    height="200%"
                                  >
                                    <feGaussianBlur
                                      stdDeviation="2.5"
                                      result="coloredBlur"
                                    />
                                    <feMerge>
                                      <feMergeNode in="coloredBlur" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                </defs>

                                {/* modern subtle grid */}
                                <CartesianGrid
                                  strokeDasharray="4 6"
                                  strokeOpacity={0.25}
                                  vertical={false}
                                />

                                {/* axes */}
                                <XAxis
                                  dataKey="hour"
                                  tickMargin={8}
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fill: "#6B7280",
                                    fontSize: 12,
                                  }}
                                />
                                <YAxis
                                  width={28}
                                  allowDecimals={false}
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fill: "#6B7280",
                                    fontSize: 12,
                                  }}
                                  tickMargin={6}
                                />

                                {/* tooltip */}
                                <RechartsTooltip
                                  cursor={{
                                    stroke:
                                      "rgba(29, 78, 216, 0.4)",
                                    strokeWidth: 2,
                                  }}
                                  contentStyle={{
                                    borderRadius: 8,
                                    border: "1px solid #E5E7EB",
                                    boxShadow:
                                      "0 8px 24px rgba(0,0,0,0.08)",
                                  }}
                                  labelStyle={{
                                    fontWeight: 600,
                                  }}
                                  formatter={(v) => [
                                    `${v} leads`,
                                    "Leads",
                                  ]}
                                />

                                {/* line */}
                                <Line
                                  type="monotone"
                                  dataKey="leads"
                                  stroke="#1D4ED8"
                                  strokeWidth={3}
                                  dot={false}
                                  animationBegin={200}
                                  animationDuration={800}
                                  animationEasing="ease-out"
                                  style={{ cursor: "pointer" }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </TabsContent>
                      ),
                    )}
                  </Tabs>
                </CardContent>
              </Card>

              <LeadQualityBarChart
                data={mockWarmthData}
                onSegmentClick={filterLeadsByWarmth}
              />
            </div>
          </div>

          {/* Company Performance Section - Hidden by default */}
          <Collapsible
            open={showCompanyPerformance}
            onOpenChange={setShowCompanyPerformance}
          >

            <CollapsibleContent>
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 items-stretch">
                    {/* Bubble Chart */}
                    <div>
                      <Card className="h-full">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>
                                Company Performance
                              </CardTitle>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 m-[0px] px-[10px] py-[0px]">
                                <Label
                                  htmlFor="normalize-toggle"
                                  className="text-sm"
                                >
                                  Normalize
                                </Label>
                                <Switch
                                  id="normalize-toggle"
                                  checked={isNormalized}
                                  onCheckedChange={
                                    setIsNormalized
                                  }
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setIsBubbleChartExpanded(true)
                                }
                                className="flex items-center space-x-1"
                              >
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="relative" style={{ height: 290 }}>
                            <ResponsiveContainer
                              width="100%"
                              height="100%"
                            >
                              <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="x"
                                  type="number"
                                  name="Leads per User"
                                  label={{
                                    value: isNormalized
                                      ? "Leads per Active User"
                                      : "Total Leads",
                                    position: "insideBottom",
                                    offset: -5,
                                  }}
                                />
                                <YAxis
                                  dataKey="y"
                                  type="number"
                                  name="Sales Intel Score"
                                  label={{
                                    value:
                                      "Avg Sales Intel Score",
                                    angle: -90,
                                    position: "insideLeft",
                                    textAnchor: "middle",
                                    offset: 15,
                                    dy: 75,
                                  }}
                                />
                                {/* Quadrant lines */}
                                <ReferenceLine
                                  x={isNormalized ? 15 : 40}
                                  stroke="#e5e7eb"
                                  strokeDasharray="5 5"
                                />
                                <ReferenceLine
                                  y={70}
                                  stroke="#e5e7eb"
                                  strokeDasharray="5 5"
                                />
                                <RechartsTooltip
                                  content={<CustomTooltip />}
                                />
                                <Scatter
                                  data={bubbleChartData}
                                  fill="#8884d8"
                                >
                                  {bubbleChartData.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    ),
                                  )}
                                </Scatter>
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Leader Cards */}
                    <div className="h-full">
                      <LeaderPerformanceCards
                        companies={mockCompanies}
                        onCompanyClick={handleCompanyCardClick}
                        onUserClick={handleUserCardClick}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Tabbed Section for Companies, Visitors, and Leads */}
          <EventManagementPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            leadFilters={leadFilters}
            clearFilters={clearFilters}
            removeFilter={removeFilter}
            companies={mockCompanies}
            visitors={mockVisitors}
            filteredLeads={filteredLeads}
            companySortBy={companySortBy}
            companySortOrder={companySortOrder}
            handleCompanySort={handleCompanySort}
            companiesCurrentPage={companiesCurrentPage}
            itemsPerPage={itemsPerPage}
            setCompaniesCurrentPage={setCompaniesCurrentPage}
            visitorSortBy={visitorSortBy}
            visitorSortOrder={visitorSortOrder}
            handleVisitorSort={handleVisitorSort}
            visitorsCurrentPage={visitorsCurrentPage}
            setVisitorsCurrentPage={setVisitorsCurrentPage}
            leadsSortBy={leadsSortBy}
            leadsSortOrder={leadsSortOrder}
            handleLeadsSort={handleLeadsSort}
            handleExportToExcel={handleExportToExcel}
            handleVisitorImport={handleVisitorImport}
            handleEditCompany={handleEditCompany}
            onNavigate={onNavigate}
            selectedEvent={selectedEvent}
            selectedOrganiser={selectedOrganiser}
            openLeadDialog={handleLeadClick}
          />
        </TooltipProvider>

        {/* Company Dialog */}
        <Dialog
          open={isCompanyDialogOpen}
          onOpenChange={setIsCompanyDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCompany
                  ? "Edit Company"
                  : "Add Company"}
              </DialogTitle>
              <DialogDescription>
                {editingCompany
                  ? "Update company information and settings."
                  : "Add a new exhibiting company to this event."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  defaultValue={
                    editingCompany?.companyName || ""
                  }
                />
              </div>

              {/* Contact fields - only show when adding */}
              {!editingCompany && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-first-name">
                        Admin First Name
                      </Label>
                      <Input
                        id="contact-first-name"
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-last-name">
                        Admin Last Name
                      </Label>
                      <Input
                        id="contact-last-name"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      Admin Email Address
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="admin@company.com"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="licenses-assigned">
                  Company Accounts
                </Label>
                <Input
                  id="licenses-assigned"
                  type="number"
                  placeholder="Number of licenses"
                  defaultValue={
                    editingCompany?.licensesAssigned || "5"
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-ai"
                  defaultChecked={editingCompany?.useAI ?? true}
                />
                <Label htmlFor="use-ai">
                  Enable AI Lead Processing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="send-onboarding-email"
                  checked={sendOnboardingEmail}
                  onCheckedChange={setSendOnboardingEmail}
                />
                <Label htmlFor="send-onboarding-email">
                  Send Onboarding Emails
                </Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCompanyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCompanySubmit}>
                {getCompanySubmitButtonText()}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Visitor Import Dialog */}
        <Dialog
          open={isVisitorImportDialogOpen}
          onOpenChange={setIsVisitorImportDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import Visitors</DialogTitle>
              <DialogDescription>
                Download and use the template to import your visitor data
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Template Download Section */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-blue-900">Step 1: Download Template</h4>
                    <p className="text-sm text-blue-700">
                      Download the CSV template with the required column headers
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadVisitorTemplate}
                    className="shrink-0"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-3">
                <h4 className="font-medium">Step 2: Upload Your File</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <input
                    type="file"
                    id="visitor-file-upload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleVisitorFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="visitor-file-upload"
                    className="cursor-pointer"
                  >
                    <div className="space-y-2">
                      {selectedVisitorFile ? (
                        <>
                          <p className="text-sm font-medium text-green-600">
                            ✓ {selectedVisitorFile.name}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.preventDefault();
                              setSelectedVisitorFile(null);
                            }}
                          >
                            Choose Different File
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-700">
                            Click to choose a file or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports CSV, XLSX, XLS files
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {selectedVisitorFile && (
                  <p className="text-sm text-muted-foreground">
                    Ready to import {selectedVisitorFile.name}
                  </p>
                )}
              </div>

              {/* Import Mode Section */}
              <div className="space-y-3">
                <Label>Import Mode</Label>
                <RadioGroup
                  value={importMode}
                  onValueChange={setImportMode}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="mode-add" />
                    <Label htmlFor="mode-add">
                      Add to existing visitors
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="replace"
                      id="mode-replace"
                    />
                    <Label htmlFor="mode-replace">
                      Replace all visitors
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsVisitorImportDialogOpen(false);
                    setSelectedVisitorFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImportSubmit}
                  disabled={!selectedVisitorFile}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Visitors
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Expanded Bubble Chart Dialog */}
        <Dialog
          open={isBubbleChartExpanded}
          onOpenChange={setIsBubbleChartExpanded}
        >
          <DialogContent className="bubble-chart-dialog sm:max-w-7xl max-h-[90vh]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>
                    Company Performance Analysis
                  </DialogTitle>
                  <DialogDescription>
                    Comprehensive view of company performance
                    metrics
                  </DialogDescription>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 p-[0px] mx-[30px] my-[0px]">
                    <Label
                      htmlFor="expanded-normalize-toggle"
                      className="text-sm"
                    >
                      Normalize
                    </Label>
                    <Switch
                      id="expanded-normalize-toggle"
                      checked={isNormalized}
                      onCheckedChange={setIsNormalized}
                      className="scale-110"
                    />
                  </div>
                </div>
              </div>
            </DialogHeader>
            <div
              className="h-[320px] w-full relative"
              ref={bubbleChartRef}
            >
              {/* Quadrant Overlay - Uses tip hover colors */}
              {hoveredTip && (
                <>
                  {/* Top Left Quadrant - Yellow */}
                  {hoveredTip === "topLeft" && (
                    <div
                      className="absolute pointer-events-none bg-yellow-50 border border-yellow-200 rounded-lg quadrant-highlight"
                      style={{
                        left: "6.2%",
                        top: "1.3%",
                        right: "47.3%",
                        bottom: "55%",
                        border: "2px solid #F59E0B",
                        borderRadius: "4px",
                        boxShadow:
                          "0 0 12px rgba(245, 158, 11, 0.3)",
                      }}
                    />
                  )}

                  {/* Bottom Left Quadrant - Red */}
                  {hoveredTip === "bottomLeft" && (
                    <div
                      className="absolute pointer-events-none bg-red-50 border border-red-200 quadrant-highlight"
                      style={{
                        left: "6.2%",
                        top: "46%",
                        right: "47.3%",
                        bottom: "11.6%",
                        border: "2px solid #DC2626",
                        borderRadius: "4px",
                        boxShadow:
                          "0 0 12px rgba(220, 38, 38, 0.3)",
                      }}
                    />
                  )}

                  {/* Top Right Quadrant - Green */}
                  {hoveredTip === "topRight" && (
                    <div
                      className="absolute pointer-events-none bg-green-50 border border-green-200 rounded-lg duration-200 hover:bg-green-100 hover:border-green-300 quadrant-highlight"
                      style={{
                        left: "53.1%",
                        top: "1.3%",
                        right: "0.7%",
                        bottom: "55%",
                        border: "2px solid #059669",
                        borderRadius: "4px",
                        boxShadow:
                          "0 0 12px rgba(5, 150, 105, 0.3)",
                      }}
                    />
                  )}

                  {/* Bottom Right Quadrant - Blue */}
                  {hoveredTip === "bottomRight" && (
                    <div
                      className="absolute pointer-events-none bg-blue-50 border border-blue-200 quadrant-highlight"
                      style={{
                        left: "53.1%",
                        top: "46.5%",
                        right: "0.7%",
                        bottom: "11.6%",
                        border: "2px solid #2563EB",
                        borderRadius: "4px",
                        boxShadow:
                          "0 0 12px rgba(37, 99, 235, 0.3)",
                      }}
                    />
                  )}
                </>
              )}
              <div className="h-64 relative pb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      name="Leads per User"
                      label={{
                        value: isNormalized
                          ? "Leads per Active User"
                          : "Total Leads",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      dataKey="y"
                      type="number"
                      name="Sales Intel Score"
                      label={{
                        value: "Avg Sales Intel Score",
                        angle: -90,
                        position: "insideLeft",
                        textAnchor: "middle",
                        offset: 20,
                        dy: 75,
                      }}
                    />
                    {/* Quadrant lines */}
                    <ReferenceLine
                      x={isNormalized ? 15 : 40}
                      stroke="#e5e7eb"
                      strokeDasharray="5 5"
                    />
                    <ReferenceLine
                      y={70}
                      stroke="#e5e7eb"
                      strokeDasharray="5 5"
                    />
                    <RechartsTooltip
                      content={<CustomTooltip />}
                    />
                    <Scatter
                      data={bubbleChartData}
                      fill="#8884d8"
                    >
                      {bubbleChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart Tips Section */}
            <div className="border-t pt-4">
              <div className="mb-4">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setShowChartTips(!showChartTips)
                  }
                  className="flex items-center gap-2 p-2 h-auto hover:bg-muted/50 rounded-md"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Tips on reading this chart
                  </span>
                  {showChartTips ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showChartTips && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {/* Top Left */}
                      <div
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg  transition-all duration-200 hover:bg-yellow-100 hover:border-yellow-300 hover:shadow-md"
                        onMouseEnter={() =>
                          setHoveredTip("topLeft")
                        }
                        onMouseLeave={() => setHoveredTip(null)}
                      >
                        <h4 className="font-medium text-yellow-800 mb-1">
                          Top left quadrant
                        </h4>
                        <p className="text-yellow-700 text-xs leading-tight">
                          Companies with excellent lead quality
                          but fewer total leads. Focus on
                          scaling their successful approach.
                        </p>
                      </div>

                      {/* Top Right */}
                      <div
                        className="p-3 bg-green-50 border border-green-200 rounded-lg transition-all duration-200 hover:bg-green-100 hover:border-green-300 hover:shadow-md"
                        onMouseEnter={() =>
                          setHoveredTip("topRight")
                        }
                        onMouseLeave={() => setHoveredTip(null)}
                      >
                        <h4 className="font-medium text-green-800 mb-1">
                          Top right quadrant
                        </h4>
                        <p className="text-green-700 text-xs leading-tight">
                          Star performers with both quantity and
                          quality. Use as benchmarks and case
                          studies for other exhibitors.
                        </p>
                      </div>

                      {/* Bottom Left */}
                      <div
                        className="p-3 bg-red-50 border border-red-200 rounded-lg  transition-all duration-200 hover:bg-red-100 hover:border-red-300 hover:shadow-md"
                        onMouseEnter={() =>
                          setHoveredTip("bottomLeft")
                        }
                        onMouseLeave={() => setHoveredTip(null)}
                      >
                        <h4 className="font-medium text-red-800 mb-1">
                          Bottom left quadrant
                        </h4>
                        <p className="text-red-700 text-xs leading-tight">
                          Companies needing the most support.
                          Consider additional training or booth
                          placement adjustments.
                        </p>
                      </div>

                      {/* Bottom Right */}
                      <div
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md"
                        onMouseEnter={() =>
                          setHoveredTip("bottomRight")
                        }
                        onMouseLeave={() => setHoveredTip(null)}
                      >
                        <h4 className="font-medium text-blue-800 mb-1">
                          Bottom right quadrant
                        </h4>
                        <p className="text-blue-700 text-xs leading-tight">
                          High activity but poor conversion.
                          Help them improve lead qualification
                          and capture processes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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

        {/* Image Viewer */}
        <ImageViewer
          isOpen={isImageViewerOpen}
          onClose={closeImageViewer}
          images={currentImages}
          initialIndex={currentImageIndex}
        />
      </main>
    </div>
  );
}
