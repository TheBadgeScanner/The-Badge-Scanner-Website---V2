// File: components/ui/team-management-tab.tsx
import { Users, UserPlus, Edit } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { getScoreBadgeColor, getSortIcon } from "../utils/dashboardHelpers";

// Mock team users data for fallback
const mockTeamUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    totalLeads: 23,
    avgSalesIntel: 8.1,
    avgConversion: 7.5,
    overallScore: 7.8,
    isActivated: true
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    totalLeads: 18,
    avgSalesIntel: 7.2,
    avgConversion: 6.8,
    overallScore: 7.0,
    isActivated: true
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@company.com",
    avatar: null,
    totalLeads: 15,
    avgSalesIntel: 6.5,
    avgConversion: 6.2,
    overallScore: 6.4,
    isActivated: false
  }
];

export function TeamManagementTab({ 
  sortedTeamUsers,
  teamSortBy, 
  teamSortOrder, 
  handleTeamSort, 
  handleAddUser, 
  handleEditUser, 
  filterLeadsByUser,
  onViewUserDashboard
}) {
  // Safe fallbacks for props
  const safeTeamUsers = sortedTeamUsers || mockTeamUsers;
  const safeTeamSortBy = teamSortBy || "name";
  const safeTeamSortOrder = teamSortOrder || "asc";
  const safeHandleTeamSort = handleTeamSort || (() => {});
  const safeHandleAddUser = handleAddUser || (() => console.log('Add user'));
  const safeHandleEditUser = handleEditUser || (() => console.log('Edit user'));
  const safeFilterLeadsByUser = filterLeadsByUser || (() => {});
  const safeOnViewUserDashboard = onViewUserDashboard || (() => console.log('View dashboard'));
  const safeGetSortIcon = getSortIcon || (() => "");
  const safeGetScoreBadgeColor = getScoreBadgeColor || (() => "bg-gray-100 text-gray-800");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Manage your team and track individual performance</CardDescription>
          </div>
          <Button onClick={safeHandleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className={handleTeamSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleTeamSort ? () => safeHandleTeamSort("name", safeTeamSortBy, safeTeamSortOrder) : undefined}
              >
                User {safeGetSortIcon("name", safeTeamSortBy, safeTeamSortOrder)}
              </TableHead>
              <TableHead 
                className={handleTeamSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleTeamSort ? () => safeHandleTeamSort("totalLeads", safeTeamSortBy, safeTeamSortOrder) : undefined}
              >
                Leads {safeGetSortIcon("totalLeads", safeTeamSortBy, safeTeamSortOrder)}
              </TableHead>
              <TableHead 
                className={handleTeamSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleTeamSort ? () => safeHandleTeamSort("avgSalesIntel", safeTeamSortBy, safeTeamSortOrder) : undefined}
              >
                Sales Intel {safeGetSortIcon("avgSalesIntel", safeTeamSortBy, safeTeamSortOrder)}
              </TableHead>
              <TableHead 
                className={handleTeamSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleTeamSort ? () => safeHandleTeamSort("avgConversion", safeTeamSortBy, safeTeamSortOrder) : undefined}
              >
                Conversion {safeGetSortIcon("avgConversion", safeTeamSortBy, safeTeamSortOrder)}
              </TableHead>
              <TableHead 
                className={handleTeamSort ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={handleTeamSort ? () => safeHandleTeamSort("overallScore", safeTeamSortBy, safeTeamSortOrder) : undefined}
              >
                Overall {safeGetSortIcon("overallScore", safeTeamSortBy, safeTeamSortOrder)}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeTeamUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No team members found</p>
                  <p className="text-sm">Add team members to start tracking performance</p>
                </TableCell>
              </TableRow>
            ) : (
              safeTeamUsers.map((teamUser) => (
                <TableRow key={teamUser.id}>
                  <TableCell>
                    <button 
                      onClick={() => safeOnViewUserDashboard(teamUser)}
                      className="flex items-center space-x-3 hover:opacity-75 transition-opacity w-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={teamUser.avatar} />
                        <AvatarFallback>
                          {teamUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium text-primary hover:underline">{teamUser.name}</p>
                        <p className="text-sm text-muted-foreground">{teamUser.email}</p>
                      </div>
                    </button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-medium text-primary hover:underline"
                      onClick={() => safeFilterLeadsByUser(teamUser.id)}
                    >
                      {teamUser.totalLeads}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {teamUser.avgSalesIntel ? (
                      <Badge 
                        variant="outline"
                        className={safeGetScoreBadgeColor(teamUser.avgSalesIntel)}
                      >
                        {teamUser.avgSalesIntel}/10
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {teamUser.avgConversion ? (
                      <Badge 
                        variant="outline"
                        className={safeGetScoreBadgeColor(teamUser.avgConversion)}
                      >
                        {teamUser.avgConversion}/10
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={safeGetScoreBadgeColor(teamUser.overallScore)}
                    >
                      {teamUser.overallScore}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {teamUser.isActivated ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-700">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-700">Inactive</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => safeHandleEditUser(teamUser)}
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
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
