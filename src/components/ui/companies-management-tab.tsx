// File: components/ui/companies-management-tab.tsx
import { Download, Plus, Edit, Search } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Badge } from "./badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination";
import { Input } from "./input";
import { useState } from "react";
import { getScoreBadgeColor, getSortIcon } from "../utils/dashboardHelpers";

export function CompaniesManagementTab({ 
  companies = [],
  sortBy = "leadsCapured",
  sortOrder = "desc",
  onSort,
  currentPage = 1,
  itemsPerPage = 5,
  onPageChange,
  onExport,
  onAddCompany,
  onEditCompany,
  onCompanyClick
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter companies based on search query
  const searchFilteredCompanies = companies.filter(company => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      company.companyName.toLowerCase().includes(query) ||
      company.contactFirstName.toLowerCase().includes(query) ||
      company.contactLastName.toLowerCase().includes(query) ||
      company.contactEmail.toLowerCase().includes(query)
    );
  });

  // Sort companies
  const sortedCompanies = [...searchFilteredCompanies].sort((a, b) => {
    const aVal = a[sortBy] || 0;
    const bVal = b[sortBy] || 0;
    return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* LEFT: Buttons */}
          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {onAddCompany && (
              <Button size="sm" onClick={() => onAddCompany(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            )}
          </div>

          {/* RIGHT: Search Box */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-40 md:w-56 lg:w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("Companies") : undefined}
                >
                Company</TableHead>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("leadsCapured") : undefined}
              >
                Leads{" "}
                {getSortIcon && getSortIcon("leadsCapured", sortBy, sortOrder)}
              </TableHead>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("avgSalesIntelScore") : undefined}
              >
                Avg Sales Intel{" "}
                {getSortIcon && getSortIcon("avgSalesIntelScore", sortBy, sortOrder)}
              </TableHead>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("avgConversionScore") : undefined}
              >
                Avg Conversion{" "}
                {getSortIcon && getSortIcon("avgConversionScore", sortBy, sortOrder)}
              </TableHead>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("licensesActive") : undefined}
              >
                Active Users{" "}
                {getSortIcon && getSortIcon("licensesActive", sortBy, sortOrder)}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!paginatedCompanies || paginatedCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No companies to display
                </TableCell>
              </TableRow>
            ) : (
              paginatedCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  className={onCompanyClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={onCompanyClick ? () => onCompanyClick(company) : undefined}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {company.companyName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {company.contactFirstName}{" "}
                        {company.contactLastName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-blue-600">
                      {company.leadsCapured}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getScoreBadgeColor ? getScoreBadgeColor(company.avgSalesIntelScore) : "bg-gray-100 text-gray-800"}
                    >
                      {company.avgSalesIntelScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getScoreBadgeColor ? getScoreBadgeColor(company.avgConversionScore) : "bg-gray-100 text-gray-800"}
                    >
                      {company.avgConversionScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">
                      {company.licensesActive}
                    </span>
                    <span className="text-muted-foreground">
                      /{company.licensesAssigned}
                    </span>
                  </TableCell>
                  <TableCell>
                    {onEditCompany && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCompany(company);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => onPageChange && onPageChange(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
