// File: components/utils/dashboardHelpers.ts
export const getScoreBadgeColor = (score) => {
  if (!score) return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  if (score >= 8) return "bg-red-100 text-red-800 hover:bg-red-100";
  if (score >= 6) return "bg-orange-100 text-orange-800 hover:bg-orange-100";
  if (score >= 4) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
  return "bg-blue-100 text-blue-800 hover:bg-blue-100";
};

export const getLeadTypeBadgeColor = (leadType) => {
  switch (leadType) {
    case "Hot": return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Warm": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "Information Only": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Low": return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Processing": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

// Card background colors for lead quality scores
export const getScoreCardBackground = (score) => {
  if (!score) return "bg-gray-50 border-gray-200";
  if (score >= 8) return "bg-red-50 border-red-200";
  if (score >= 6) return "bg-orange-50 border-orange-200";
  if (score >= 4) return "bg-yellow-50 border-yellow-200";
  return "bg-blue-50 border-blue-200";
};

export const getConversionCardBackground = () => {
  return "bg-orange-50 border-orange-200"; // Warm color as requested
};

export const getPriorityCardBackground = (priority) => {
  switch (priority) {
    case "High": return "bg-red-50 border-red-200";
    case "Medium": return "bg-yellow-50 border-yellow-200";
    case "Low": return "bg-green-50 border-green-200";
    case "Processing": return "bg-gray-50 border-gray-200";
    default: return "bg-gray-50 border-gray-200";
  }
};

export const getScoreIconColor = (score) => {
  if (!score) return "text-gray-600";
  if (score >= 8) return "text-red-600";
  if (score >= 6) return "text-orange-600";
  if (score >= 4) return "text-yellow-600";
  return "text-blue-600";
};

export const getPriorityIconColor = (priority) => {
  switch (priority) {
    case "High": return "text-red-600";
    case "Medium": return "text-yellow-600";
    case "Low": return "text-green-600";
    case "Processing": return "text-gray-600";
    default: return "text-gray-600";
  }
};

export const getSortIcon = (column, currentSortBy, currentSortOrder) => {
  if (currentSortBy !== column) return "↕";
  return currentSortOrder === "desc" ? "↓" : "↑";
};

export const getFilterDisplayName = (key, value, teamUsers = []) => {
  switch (key) {
    case "hour": return `Hour: ${value}`;
    case "leadType": return `Lead Type: ${value}`;
    case "capturedById": 
      const user = teamUsers.find(u => u.id === value);
      return `Captured By: ${user ? user.name : value}`;
    case "product": return `Product: ${value}`;
    case "unmatchedScans": return `Unmatched Scans`;
    case "noEmail": return `Leads without email`;
    case "inactiveExhibitors": return `Companies with no active users`;
    default: return `${key}: ${value}`;
  }
};

export const sortData = (data, sortBy, sortOrder) => {
  return [...data].sort((a, b) => {
    let aVal, bVal;
    
    if (sortBy === "capturedAt") {
      aVal = new Date(a[sortBy]).getTime();
      bVal = new Date(b[sortBy]).getTime();
    } else if (sortBy === "salesIntelScore" || sortBy === "conversionScore" || sortBy === "priority") {
      aVal = a[sortBy] || 0;
      bVal = b[sortBy] || 0;
    } else {
      aVal = (a[sortBy] || "").toString().toLowerCase();
      bVal = (b[sortBy] || "").toString().toLowerCase();
    }
    
    if (typeof aVal === "string") {
      return sortOrder === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
  });
};

export const applyLeadFilters = (leads, filters) => {
  return leads.filter(lead => {
    if (filters.leadType && lead.leadType !== filters.leadType) {
      return false;
    }
    if (filters.hour && lead.capturedHour !== filters.hour) {
      return false;
    }
    if (filters.capturedById && lead.capturedById !== filters.capturedById) {
      return false;
    }
    if (filters.product && !lead.products.includes(filters.product)) {
      return false;
    }
    return true;
  });
};
