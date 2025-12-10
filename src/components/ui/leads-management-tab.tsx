// File: components/ui/leads-management-tab.tsx
import { Download, FilterX, X, Search } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Input } from "./input";
import { useState } from "react";
import { getScoreBadgeColor, getPriorityBadgeColor, getSortIcon, getFilterDisplayName } from "../utils/dashboardHelpers";

// Sample leads data for LeadDashboard
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
  }
];

export function LeadsManagementTab({ 
  filters,
  leadFilters, 
  onClearFilters,
  clearFilters, 
  handleExportToExcel, 
  onRemoveFilter,
  removeFilter, 
  mockTeamUsers, 
  handleLeadsSort, 
  leadsSortBy, 
  leadsSortOrder, 
  filteredLeads, 
  openLeadDialog 
}) {
  // Handle both prop names for backwards compatibility and null safety
  const safeFilters = filters || leadFilters || {};
  const safeClearFilters = onClearFilters || clearFilters || (() => {});
  const safeRemoveFilter = onRemoveFilter || removeFilter || (() => {});
  
  // Use sample data if no filteredLeads provided (for LeadDashboard)
  const allLeads = filteredLeads || mockYourLeads;
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter leads based on search query
  const searchFilteredLeads = allLeads.filter(lead => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.jobTitle.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.industry.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.capturedBy.toLowerCase().includes(query)
    );
  });

  // Apply sorting to the leads
  const sortLeads = (leads, sortBy, sortOrder) => {
    if (!sortBy || !leads) return leads;

    return [...leads].sort((a, b) => {
      let aVal, bVal;

      // Get the values to compare
      switch (sortBy) {
        case "name":
          aVal = a.name || "";
          bVal = b.name || "";
          break;
        case "company":
          aVal = a.company || "";
          bVal = b.company || "";
          break;
        case "capturedBy":
          aVal = a.capturedBy || "";
          bVal = b.capturedBy || "";
          break;
        case "salesIntelScore":
          aVal = a.salesIntelScore || 0;
          bVal = b.salesIntelScore || 0;
          break;
        case "conversionScore":
          aVal = a.conversionScore || 0;
          bVal = b.conversionScore || 0;
          break;
        case "priority":
          // Custom sorting for priority: High > Medium > Low
          const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
          aVal = priorityOrder[a.priority] || 0;
          bVal = priorityOrder[b.priority] || 0;
          break;
        case "capturedAt":
          aVal = new Date(a.capturedAt).getTime();
          bVal = new Date(b.capturedAt).getTime();
          break;
        default:
          aVal = a[sortBy] || "";
          bVal = b[sortBy] || "";
      }

      // Compare values
      if (typeof aVal === "string" && typeof bVal === "string") {
        const comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
        return sortOrder === "desc" ? -comparison : comparison;
      } else {
        const comparison = aVal - bVal;
        return sortOrder === "desc" ? -comparison : comparison;
      }
    });
  };

  // Sort the filtered leads
  const leadsToShow = sortLeads(searchFilteredLeads, leadsSortBy, leadsSortOrder);
  
  return (
    <Card data-tour="leads-table">
      <CardHeader>
  <div className="flex items-center justify-between">
    <div>{filteredLeads && <h2></h2>}</div>

    {/* TOOLBAR */}
    <div className="flex items-center gap-2 w-full flex-wrap">
      {/* LEFT: Active Filters (flex-1 keeps them on the left and creates space) */}
      {Object.keys(safeFilters).length > 0 && (
        <div
          className="
            flex items-center gap-2
            min-w-0 flex-1
            overflow-x-auto whitespace-nowrap
            [-ms-overflow-style:'none'] [scrollbar-width:'none']
            [&::-webkit-scrollbar]:hidden
          "
        >
          {Object.entries(safeFilters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="inline-flex items-center gap-1">
              {getFilterDisplayName ? getFilterDisplayName(key, value, mockTeamUsers) : `${key}: ${value}`}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => safeRemoveFilter(key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* (Optional) Export button — sits between left badges and the right cluster */}
      {filteredLeads && handleExportToExcel && (
        <Button 
          variant="blue" 
          onClick={handleExportToExcel} 
          className="flex items-center gap-2" 
          data-tour="export-excel"
          style={{ backgroundColor: '#2563eb', color: 'white', borderColor: '#2563eb' }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      )}

      {/* Clear Filters — immediately to the LEFT of the search */}
      {Object.keys(safeFilters).length > 0 && (
        <Button variant="outline" size="sm" onClick={safeClearFilters}
      type="button">
          <FilterX className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}

      {/* RIGHT: Search — pinned to the far right */}
      <div className="relative flex-shrink-0 ml-auto">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 w-40 md:w-56 lg:w-64"
        />
      </div>
    </div>
  </div>
</CardHeader>


      <CardContent>
        {/* Active Filters */}
        {/* {Object.keys(safeFilters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {Object.entries(safeFilters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {getFilterDisplayName ? getFilterDisplayName(key, value, mockTeamUsers) : `${key}: ${value}`}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => safeRemoveFilter(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )} */}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className={handleLeadsSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleLeadsSort ? () => handleLeadsSort("name", leadsSortBy, leadsSortOrder) : undefined}
              >
                Contact {getSortIcon && getSortIcon("name", leadsSortBy, leadsSortOrder)}
              </TableHead>
              <TableHead 
                className={handleLeadsSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleLeadsSort ? () => handleLeadsSort("company", leadsSortBy, leadsSortOrder) : undefined}
              >
                Company {getSortIcon && getSortIcon("company", leadsSortBy, leadsSortOrder)}
              </TableHead>
              <TableHead 
                className={handleLeadsSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleLeadsSort ? () => handleLeadsSort("capturedBy", leadsSortBy, leadsSortOrder) : undefined}
              >
                Captured By {getSortIcon && getSortIcon("capturedBy", leadsSortBy, leadsSortOrder)}
              </TableHead>
              <TableHead 
                className={handleLeadsSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleLeadsSort ? () => handleLeadsSort("salesIntelScore", leadsSortBy, leadsSortOrder) : undefined}
              >
                Sales Intel {getSortIcon && getSortIcon("salesIntelScore", leadsSortBy, leadsSortOrder)}
              </TableHead>
              <TableHead 
                className={handleLeadsSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleLeadsSort ? () => handleLeadsSort("conversionScore", leadsSortBy, leadsSortOrder) : undefined}
              >
                Conversion {getSortIcon && getSortIcon("conversionScore", leadsSortBy, leadsSortOrder)}
              </TableHead>
              <TableHead 
                className={handleLeadsSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleLeadsSort ? () => handleLeadsSort("priority", leadsSortBy, leadsSortOrder) : undefined}
              >
                Priority {getSortIcon && getSortIcon("priority", leadsSortBy, leadsSortOrder)}
              </TableHead>
              <TableHead 
                className={handleLeadsSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleLeadsSort ? () => handleLeadsSort("capturedAt", leadsSortBy, leadsSortOrder) : undefined}
              >
                Captured {getSortIcon && getSortIcon("capturedAt", leadsSortBy, leadsSortOrder)}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!leadsToShow || leadsToShow.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No leads to display
                </TableCell>
              </TableRow>
            ) : (
              leadsToShow.map((lead) => (
                <TableRow 
                  key={lead.id}
                  className={openLeadDialog ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={openLeadDialog ? () => openLeadDialog(lead) : undefined}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        {lead.hasPhoto ? (
                          <AvatarImage src={lead.photoUrl} />
                        ) : null}
                        <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.jobTitle}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.company}</p>
                      <p className="text-sm text-muted-foreground">{lead.industry}</p>
                    </div>
                  </TableCell>
                  <TableCell>{lead.capturedBy}</TableCell>
                  <TableCell>
                    {lead.salesIntelScore ? (
                      <Badge 
                        variant="outline"
                        className={getScoreBadgeColor ? getScoreBadgeColor(lead.salesIntelScore) : "bg-gray-100 text-gray-800"}
                      >
                        {lead.salesIntelScore}/10
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Processing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.conversionScore ? (
                      <Badge 
                        variant="outline"
                        className={getScoreBadgeColor ? getScoreBadgeColor(lead.conversionScore) : "bg-gray-100 text-gray-800"}
                      >
                        {lead.conversionScore}/10
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Processing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={getPriorityBadgeColor ? getPriorityBadgeColor(lead.priority) : "bg-gray-100 text-gray-800"}
                    >
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(lead.capturedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
