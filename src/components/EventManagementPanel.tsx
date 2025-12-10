// File: components/EventManagementPanel.tsx
import React, { useState, useMemo } from "react";
import { User, Mail, Upload, Download } from "lucide-react";
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
import { Button } from "./ui/button";
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
import { CompaniesManagementTab } from "./ui/companies-management-tab";
import { VisitorsManagementTab } from "./ui/visitors-management-tab";
import { LeadsManagementTab } from "./ui/leads-management-tab";

export function EventManagementPanel({
  leadsTabRef,
  companiesTabRef,
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
  // Mock event admins data
  const [eventAdmins] = useState([
    {
      id: 1,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@eventpro.com",
      role: "Event Admin",
      avatar: null,
    },
    {
      id: 2,
      name: "James Chen",
      email: "james.chen@eventpro.com",
      role: "Event Admin",
      avatar: null,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@eventpro.com",
      role: "Event Admin",
      avatar: null,
    },
  ]);

  const [isEventAdminDialogOpen, setIsEventAdminDialogOpen] = useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [editingEventAdmin, setEditingEventAdmin] = useState(null);
  const [isCompanyImportDialogOpen, setIsCompanyImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCompanyImport = () => {
    setIsCompanyImportDialogOpen(true);
    setSelectedFile(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImportCompanies = () => {
    if (selectedFile) {
      console.log("Importing companies from file:", selectedFile.name);
      // Placeholder for import functionality
      setIsCompanyImportDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a CSV template
    const template = "Company Name,Contact First Name,Contact Last Name,Contact Email,Licenses Assigned,Use AI\nExample Corp,John,Doe,john@example.com,5,Yes";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAddEventAdmin = () => {
    setEditingEventAdmin(null);
    setSendWelcomeEmail(true);
    setIsEventAdminDialogOpen(true);
  };

  const handleEditEventAdmin = (admin) => {
    setEditingEventAdmin(admin);
    setSendWelcomeEmail(false);
    setIsEventAdminDialogOpen(true);
  };

  const handleSaveEventAdmin = () => {
    // Placeholder for save functionality
    console.log(editingEventAdmin ? "Update Event Admin" : "Add Event Admin");
    setIsEventAdminDialogOpen(false);
    setEditingEventAdmin(null);
  };

  // Memoize counts to avoid unnecessary recalculations
  const companiesCount = useMemo(() => companies?.length || 0, [companies]);
  const visitorsCount = useMemo(() => visitors?.length || 0, [visitors]);
  const leadsCount = useMemo(() => filteredLeads?.length || 0, [filteredLeads]);
  const eventAdminsCount = useMemo(() => eventAdmins?.length || 0, [eventAdmins]);

  return (
    <div ref={leadsTabRef}>
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
          <TabsList className="w-full inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="companies" className="whitespace-nowrap">
              Companies - <span className="font-bold">{companiesCount}</span>
            </TabsTrigger>
            <TabsTrigger value="visitors" className="whitespace-nowrap">
              Visitors - <span className="font-bold">{visitorsCount}</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="whitespace-nowrap">
              Leads - <span className="font-bold">{leadsCount}</span>
            </TabsTrigger>
            <TabsTrigger value="event-admins" className="whitespace-nowrap">
              Event Admins - <span className="font-bold">{eventAdminsCount}</span>
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
              onExport={handleCompanyImport}
              onAddCompany={handleEditCompany}
              onEditCompany={handleEditCompany}
              onCompanyClick={(company) =>
                onNavigate("admin-dashboard", {
                  event: selectedEvent,
                  organiser: selectedOrganiser,
                  company: company,
                })
              }
              filters={leadFilters}
              onClearFilters={clearFilters}
              onRemoveFilter={removeFilter}
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

          <TabsContent value="event-admins" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={handleAddEventAdmin} size="sm">
                <User className="h-4 w-4 mr-2" />
                Add Event Admin
              </Button>
            </div>
            <div className="space-y-3">
              {eventAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleEditEventAdmin(admin)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{admin.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{admin.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add Event Admin Dialog */}
      <Dialog
        open={isEventAdminDialogOpen}
        onOpenChange={setIsEventAdminDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEventAdmin ? "Edit Event Admin" : "Add New Event Admin"}
            </DialogTitle>
            <DialogDescription>
              {editingEventAdmin
                ? "Update event admin information and permissions"
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  placeholder="Enter first name" 
                  defaultValue={editingEventAdmin?.name?.split(" ")[0] || ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  placeholder="Enter last name" 
                  defaultValue={editingEventAdmin?.name?.split(" ")[1] || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="user@company.com"
                  defaultValue={editingEventAdmin?.email || ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  defaultValue={editingEventAdmin?.role || "Event Admin"}
                >
                  <option value="Event Admin">Event Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="send-welcome-admin">
                  Send Welcome Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send setup and login instructions to the user
                </p>
              </div>
              <Switch
                id="send-welcome-admin"
                checked={sendWelcomeEmail}
                onCheckedChange={setSendWelcomeEmail}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEventAdminDialogOpen(false);
                  setEditingEventAdmin(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEventAdmin}>
                {editingEventAdmin ? "Update Event Admin" : "Add & Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Import Dialog */}
      <Dialog
        open={isCompanyImportDialogOpen}
        onOpenChange={setIsCompanyImportDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Companies</DialogTitle>
            <DialogDescription>
              Download the template, fill it with your company data, and upload it to import multiple companies at once
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
                  onClick={handleDownloadTemplate}
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
                  id="company-file-upload"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="company-file-upload"
                  className="cursor-pointer"
                >
                  <div className="space-y-2">
                    {selectedFile ? (
                      <>
                        <p className="text-sm font-medium text-green-600">
                          ✓ {selectedFile.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            setSelectedFile(null);
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
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Ready to import {selectedFile.name}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCompanyImportDialogOpen(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImportCompanies}
                disabled={!selectedFile}
                style={{ backgroundColor: '#2563eb', color: 'white', borderColor: '#2563eb' }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Companies
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
    </div>
  );
}

export default EventManagementPanel;
