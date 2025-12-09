// File: App.tsx
import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { EventSelectionPage } from "./components/EventSelectionPage";
import { LeadDashboard } from "./components/LeadDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { EventAdminDashboard } from "./components/EventAdminDashboard";
import { EventOrganiserDashboard } from "./components/EventOrganiserDashboard";
import { SuperAdminDashboard } from "./components/SuperAdminDashboard";
// import { OrganiserCompanyManagement } from "./components/OrganiserCompanyManagement";
import { KnowledgeBasePage } from "./components/KnowledgeBasePage";
import { SettingsPage } from "./components/SettingsPage";
import { GuidedTour } from "./components/GuidedTour";
import { createUniversalScrollHandler } from "./components/utils/scrollUtils";
import { SelectedScopeProvider, useSelectedScope } from "./contexts/SelectedScopeContext";

// Enhanced mock user data with all role types
const mockUsers = {
  "User": {
    id: 1,
    name: "John Doe",
    email: "user@company.com",
    role: "User",
    company: "TechCorp Solutions",
    isActivated: true
  },
  "Admin": {
    id: 2,
    name: "Jane Smith", 
    email: "admin@company.com",
    role: "Admin",
    company: "TechCorp Solutions",
    isActivated: true
  },
  "Event Admin": {
    id: 3,
    name: "Steven Stevenson",
    email: "eventadmin@events.com",
    role: "Event Admin",
    company: "Event Management Co",
    isActivated: true
  },
  "Event Organiser": {
    id: 4,
    name: "Sarah Chen",
    email: "eventadmin@events.com",
    role: "Event Organiser",
    company: "Event Management Co",
    isActivated: true
  },
  "Super Admin": {
    id: 5,
    name: "David Rodriguez",
    email: "superadmin@system.com",
    role: "Super Admin",
    company: "Badge Scanner Systems",
    isActivated: true
  }
};

// Mock company data for User/Admin
const mockCompany = {
  id: 1,
  name: "TechCorp Solutions"
};

// Mock next upcoming event - default event with full lead data
const mockUpcomingEvent = {
  id: 1,
  name: "Tech Conference 2025",
  description: "The premier technology conference featuring the latest innovations in AI, cloud computing, and digital transformation.",
  date: "January 22-24, 2025",
  location: "Las Vegas Convention Center",
  exhibitorCount: 450,
  visitorCount: 12000,
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"
};

