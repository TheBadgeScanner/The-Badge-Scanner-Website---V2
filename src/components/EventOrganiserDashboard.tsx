// File: components/EventOrganiserDashboard.tsx
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
  Calendar,
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
  Delete,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  AlertTriangle,
  CheckCircle,
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

// Mock organiser events (5 total)
const mockOrganiserEvents = [
  {
    id: 1,
    name: "Tech Conference 2025",
    dateLabel: "22nd-24th Jan 2025",
    dates: "Jan 22-24, 2025",
    location: "London, UK",
    leadsCaptured: 480,
    visitorCount: 1250,
    avgSalesIntelScore: 7.8,
    avgConversionScore: 7.1,
    activeUsers: 89,
    totalUsers: 120,
  },
  {
    id: 2,
    name: "AI Summit 2025",
    dateLabel: "12th-13th Feb 2025",
    dates: "Feb 12-13, 2025",
    location: "Berlin, DE",
    leadsCaptured: 320,
    visitorCount: 890,
    avgSalesIntelScore: 7.4,
    avgConversionScore: 6.9,
    activeUsers: 64,
    totalUsers: 90,
  },
  {
    id: 3,
    name: "Digital Transform Conference",
    dateLabel: "5th-6th Mar 2025",
    dates: "Mar 5-6, 2025",
    location: "New York, USA",
    leadsCaptured: 260,
    visitorCount: 720,
    avgSalesIntelScore: 7.1,
    avgConversionScore: 6.6,
    activeUsers: 58,
    totalUsers: 80,
  },
  {
    id: 4,
    name: "Startup Showcase 2025",
    dateLabel: "18th Apr 2025",
    dates: "Apr 18, 2025",
    location: "Dublin, IE",
    leadsCaptured: 140,
    visitorCount: 450,
    avgSalesIntelScore: 6.6,
    avgConversionScore: 6.1,
    activeUsers: 32,
    totalUsers: 50,
  },
  {
    id: 5,
    name: "Cloud Computing Expo",
    dateLabel: "9th-10th May 2025",
    dates: "May 9-10, 2025",
    location: "San Francisco, USA",
    leadsCaptured: 195,
    visitorCount: 580,
    avgSalesIntelScore: 7.0,
    avgConversionScore: 6.4,
    activeUsers: 41,
    totalUsers: 65,
  },
];

// Mock monthly leads data for 2025
const mockYearlyLeadsData = [
  { month: "Jan", leads: 480 },
  { month: "Feb", leads: 320 },
  { month: "Mar", leads: 260 },
  { month: "Apr", leads: 140 },
  { month: "May", leads: 195 },
  { month: "Jun", leads: 0 },
  { month: "Jul", leads: 0 },
  { month: "Aug", leads: 0 },
  { month: "Sep", leads: 0 },
  { month: "Oct", leads: 0 },
  { month: "Nov", leads: 0 },
  { month: "Dec", leads: 0 },
];

// Mock hourly leads data reused per event (kept for backward compatibility)
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

// Reuse the same hourly series for each organiser event
const mockEventLeadSeries = mockOrganiserEvents.reduce((acc, event) => {
  acc[event.id] = mockEventHourlyData;
  return acc;
}, {} as Record<number, typeof mockEventHourlyData>);

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

