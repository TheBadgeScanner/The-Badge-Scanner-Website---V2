// File: components/EventManagementPanel.tsx
import React, { useState, useMemo } from "react";
import { User, Mail } from "lucide-react";
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
                : "Add a new team member to your company"}
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
                  Send setup instructions and login details to the user
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
    </Card>
  );
}

export default EventManagementPanel;