export default function App() {
  return (
    <SelectedScopeProvider>
      <AppInner />
    </SelectedScopeProvider>
  );
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState("login");
  const [user, setUser] = useState(null);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [dashboardFilters, setDashboardFilters] = useState({});
  const [tourActiveTab, setTourActiveTab] = useState(null);

  const {
    selectedEvent,
    setSelectedEvent,
    selectedOrganiser,
    setSelectedOrganiser,
    selectedCompany,
    setSelectedCompany,
    selectedUser,
    setSelectedUser,
  } = useSelectedScope();

  // Create universal scroll-to-top handlers for different dashboard pages
  const universalScrollToTop = createUniversalScrollHandler('Universal');
  const leadDashboardScrollToTop = createUniversalScrollHandler('LeadDashboard');
  const adminDashboardScrollToTop = createUniversalScrollHandler('AdminDashboard');
  const eventAdminScrollToTop = createUniversalScrollHandler('EventAdminDashboard');
  const eventOrganiserScrollToTop = createUniversalScrollHandler('EventOrganiserDashboard');
  const superAdminScrollToTop = createUniversalScrollHandler('SuperAdminDashboard');

  const handleLogin = (loginData) => {
    // Determine user role based on email
    let selected = mockUsers["User"]; // default

    if (loginData.email.includes("superadmin")) {
      selected = mockUsers["Super Admin"];
    } else if (loginData.email.includes("organiser")) {
      selected = mockUsers["Event Organiser"];
    } else if (loginData.email.includes("event")) {
      selected = mockUsers["Event Admin"];
    } else if (loginData.email.includes("admin")) {
      selected = mockUsers["Admin"];
    }

    setUser(selected);
    
    // Clear all selections on login, then set role-appropriate defaults
    setSelectedUser(null);
    setSelectedEvent(null);
    setSelectedCompany(null);
    setSelectedOrganiser(null);
    
    // Set role-specific defaults
    if (selected.role === "User" || selected.role === "Admin") {
      // User and Admin roles get a default event and company
      setSelectedUser(selected);
      setSelectedEvent(mockUpcomingEvent);
      setSelectedCompany(mockCompany);
    } else if (selected.role === "Event Organiser" || selected.role === "Event Admin") {
      // Event roles get a default event
      setSelectedEvent(mockUpcomingEvent);
    }
    // Super Admin gets no defaults - they start with empty selections
    
    // Go directly to dashboard with default event
    const dashboardPage = getDashboardPageForRole(selected.role);
    setCurrentPage(dashboardPage);
    
    // Show guided tour for User and Admin reaching dashboard
    if (selected.role === "User" || selected.role === "Admin") {
      setShowGuidedTour(true);
    }
  };

  const getDashboardPageForRole = (role) => {
    switch (role) {
      case "Super Admin": return "super-admin-dashboard";
      case "Event Organiser": return "event-organiser-dashboard";
      case "Event Admin": return "event-admin-dashboard";
      case "Admin": return "admin-dashboard";
      default: return "dashboard";
    }
  };

  const handleGuidedTourComplete = () => {
    setShowGuidedTour(false);
    setTourActiveTab(null);
  };

  const handleGuidedTourSkip = () => {
    setShowGuidedTour(false);
    setTourActiveTab(null);
  };

  const handleTourTabChange = (tab) => {
    setTourActiveTab(tab);
  };

  const handleTourScrollToTop = () => {
    // Use the universal scroll function for tour completion
    universalScrollToTop();
  };

  const handleStartTour = () => {
    setShowGuidedTour(true);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedEvent(null);
    setCurrentPage("login");
    setShowGuidedTour(false);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    
    // Navigate to the appropriate dashboard depending on user role
    let pageToNavigate = "dashboard"; // default for User

    const role = user?.role;

    if (!role || role === "User") {
      pageToNavigate = "dashboard";
    } else if (role === "Admin") {
      pageToNavigate = "admin-dashboard";
    } else if (role === "Event Admin" || role === "Event Organiser") {
      pageToNavigate = "event-organiser-dashboard";
    } else if (role === "Super Admin") {
      pageToNavigate = "super-admin-dashboard";
    }

    setCurrentPage(pageToNavigate);
  };

  // Unified navigation helper. `payload` may include { event, organiser, filters }
  // Backwards-compatible: some callers pass a single entity as the second arg.
  const handleNavigation = (page, payload = {}, filters = undefined) => {
    // Normalize legacy payloads where a single object was passed as second arg
    let navPayload = payload || {};

    // If caller passed (page, entity, filters) in old style, adopt that filters
    if (filters !== undefined) {
      navPayload = navPayload || {};
      navPayload.filters = filters;
    }

    // If payload is an entity (no explicit keys), attempt to interpret it
    if (navPayload && typeof navPayload === "object" && !('event' in navPayload) && !('organiser' in navPayload) && !('filters' in navPayload)) {
      // Legacy callers used onNavigate('events', organiser) or onNavigate('dashboard', event)
      if (page === 'events') {
        navPayload = { organiser: payload };
      } else if (page === 'dashboard') {
        navPayload = { event: payload };
      } else {
        // best-effort: treat as event
        navPayload = { event: payload };
      }
    }

    // Apply the payload updates FIRST, then clear what shouldn't persist
    if (navPayload.event !== undefined) {
      setSelectedEvent(navPayload.event);
    }

    if (navPayload.organiser !== undefined) {
      setSelectedOrganiser(navPayload.organiser);
    }

    if (navPayload.company !== undefined) {
      setSelectedCompany(navPayload.company);
    }

    if (navPayload.user !== undefined) {
      setSelectedUser(navPayload.user);
    }

    if (navPayload.filters && Object.keys(navPayload.filters).length > 0) {
      setDashboardFilters(navPayload.filters);
    } else if (navPayload.filters === undefined) {
      setDashboardFilters({});
    }

    // THEN reset selections based on page being navigated to
    // This ensures we clear deeper selections while keeping what was passed in payload
    if (page === 'super-admin-dashboard') {
      // When returning to Super Admin Dashboard, only keep organiser if it was in payload
      if (!navPayload.organiser) {
        setSelectedOrganiser(null);
      }
      setSelectedEvent(null);
      setSelectedCompany(null);
      setSelectedUser(null);
    } else if (page === 'event-organiser-dashboard') {
      // When going to Event Organiser Dashboard, clear event/company/user but keep organiser
      setSelectedEvent(null);
      setSelectedCompany(null);
      setSelectedUser(null);
    } else if (page === 'event-admin-dashboard') {
      // When going to Event Admin Dashboard, clear company/user but keep organiser/event
      setSelectedCompany(null);
      setSelectedUser(null);
    } else if (page === 'admin-dashboard') {
      // When going to Admin Dashboard, clear user but keep organiser/event/company
      setSelectedUser(null);
    }
    // lead-dashboard (dashboard) keeps all selections

    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} />;
      
      case "events":
        return (
          <EventSelectionPage 
            user={user}
            onEventSelect={handleEventSelect}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      
      case "dashboard":
        return (
          <>
            <LeadDashboard 
              user={user}
              selectedEvent={selectedEvent}
              selectedOrganiser={selectedOrganiser}
              selectedCompany={selectedCompany}
              selectedUser={selectedUser}
              onLogout={handleLogout}
              onNavigate={handleNavigation}
              onStartTour={handleStartTour}
              onScrollToTop={leadDashboardScrollToTop}
            />
            {showGuidedTour && (
              <GuidedTour 
                onComplete={handleGuidedTourComplete}
                onSkip={handleGuidedTourSkip}
                userRole={user?.role}
                onTourTabChange={handleTourTabChange}
                onTourScrollToTop={handleTourScrollToTop}
              />
            )}
          </>
        );
      
      case "admin-dashboard":
        return (
          <>
            <AdminDashboard 
              user={user}
              selectedEvent={selectedEvent}
              selectedOrganiser={selectedOrganiser}
              selectedCompany={selectedCompany}
              selectedUser={selectedUser}
              onLogout={handleLogout}
              onNavigate={handleNavigation}
              initialFilters={dashboardFilters}
              onStartTour={handleStartTour}
              tourActiveTab={tourActiveTab}
              onScrollToTop={adminDashboardScrollToTop}
            />
            {showGuidedTour && (
              <GuidedTour 
                onComplete={handleGuidedTourComplete}
                onSkip={handleGuidedTourSkip}
                userRole={user?.role}
                onTourTabChange={handleTourTabChange}
                onTourScrollToTop={handleTourScrollToTop}
              />
            )}
          </>
        );
      
      case "event-admin-dashboard":
        return (
          <EventAdminDashboard 
            user={user}
            selectedEvent={selectedEvent}
            selectedOrganiser={selectedOrganiser}
            selectedCompany={selectedCompany}
            selectedUser={selectedUser}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            onScrollToTop={eventAdminScrollToTop}
          />
        );
      
      case "event-organiser-dashboard":
        return (
          <EventOrganiserDashboard 
            user={user}
            selectedEvent={selectedEvent}
            selectedEventOrganiser={selectedOrganiser}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            onScrollToTop={eventOrganiserScrollToTop}
          />
        );
      
      case "super-admin-dashboard":
        return (
          <SuperAdminDashboard 
            user={user}
            selectedEvent={selectedEvent}
            selectedOrganiser={selectedOrganiser}
            selectedCompany={selectedCompany}
            selectedUser={selectedUser}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            onScrollToTop={superAdminScrollToTop}
          />
        );
      
      // case "organiser-company-management":
      //   return (
      //     <OrganiserCompanyManagement 
      //       user={user}
      //       selectedCompany={dashboardFilters.selectedCompany}
      //       onLogout={handleLogout}
      //       onNavigate={handleNavigation}
      //     />
      //   );

      case "knowledge-base":
        return (
          <KnowledgeBasePage 
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      
      case "settings":
        return (
          <SettingsPage 
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        );
      
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return renderPage();
}