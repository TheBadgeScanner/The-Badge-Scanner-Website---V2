// File: components/ui/visitors-management-tab.tsx
import { Download, Upload, Search } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination";
import { Input } from "./input";
import { useState } from "react";
import { getSortIcon } from "../utils/dashboardHelpers";

export function VisitorsManagementTab({ 
  visitors = [],
  sortBy = "lastName",
  sortOrder = "asc",
  onSort,
  currentPage = 1,
  itemsPerPage = 5,
  onPageChange,
  onExport,
  onImport,
  formatDate
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter visitors based on search query
  const searchFilteredVisitors = visitors.filter(visitor => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      visitor.firstName.toLowerCase().includes(query) ||
      visitor.lastName.toLowerCase().includes(query) ||
      visitor.email.toLowerCase().includes(query) ||
      visitor.company.toLowerCase().includes(query) ||
      visitor.jobTitle.toLowerCase().includes(query)
    );
  });

  // Sort visitors
  const sortedVisitors = [...searchFilteredVisitors].sort((a, b) => {
    let aVal, bVal;

    if (sortBy === "imported") {
      aVal = new Date(a[sortBy]).getTime();
      bVal = new Date(b[sortBy]).getTime();
    } else {
      aVal = (a[sortBy] || "").toString().toLowerCase();
      bVal = (b[sortBy] || "").toString().toLowerCase();
    }

    if (typeof aVal === "string") {
      return sortOrder === "desc"
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }
    return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedVisitors.length / itemsPerPage);
  const paginatedVisitors = sortedVisitors.slice(
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
            {onImport && (
              <Button size="sm" onClick={onImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import Visitors
              </Button>
            )}
          </div>

          {/* RIGHT: Search Box */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search visitors..."
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
              <TableHead>Visitor</TableHead>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("company") : undefined}
              >
                Company{" "}
                {getSortIcon && getSortIcon("company", sortBy, sortOrder)}
              </TableHead>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("jobTitle") : undefined}
              >
                Job Title{" "}
                {getSortIcon && getSortIcon("jobTitle", sortBy, sortOrder)}
              </TableHead>
              <TableHead
                className={onSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={onSort ? () => onSort("imported") : undefined}
              >
                Imported{" "}
                {getSortIcon && getSortIcon("imported", sortBy, sortOrder)}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!paginatedVisitors || paginatedVisitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No visitors to display
                </TableCell>
              </TableRow>
            ) : (
              paginatedVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        {visitor.avatar && (
                          <AvatarImage
                            src={visitor.avatar}
                            alt={`${visitor.firstName} ${visitor.lastName}`}
                          />
                        )}
                        <AvatarFallback>
                          {visitor.firstName[0]}
                          {visitor.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {visitor.firstName} {visitor.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {visitor.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{visitor.company}</TableCell>
                  <TableCell>{visitor.jobTitle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate ? formatDate(visitor.imported) : visitor.imported}
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
