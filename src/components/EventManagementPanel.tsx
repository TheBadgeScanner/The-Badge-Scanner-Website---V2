// File: components/EventManagementPanel.tsx
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { CompaniesManagementTab } from "./ui/companies-management-tab";
import { VisitorsManagementTab } from "./ui/visitors-management-tab";
import { LeadsManagementTab } from "./ui/leads-management-tab";

export function EventManagementPanel({
  activeTab,
  setActiveTab,
  leadFilters,
  clearFilters,
  removeFilter,
  companies,
  visitors,
  filteredLeads,
  companySortBy,
  companySortOrder,
  handleCompanySort,
  companiesCurrentPage,
  itemsPerPage,
  setCompaniesCurrentPage,
  visitorSortBy,
  visitorSortOrder,
  handleVisitorSort,
  visitorsCurrentPage,
  setVisitorsCurrentPage,
  leadsSortBy,
  leadsSortOrder,
  handleLeadsSort,
  handleExportToExcel,
  handleVisitorImport,
  handleEditCompany,
  onNavigate,
  selectedEvent,
  selectedOrganiser,
  openLeadDialog,
}) {
  // Memoize counts to avoid unnecessary recalculations
  const companiesCount = useMemo(() => companies?.length || 0, [companies]);
  const visitorsCount = useMemo(() => visitors?.length || 0, [visitors]);
  const leadsCount = useMemo(() => filteredLeads?.length || 0, [filteredLeads]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Management</CardTitle>
        <CardDescription>
          Manage companies, visitors, and leads for this event
          {Object.keys(leadFilters || {}).length > 0 &&
            ` (filters applied to leads)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="companies">
              Companies - <span className="font-bold">{companiesCount}</span>
            </TabsTrigger>
            <TabsTrigger value="visitors">
              Visitors - <span className="font-bold">{visitorsCount}</span>
            </TabsTrigger>
            <TabsTrigger value="leads">
              Leads - <span className="font-bold">{leadsCount}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-4">
            <CompaniesManagementTab
              companies={companies}
              sortBy={companySortBy}
              sortOrder={companySortOrder}
              onSort={handleCompanySort}
              currentPage={companiesCurrentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCompaniesCurrentPage}
              onExport={handleExportToExcel}
              onAddCompany={handleEditCompany}
              onEditCompany={handleEditCompany}
              onCompanyClick={(company) =>
                onNavigate("admin-dashboard", {
                  event: selectedEvent,
                  organiser: selectedOrganiser,
                  company: company,
                })
              }
            />
          </TabsContent>

          <TabsContent value="visitors" className="space-y-4">
            <VisitorsManagementTab
              visitors={visitors}
              sortBy={visitorSortBy}
              sortOrder={visitorSortOrder}
              onSort={handleVisitorSort}
              currentPage={visitorsCurrentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setVisitorsCurrentPage}
              onExport={handleExportToExcel}
              onImport={handleVisitorImport}
            />
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <LeadsManagementTab
              filters={leadFilters}
              onClearFilters={clearFilters}
              onRemoveFilter={removeFilter}
              filteredLeads={filteredLeads}
              openLeadDialog={openLeadDialog}
              handleLeadsSort={handleLeadsSort}
              leadsSortBy={leadsSortBy}
              leadsSortOrder={leadsSortOrder}
              handleExportToExcel={handleExportToExcel}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default EventManagementPanel;
