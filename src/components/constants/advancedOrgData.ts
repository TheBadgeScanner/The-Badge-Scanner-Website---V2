// File: components/constants/advancedOrgData.ts
// Mock data for company performance bubble chart
export const getTemperatureColor = (conversionScore) => {
  if (conversionScore >= 8) return "#dc2626"; // Hot - Red
  if (conversionScore >= 6) return "#ea580c"; // Warm - Orange
  if (conversionScore >= 4) return "#f97316"; // Cool - Light Orange
  return "#3b82f6"; // Cold - Blue
};

export const mockCompanyBubbleData = [
  { 
    id: 1, 
    name: "TechCorp Solutions", 
    x: 45, // total leads
    y: 8.2, // avg sales intel
    z: 120, // bubble size (revenue potential or company size)
    conversionScore: 7.8, // for color coding
  },
  { 
    id: 2, 
    name: "Innovation Labs", 
    x: 32, 
    y: 7.1, 
    z: 85,
    conversionScore: 6.2,
  },
  { 
    id: 3, 
    name: "StartupX", 
    x: 28, 
    y: 9.1, 
    z: 65,
    conversionScore: 8.5,
  },
  { 
    id: 4, 
    name: "MegaCorp Ltd", 
    x: 55, 
    y: 6.8, 
    z: 200,
    conversionScore: 5.4,
  },
  { 
    id: 5, 
    name: "Growth Co", 
    x: 18, 
    y: 5.2, 
    z: 45,
    conversionScore: 4.1,
  },
  { 
    id: 6, 
    name: "Digital Solutions", 
    x: 38, 
    y: 7.8, 
    z: 95,
    conversionScore: 7.2,
  }
];

// Apply temperature colors to bubble data
export const bubbleDataWithColors = mockCompanyBubbleData.map(company => ({
  ...company,
  color: getTemperatureColor(company.conversionScore)
}));

// Mock hourly leads data for advanced organiser
export const mockAdvancedHourlyData = [
  { hour: "9 AM", leads: 12 },
  { hour: "10 AM", leads: 25 },
  { hour: "11 AM", leads: 38 },
  { hour: "12 PM", leads: 22 },
  { hour: "1 PM", leads: 18 },
  { hour: "2 PM", leads: 31 },
  { hour: "3 PM", leads: 42 },
  { hour: "4 PM", leads: 35 },
  { hour: "5 PM", leads: 19 },
];

// Mock warmth distribution data for advanced organiser - reordered with Information Only before Cold
export const advancedLeadWarmthData = [
  { name: "None", value: 12, color: "#9CA3AF" },
  { name: "Info Only", value: 23, color: "#6B7280" },
  { name: "Cold", value: 45, color: "#3B82F6" },
  { name: "Warm", value: 89, color: "#F97316" },
  { name: "Hot", value: 67, color: "#EF4444" }
];

// Mock event companies data
export const mockEventCompanies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    industry: "Technology",
    totalLeads: 45,
    avgSalesIntel: 8.2,
    avgConversion: 7.8,
    overallScore: 8.0,
    isActive: true,
    lastActivity: "2025-01-15T16:30:00Z"
  },
  {
    id: 2,
    name: "Innovation Labs",
    industry: "R&D",
    totalLeads: 32,
    avgSalesIntel: 7.1,
    avgConversion: 6.2,
    overallScore: 6.7,
    isActive: true,
    lastActivity: "2025-01-15T15:45:00Z"
  },
  {
    id: 3,
    name: "StartupX",
    industry: "SaaS",
    totalLeads: 28,
    avgSalesIntel: 9.1,
    avgConversion: 8.5,
    overallScore: 8.8,
    isActive: true,
    lastActivity: "2025-01-15T16:00:00Z"
  },
  {
    id: 4,
    name: "MegaCorp Ltd",
    industry: "Financial Services",
    totalLeads: 55,
    avgSalesIntel: 6.8,
    avgConversion: 5.4,
    overallScore: 6.1,
    isActive: false,
    lastActivity: "2025-01-15T14:20:00Z"
  },
  {
    id: 5,
    name: "Growth Co",
    industry: "Marketing",
    totalLeads: 18,
    avgSalesIntel: 5.2,
    avgConversion: 4.1,
    overallScore: 4.7,
    isActive: true,
    lastActivity: "2025-01-15T12:30:00Z"
  },
  {
    id: 6,
    name: "Digital Solutions",
    industry: "Consulting",
    totalLeads: 38,
    avgSalesIntel: 7.8,
    avgConversion: 7.2,
    overallScore: 7.5,
    isActive: true,
    lastActivity: "2025-01-15T15:15:00Z"
  }
];
