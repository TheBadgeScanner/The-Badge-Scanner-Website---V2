// File: components/Navigation.tsx
import { BarChart3, Users, Calendar, Building2 } from "lucide-react";
import { NavigationBar } from "./ui/navigation-bar";
import { useSelectedScope } from "../contexts/SelectedScopeContext";

const getNavItems = (role, currentPage) => {
  const items = [];

  // Navigation items per role
  if (role === "User") {
    items.push({
      icon: BarChart3,
      label: "My Dashboard",
      page: "dashboard",
      active: currentPage === "dashboard",
    });
    items.push({
      icon: Calendar,
      label: "Change Event",
      page: "events",
      active: currentPage === "events",
    });
  } else if (role === "Admin") {
    items.push({
      icon: Users,
      label: "Team Dashboard",
      page: "admin-dashboard",
      active: currentPage === "admin-dashboard",
    });
    items.push({
      icon: BarChart3,
      label: "My Dashboard",
      page: "dashboard",
      active: currentPage === "dashboard",
    });
    items.push({
      icon: Calendar,
      label: "Change Event",
      page: "events",
      active: currentPage === "events",
    });
  } else if (role === "Event Organiser") {
    items.push({
      icon: Building2,
      label: "Organiser Dashboard",
      page: "event-organiser-dashboard",
      active: currentPage === "event-organiser-dashboard",
    });
  } else if (role === "Event Admin") {
    items.push({
      icon: Building2,
      label: "Event Dashboard",
      page: "event-admin-dashboard",
      active: currentPage === "event-admin-dashboard",
    });
    items.push({
      icon: Calendar,
      label: "Change Event",
      page: "events",
      active: currentPage === "events",
    });
  }

  // Super Admin sees system overview
  if (role === "Super Admin") {
    items.push({
      icon: Users,
      label: "System Dashboard",
      page: "super-admin-dashboard",
      active: currentPage === "super-admin-dashboard",
    });
  }

  return items;
};

interface NavigationProps {
  user: {
    name?: string;
    email?: string;
    company?: string;
    role?: string;
  };
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  hideMyDashboard?: boolean;
}

export function Navigation({ user, currentPage, onNavigate, onLogout, hideMyDashboard = false }: NavigationProps) {
  const { selectedEvent, selectedOrganiser, selectedCompany, selectedUser } = useSelectedScope();
  const navItems = getNavItems(user?.role, currentPage);
  
  // Filter out "My Dashboard" if hideMyDashboard is true OR if user role is not "User"
  const filteredNavItems = (hideMyDashboard || user?.role !== "User")
    ? navItems.filter(item => item.label !== "My Dashboard")
    : navItems;

  return (
    <NavigationBar
      user={user}
      navItems={filteredNavItems}
      onNavigate={onNavigate}
      onLogout={onLogout}
      selectedEvent={selectedEvent}
      selectedOrganiser={selectedOrganiser}
      selectedCompany={selectedCompany}
      selectedUser={selectedUser}
    />
  );
}