// Helper function to get random event ID (1-5)
const getRandomEventId = () => Math.floor(Math.random() * 5) + 1;

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
    imported: "2025-01-15T10:30:00Z",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    eventId: getRandomEventId(),
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@techstart.com",
    company: "TechStart Inc",
    jobTitle: "Marketing Director",
    phone: "+1-555-0456",
    imported: "2025-01-15T10:30:00Z",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    eventId: getRandomEventId(),
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Brown",
    email: "m.brown@globaltech.com",
    company: "GlobalTech Solutions",
    jobTitle: "CTO",
    phone: "+1-555-0789",
    imported: "2025-01-15T10:30:00Z",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    eventId: getRandomEventId(),
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@innovate.co",
    company: "Innovate Co",
    jobTitle: "Product Manager",
    phone: "+1-555-0321",
    imported: "2025-01-15T10:30:00Z",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    eventId: getRandomEventId(),
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Wilson",
    email: "david.w@futuretech.net",
    company: "FutureTech Networks",
    jobTitle: "Lead Developer",
    phone: "+1-555-0654",
    imported: "2025-01-15T10:30:00Z",
    avatar: null,
    eventId: getRandomEventId(),
  },
  {
    id: 6,
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@smartsys.com",
    company: "SmartSys Ltd",
    jobTitle: "Operations Manager",
    phone: "+1-555-0987",
    imported: "2025-01-15T10:30:00Z",
    avatar: null,
    eventId: getRandomEventId(),
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

export function EventOrganiserDashboard({
  user,
  selectedEvent,
  selectedEventOrganiser,
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
  const [companySortBy, setCompanySortBy] =
    useState("leadsCapured");
  const [companySortOrder, setCompanySortOrder] =
    useState("desc");
  const [visitorSortBy, setVisitorSortBy] =
    useState("lastName");
  const [visitorSortOrder, setVisitorSortOrder] =
    useState("asc");
  const [eventsSortBy, setEventsSortBy] = useState("leadsCaptured");
  const [eventsSortOrder, setEventsSortOrder] = useState("desc");
  const [activeTab, setActiveTab] = useState("events");
  const [organiserUsers, setOrganiserUsers] = useState([
    { id: 1, firstName: "Steven", lastName: "Smith", email: "steven@conferencebadges.com" },
    { id: 2, firstName: "Cary", lastName: "Jones", email: "cary@conferencebadges.com" },
  ]);
  const [isAddOrganiserDialogOpen, setIsAddOrganiserDialogOpen] = useState(false);
  const [newOrganiser, setNewOrganiser] = useState({ firstName: "", lastName: "", email: "", sendInvite: true });
  const [isNormalized, setIsNormalized] = useState(false);
  const [isBubbleChartExpanded, setIsBubbleChartExpanded] =
    useState(false);
  const [sendOnboardingEmail, setSendOnboardingEmail] =
    useState(true);
  const [showChartTips, setShowChartTips] = useState(true);
  const [showCompanyPerformance, setShowCompanyPerformance] =
    useState(false);
  const [activeEventId, setActiveEventId] =
    useState(mockOrganiserEvents[0]?.id?.toString() || "");
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

  // Add Event Dialog States
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState<{
    name: string;
    description: string;
    openDate: string;
    closeDate: string;
    city: string;
    country: string;
    ccEmail: string;
    organiserEmail: string;
    companyLicenses: number;
    allowDownload: boolean;
    logo: File | string | null;
  }>({
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

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

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

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

  // Get visitor count for a specific event
  const getVisitorCountForEvent = (eventId: number) => {
    const event = mockOrganiserEvents.find((e) => e.id === eventId);
    return event?.visitorCount || 0;
  };

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

  const handleEventSort = (column) => {
    if (eventsSortBy === column) {
      setEventsSortOrder(
        eventsSortOrder === "desc" ? "asc" : "desc",
      );
    } else {
      setEventsSortBy(column);
      setEventsSortOrder("desc");
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

  const sortedEvents = [...mockOrganiserEvents].sort((a, b) => {
    const aVal = a[eventsSortBy] || 0;
    const bVal = b[eventsSortBy] || 0;
    if (typeof aVal === "string") {
      return eventsSortOrder === "desc"
        ? (bVal as string).localeCompare(aVal as string)
        : (aVal as string).localeCompare(bVal as string);
    }
    return eventsSortOrder === "desc"
      ? (bVal as number) - (aVal as number)
      : (aVal as number) - (bVal as number);
  });

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
    // Switch to events tab and scroll to table
    setActiveTab("events");
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
  };

  const handleImportSubmit = () => {
    console.log(`Importing visitors with mode: ${importMode}`);
    setIsVisitorImportDialogOpen(false);
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
    setActiveTab("events");
  };

  const handleUserCardClick = (userName) => {
    setLeadFilters((prev) => ({ ...prev, user: userName }));
    setActiveTab("events");
  };

  // Add Event handlers
  const handleAddEventClick = () => {
    // clean up any existing object URL preview
    if (logoPreview) {
      try { URL.revokeObjectURL(logoPreview); } catch (e) {}
      setLogoPreview(null);
    }

    setEventFormData({
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
    if (!eventFormData.name.trim() || !eventFormData.description.trim() || !eventFormData.openDate || !eventFormData.closeDate || !eventFormData.city.trim() || !eventFormData.country.trim() || !eventFormData.organiserEmail.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // validate dates: openDate must be >= today, closeDate >= openDate
    const open = new Date(eventFormData.openDate);
    const close = new Date(eventFormData.closeDate);
    const startOfToday = new Date(today + "T00:00:00");

    if (open < startOfToday) {
      alert("Open date cannot be in the past");
      return;
    }

    if (close < open) {
      alert("Close date cannot be before open date");
      return;
    }

    console.log("Creating new event:", eventFormData);
    
    // Close dialog and cleanup
    if (logoPreview) {
      try { URL.revokeObjectURL(logoPreview); } catch (e) {}
      setLogoPreview(null);
    }
    setIsAddEventDialogOpen(false);
  };

  // Calendar helper functions
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
      location: "London, UK",
      exhibitorCount: 45,
      visitorCount: 1250,
      startDate: new Date(2025, 0, 22), // Jan 22
      endDate: new Date(2025, 0, 24),
      color: "blue"
    },
    {
      id: 2,
      name: "AI Summit 2025",
      date: "February 12-13, 2025",
      location: "Berlin, DE",
      exhibitorCount: 32,
      visitorCount: 890,
      startDate: new Date(2025, 1, 12), // Feb 12
      endDate: new Date(2025, 1, 13),
      color: "green"
    },
    {
      id: 3,
      name: "Digital Transform Conference",
      date: "March 5-6, 2025",
      location: "New York, USA",
      exhibitorCount: 28,
      visitorCount: 720,
      startDate: new Date(2025, 2, 5), // Mar 5
      endDate: new Date(2025, 2, 6),
      color: "purple"
    },
    {
      id: 4,
      name: "Startup Showcase 2025",
      date: "April 18, 2025",
      location: "Dublin, IE",
      exhibitorCount: 24,
      visitorCount: 450,
      startDate: new Date(2025, 3, 18), // Apr 18
      endDate: new Date(2025, 3, 18),
      color: "blue"
    },
    {
      id: 5,
      name: "Cloud Computing Expo",
      date: "May 9-10, 2025",
      location: "San Francisco, USA",
      exhibitorCount: 30,
      visitorCount: 580,
      startDate: new Date(2025, 4, 9), // May 9
      endDate: new Date(2025, 4, 10),
      color: "green"
    }
  ];

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

  // Handle event click from calendar
  const handleEventClick = (event) => {
    // Navigate to the event admin dashboard
    const matchingEvent = mockOrganiserEvents.find(e => e.name === event.name);
    if (matchingEvent) {
      onNavigate?.("event-admin-dashboard", { 
        event: { id: matchingEvent.id, name: matchingEvent.name }, 
        organiser: selectedEventOrganiser 
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DeveloperLabel
        pageName="EventOrganiserDashboard"
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
          ...(isAddEventDialogOpen ? ["AddEventDialog"] : []),
        ]}
      />

      <Navigation
        user={user}
        currentPage="event-organiser-dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <Breadcrumbs
        user={user}
        // selectedOrganiser={selectedEventOrganiser}
        selectedEvent={null}
        selectedCompany={null}
        selectedUser={null}
        onNavigate={onNavigate}
        currentPage="event-organiser-dashboard"
      />

      <main className="container mx-auto px-6 py-8 space-y-8 pt-28">
        <TooltipProvider>
          {/* Hero Section */}
          <div className="space-y-6 pt-4">
            {/* Event Organiser Name and Metrics in One Line */}
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center space-x-4">
                {selectedEventOrganiser?.image && (
                  <ImageWithFallback
                    src={selectedEventOrganiser.image}
                    alt={selectedEventOrganiser.name || "Event Organiser"}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold whitespace-nowrap">
                    {selectedEventOrganiser
                      ? `${selectedEventOrganiser.name}`
                      : "{EventOrganiserName}"}
                  </h1>
                </div>
              </div>

              {/* Performance Metrics Cards - SuperAdmin styling
              <div className="flex gap-6 sm:gap-3 lg:gap-4 flex-1 justify-evenly">
                <Card className="bg-emerald-50 border-emerald-200 border flex-1 min-w-0"
                  onClick={() => {
                    setActiveTab("events");
                    setTimeout(() => {
                      leadsTabRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                      setTimeout(() => {
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        });
                      }, 500);
                    }, 100);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CardContent className="flex items-center gap-3 sm:gap-3 p-2 sm:p-2">
                    <Users className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-emerald-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1 text-center">
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground whitespace-nowrap">Total Leads</div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 leading-tight">
                        <AnimatedCounter value={eventLeads.length} duration={1500} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200 border flex-1 min-w-0">
                  <CardContent className="flex items-center gap-3 sm:gap-3 p-2 sm:p-2">
                    <Award className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-orange-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1 text-center">
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground whitespace-nowrap">Licenses</div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 leading-tight">
                        {mockEventMetrics.totalLicensesActive}/{mockEventMetrics.totalLicensesAssigned}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200 border flex-1 min-w-0">
                  <CardContent className="flex items-center gap-3 sm:gap-3 p-2 sm:p-2">
                    <TrendingUp className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-blue-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1 text-center">
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground whitespace-nowrap">Sales Intel</div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 leading-tight">
                        {mockEventMetrics.avgSalesIntelScore.toFixed(1)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200 border flex-1 min-w-0">
                  <CardContent className="flex items-center gap-3 sm:gap-3 p-2 sm:p-2">
                    <Target className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-purple-600 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1 text-center">
                      <div className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground whitespace-nowrap">Conversion</div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 leading-tight">
                        {mockEventMetrics.avgConversionScore.toFixed(1)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}
            </div>

          </div>

          {/* Event Management and Calendar Side by Side */}
          <div className="flex gap-6" ref={leadsTabRef}>
            {/* Left Column - Events Management (70% width) */}
            <div style={{ flex: "0 0 70%", minWidth: 0 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Events</CardTitle>
                        <CardDescription>
                          {/* View all events organised by this organiser */}
                        </CardDescription>
                      </div>
                      <Button onClick={() => setIsAddEventDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Event
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="events">
                        Events - <span className="font-bold">{mockOrganiserEvents.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="organiser-users">
                        Organiser Users - <span className="font-bold">{organiserUsers.length}</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="space-y-4">
                      <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>
                                  <button type="button" className="flex items-center gap-1 font-semibold" onClick={() => handleEventSort("name")}>Event<span className="text-xs text-muted-foreground">{getSortIcon("name", eventsSortBy, eventsSortOrder)}</span></button>
                                </TableHead>
                                <TableHead>
                                  <button type="button" className="flex items-center gap-1 font-semibold" onClick={() => handleEventSort("dateLabel")}>Date<span className="text-xs text-muted-foreground">{getSortIcon("dateLabel", eventsSortBy, eventsSortOrder)}</span></button>
                                </TableHead>
                                <TableHead>
                                  <button type="button" className="flex items-center gap-1 font-semibold" onClick={() => handleEventSort("visitorCount")}>Visitors<span className="text-xs text-muted-foreground">{getSortIcon("visitorCount", eventsSortBy, eventsSortOrder)}</span></button>
                                </TableHead>
                                <TableHead className="text-right">
                                  <button type="button" className="flex items-center gap-1 ml-auto font-semibold" onClick={() => handleEventSort("leadsCaptured")}>Leads<span className="text-xs text-muted-foreground">{getSortIcon("leadsCaptured", eventsSortBy, eventsSortOrder)}</span></button>
                                </TableHead>
                                <TableHead className="text-right font-semibold">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedEvents.map((event) => (
                                <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); onNavigate?.("event-admin-dashboard", { event: { id: event.id, name: event.name }, organiser: selectedEventOrganiser }); }}>
                                  <TableCell className="font-medium">{event.name}</TableCell>
                                  <TableCell>{event.dateLabel}</TableCell>
                                  <TableCell>{getVisitorCountForEvent(event.id)}</TableCell>
                                  <TableCell className="text-right"><span className="text-blue-600 font-semibold">{event.leadsCaptured}</span></TableCell>
                                  <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); console.log("Edit event", event.name); }}><Edit className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="organiser-users" className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                        </div>
                        <Button onClick={() => setIsAddOrganiserDialogOpen(true)} >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Organiser
                        </Button>
                        
                      </div>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-1/6">User</TableHead>
                              <TableHead className="w-1/4">Email</TableHead>
                              <TableHead className="w-1/6">Role</TableHead>
                              <TableHead className="w-1/6 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {organiserUsers.map((user) => (
                              <TableRow key={user.id} className="hover:bg-muted/50">
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      {user.avatar ? (
                                        <AvatarImage src={user.avatar} alt={user.firstName} />
                                      ) : (
                                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">Event Organiser</span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" onClick={() => setIsAddOrganiserDialogOpen(true)}><Edit className="h-4 w-4" /></Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
              </CardContent>
            </Card>
            </div>

            {/* Right Column - Calendar (30% width) */}
            <div style={{ flex: "0 0 30%", minWidth: 0 }}>
            <Card className="h-full">
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
                {sortedEvents.slice(0, 3).map((event, idx) => {
                  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  const eventDate = new Date(2025, 0, 22 + idx * 2);
                  const dayLabel = dayLabels[eventDate.getDay()];
                  const dateNum = eventDate.getDate();
                  
                  return (
                    <div 
                      key={event.id}
                      className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      onClick={() => onNavigate?.("event-admin-dashboard", { event: { id: event.id, name: event.name }, organiser: selectedEventOrganiser })}
                    >
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                        <span className="text-xs">{dayLabel}</span>
                        <span className="font-bold">{dateNum}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{event.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{event.visitorCount} Visitors • {event.leadsCaptured} Leads</p>
                      </div>
                    </div>
                  );
                })}
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
                <div 
                  className="flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEventClick(mockOrganiserEvents[0])}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-700 rounded flex-shrink-0">
                    <span className="text-lg font-bold">23</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">Unmatched Scans</h4>
                    <p className="text-sm text-muted-foreground truncate">{mockOrganiserEvents[0]?.name}</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEventClick(mockOrganiserEvents[0])}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-700 rounded flex-shrink-0">
                    <span className="text-lg font-bold">5</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">Inactive Exhibitors</h4>
                    <p className="text-sm text-muted-foreground truncate">{mockOrganiserEvents[0]?.name}</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEventClick(mockOrganiserEvents[1])}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-700 rounded flex-shrink-0">
                    <span className="text-lg font-bold">8</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">Failed Logins</h4>
                    <p className="text-sm text-muted-foreground truncate">{mockOrganiserEvents[1]?.name}</p>
                  </div>
                </div>
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
                  onClick={() => handleEventClick(mockOrganiserEvents[0])}
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                    <span className="text-xs">Jan</span>
                    <span className="font-bold">22-24</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{mockOrganiserEvents[0]?.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">45 Exhibitors • 480 Leads</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => handleEventClick(mockOrganiserEvents[1])}
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                    <span className="text-xs">Feb</span>
                    <span className="font-bold">12-13</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{mockOrganiserEvents[1]?.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">32 Exhibitors • 320 Leads</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => handleEventClick(mockOrganiserEvents[2])}
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                    <span className="text-xs">Mar</span>
                    <span className="font-bold">5-6</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{mockOrganiserEvents[2]?.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">28 Exhibitors • 260 Leads</p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => handleEventClick(mockOrganiserEvents[3])}
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-700 text-white rounded flex-shrink-0">
                    <span className="text-xs">Apr</span>
                    <span className="font-bold">18</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{mockOrganiserEvents[3]?.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">24 Exhibitors • 140 Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Dialog open={isAddOrganiserDialogOpen} onOpenChange={setIsAddOrganiserDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Organiser</DialogTitle>
                <DialogDescription>
                  Assign a new organiser to this event. Optionally send them an email invitation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organiser-firstname">First Name</Label>
                    <Input id="organiser-firstname" value={newOrganiser.firstName} onChange={e => setNewOrganiser(o => ({ ...o, firstName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organiser-lastname">Last Name</Label>
                    <Input id="organiser-lastname" value={newOrganiser.lastName} onChange={e => setNewOrganiser(o => ({ ...o, lastName: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organiser-email">Email</Label>
                  <Input id="organiser-email" type="email" value={newOrganiser.email} onChange={e => setNewOrganiser(o => ({ ...o, email: e.target.value }))} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="send-invite-toggle" checked={newOrganiser.sendInvite} onCheckedChange={checked => setNewOrganiser(o => ({ ...o, sendInvite: checked }))} />
                  <Label htmlFor="send-invite-toggle">Send email invitation</Label>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddOrganiserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!newOrganiser.firstName.trim() || !newOrganiser.lastName.trim() || !newOrganiser.email.trim()) {
                        alert("Please fill in all fields");
                        return;
                      }
                      setOrganiserUsers(users => [
                        ...users,
                        {
                          id: users.length + 1,
                          firstName: newOrganiser.firstName,
                          lastName: newOrganiser.lastName,
                          email: newOrganiser.email,
                          avatar: null,
                        },
                      ]);
                      if (newOrganiser.sendInvite) {
                        alert(`Invitation email sent to ${newOrganiser.email}`);
                      }
                      setIsAddOrganiserDialogOpen(false);
                      setNewOrganiser({ firstName: "", lastName: "", email: "", sendInvite: true });
                    }}
                  >
                    Add Organiser
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  Send Onboarding Email
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Import Visitors</DialogTitle>
              <DialogDescription>
                Upload a CSV file to import visitor data for
                this event.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() =>
                  setIsVisitorImportDialogOpen(false)
                }
              >
                Cancel
              </Button>
              <Button onClick={handleImportSubmit}>
                Import Visitors
              </Button>
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
                  value={eventFormData.name}
                  onChange={(e) => setEventFormData({...eventFormData, name: e.target.value})}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="event-description">Description *</Label>
                <textarea
                  id="event-description"
                  placeholder="Event description"
                  className="w-full p-2 border rounded-md min-h-20"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open-date">Open Date *</Label>
                  <Input
                    id="open-date"
                    type="date"
                    min={today}
                    value={eventFormData.openDate}
                    onChange={(e) => setEventFormData({...eventFormData, openDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close-date">Close Date *</Label>
                  <Input
                    id="close-date"
                    type="date"
                    min={eventFormData.openDate || today}
                    value={eventFormData.closeDate}
                    onChange={(e) => setEventFormData({...eventFormData, closeDate: e.target.value})}
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
                      if (logoPreview) {
                        try { URL.revokeObjectURL(logoPreview); } catch (e) {}
                        setLogoPreview(null);
                      }
                      if (file) {
                        const preview = URL.createObjectURL(file);
                        setEventFormData({...eventFormData, logo: file});
                        setLogoPreview(preview);
                      } else {
                        setEventFormData({...eventFormData, logo: null});
                      }
                    }}
                    className="border rounded p-1"
                  />
                  {eventFormData.logo && (
                    <div className="w-20 h-20 overflow-hidden rounded bg-gray-100">
                      <img src={eventFormData.logo instanceof File ? (logoPreview || '') : eventFormData.logo} alt="logo preview" className="w-full h-full object-cover" />
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
                    value={eventFormData.city}
                    onChange={(e) => setEventFormData({...eventFormData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="e.g. UK"
                    value={eventFormData.country}
                    onChange={(e) => setEventFormData({...eventFormData, country: e.target.value})}
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
                    value={eventFormData.ccEmail}
                    onChange={(e) => setEventFormData({...eventFormData, ccEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organiser-email">Organiser Email *</Label>
                  <Input
                    id="organiser-email"
                    type="email"
                    placeholder="e.g. organiser@org.co.uk"
                    value={eventFormData.organiserEmail}
                    onChange={(e) => setEventFormData({...eventFormData, organiserEmail: e.target.value})}
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
                    value={eventFormData.companyLicenses}
                    onChange={(e) => setEventFormData({...eventFormData, companyLicenses: parseInt(e.target.value) || 0})}
                    className="w-24"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allow-download"
                      checked={eventFormData.allowDownload}
                      onChange={(e) => setEventFormData({...eventFormData, allowDownload: e.target.checked})}
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
      </main>
    </div>
  );
}
