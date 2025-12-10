// File: components/Breadcrumbs.tsx
import React from "react";

export function Breadcrumbs({ user, selectedOrganiser, selectedEvent, selectedCompany, selectedUser, onNavigate, currentPage }) {
  const handleSystemDashboardClick = () => {
    onNavigate && onNavigate("super-admin-dashboard");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleOrganiserClick = () => {
    if (!selectedOrganiser) return;
    onNavigate && onNavigate("events", { organiser: selectedOrganiser });
  };

  const handleEventsClick = () => {
    // Navigate to EventSelectionPage for User/Admin roles
    onNavigate && onNavigate("events", { organiser: selectedOrganiser });
  };

  const handleEventClick = () => {
    if (!selectedEvent) return;
    // For User/Admin, navigate to EventSelectionPage
    if (user?.role === "User" || user?.role === "Admin") {
      onNavigate && onNavigate("events", { organiser: selectedOrganiser, company: selectedCompany });
    } else {
      // For higher roles, navigate to dashboard with event
      onNavigate && onNavigate("dashboard", { event: selectedEvent });
    }
  };

  const handleCompanyClick = () => {
    if (!selectedCompany) return;
    // If current user is a Admin, take them back to the Team Dashboard for this company
    if (user?.role === "Admin") {
      onNavigate && onNavigate("admin-dashboard", { company: selectedCompany, event: selectedEvent });
      return;
    }

    onNavigate && onNavigate("organiser-company-management", { company: selectedCompany });
  };

  const handleUserClick = () => {
    if (!selectedUser) return;
    onNavigate && onNavigate("settings", { user: selectedUser });
  };

  // =============================================
  // Super Admin breadcrumbs
  // System Dashboard > Organiser > Event > Company > User
  // Progressively builds based on available data
  // =============================================
  if (user?.role === "Super Admin") {
    type Crumb = { label: string; onClick?: () => void };
    const crumbs: Crumb[] = [];

    const organiserLabel = selectedOrganiser?.name || "{EventOrganiserName}";
    const eventLabel = selectedEvent?.name || "{EventName}";
    const companyLabel = selectedCompany?.name || "{CompanyName}";
    const userLabel = selectedUser?.firstName && selectedUser?.lastName
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : selectedUser?.name || selectedUser || "{Firstname Lastname}";

    // Always show System Dashboard
    crumbs.push({ label: "System Dashboard", onClick: handleSystemDashboardClick });

    // Add organiser if present (EventOrganiserDashboard and deeper)
    if (selectedOrganiser) {
      crumbs.push({
        label: organiserLabel,
        onClick: () => {
          onNavigate?.("event-organiser-dashboard", { organiser: selectedOrganiser });
          setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
        },
      });
    }

    // Add event if present (EventAdminDashboard and deeper)
    if (selectedEvent) {
      crumbs.push({
        label: eventLabel,
        onClick: () => onNavigate?.("event-admin-dashboard", { event: selectedEvent, organiser: selectedOrganiser }),
      });
    }

    // Add company if present (AdminDashboard and deeper)
    if (selectedCompany) {
      crumbs.push({
        label: companyLabel,
        onClick: () => onNavigate?.("admin-dashboard", { event: selectedEvent, organiser: selectedOrganiser, company: selectedCompany }),
      });
    }

    // Add user if present (LeadDashboard only)
    if (selectedUser) {
      crumbs.push({
        label: userLabel,
        onClick: undefined, // Last item (current page) is not clickable
      });
    }

    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-page-background  pointer-events-auto ">
        <div className="container mx-auto px-6 py-2">
          <nav className="text-sm text-muted-foreground flex items-center space-x-2">
            {crumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                {crumb.onClick ? (
                  <button onClick={crumb.onClick} className="hover:underline text-primary">{crumb.label}</button>
                ) : (
                  <span className="text-muted-foreground">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // =============================================
  // Event Organiser breadcrumbs
  // Organiser Dashboard > Event > Company > User
  // =============================================
  if (user?.role === "Event Organiser") {
    type Crumb = { label: string; onClick?: () => void };
    const crumbs: Crumb[] = [];

    const organiserLabel = selectedOrganiser?.name || "{EventOrganiser}";
    const eventLabel = selectedEvent?.name || "{EventName}";
    const companyLabel = selectedCompany?.name || "{CompanyName}";
    const userLabel = selectedUser?.firstName && selectedUser?.lastName
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : selectedUser?.name || selectedUser || "{Firstname Lastname}";

    // If not viewing event/company/user, show dashboard label
    if (!selectedEvent && !selectedCompany && !selectedUser) {
      crumbs.push({
        label: "Organiser Dashboard",
        onClick: () => onNavigate?.("event-organiser-dashboard")
      });
    } else {
      // Otherwise, show organiser name as root
      crumbs.push({
        label: organiserLabel,
        onClick: () => onNavigate?.("event-organiser-dashboard", { organiser: selectedOrganiser })
      });
    }

    // Add event if present
    if (selectedEvent) {
      crumbs.push({
        label: eventLabel,
        onClick: () => onNavigate?.("event-admin-dashboard", { event: selectedEvent }),
      });
    }

    // Always show company if viewing a user and company is available
    if (selectedUser && selectedCompany) {
      crumbs.push({
        label: companyLabel,
        onClick: () => onNavigate?.("admin-dashboard", { event: selectedEvent, company: selectedCompany }),
      });
    } else if (selectedCompany) {
      crumbs.push({
        label: companyLabel,
        onClick: () => onNavigate?.("admin-dashboard", { event: selectedEvent, company: selectedCompany }),
      });
    }

    // Add user if present
    if (selectedUser) {
      crumbs.push({
        label: userLabel,
        onClick: undefined, // Last item (current page) is not clickable
      });
    }

    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-page-background  pointer-events-auto ">
        <div className="container mx-auto px-6 py-2">
          <nav className="text-sm text-muted-foreground flex items-center space-x-2">
            {crumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                {crumb.onClick ? (
                  <button onClick={crumb.onClick} className="hover:underline text-primary">{crumb.label}</button>
                ) : (
                  <span className="text-muted-foreground">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // =============================================
  // Event Admin breadcrumbs
  // {EventOrganiser} / {EventName} / {CompanyName} / {UserName}
  // EventOrganiser is NOT clickable (no access to that level)
  // =============================================
  if (user?.role === "Event Admin") {
    type Crumb = { label: string; onClick?: () => void };
    const crumbs: Crumb[] = [];

    const organiserLabel = selectedOrganiser?.name || "{EventOrganiser}";
    const eventLabel = selectedEvent?.name || "{EventName}";
    const companyLabel = selectedCompany?.name || "{CompanyName}";
    const userLabel = selectedUser?.firstName && selectedUser?.lastName
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : selectedUser?.name || selectedUser || "{Firstname Lastname}";

    // Always show organiser name (not clickable)
    crumbs.push({
      label: organiserLabel,
      onClick: undefined
    });

    // Always show event name (clickable to go back to event dashboard)
    crumbs.push({
      label: eventLabel,
      onClick: () => onNavigate?.("event-admin-dashboard", { event: selectedEvent, organiser: selectedOrganiser })
    });

    // Add company if present
    if (selectedCompany) {
      crumbs.push({
        label: companyLabel,
        onClick: () => onNavigate?.("admin-dashboard", { event: selectedEvent, organiser: selectedOrganiser, company: selectedCompany }),
      });
    }

    // Add user if present
    if (selectedUser) {
      crumbs.push({
        label: userLabel,
        onClick: undefined, // Last item (current page) is not clickable
      });
    }

    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-page-background  pointer-events-auto ">
        <div className="container mx-auto px-6 py-2">
          <nav className="text-sm text-muted-foreground flex items-center space-x-2">
            {crumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                {crumb.onClick ? (
                  <button onClick={crumb.onClick} className="hover:underline text-primary">{crumb.label}</button>
                ) : (
                  <span className="text-muted-foreground">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // If we're explicitly on the events selection screen, always show `Events /`
  if (currentPage === "events" && (user?.role === "User" || user?.role === "Admin")) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-page-background  pointer-events-auto ">
        <div className="container mx-auto px-6 py-2">
          <nav className="text-sm text-muted-foreground flex items-center space-x-2">
            <span className="hover:underline text-primary">Events</span>
            <span>/</span>
          </nav>
        </div>
      </div>
    );
  }

  // =====================================================
  // User: Events / {EventName} / {CompanyName} / {Firstname Lastname}
  // {Events} and {EventName} are clickable
  // =====================================================
  if (user?.role === "User") {
    const eventLabel = selectedEvent?.name || "{EventName}";
    const companyLabel = selectedCompany?.name || "{CompanyName}";
    const userLabel = selectedUser?.name || "{Firstname Lastname}";

    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-page-background pointer-events-auto">
        <div className="container mx-auto px-6 py-2">
          <nav className="text-sm text-muted-foreground flex items-center space-x-2">
            <button onClick={handleEventsClick} className="hover:underline text-primary">
              Events
            </button>
            <span>/</span>
            {selectedEvent ? (
              <button onClick={handleEventClick} className="hover:underline text-primary">
                {eventLabel}
              </button>
            ) : (
              <span className="text-muted-foreground">{eventLabel}</span>
            )}
            <span>/</span>
            <span className="text-muted-foreground">{companyLabel}</span>
            <span>/</span>
            <span className="text-muted-foreground">{userLabel}</span>
          </nav>
        </div>
      </div>
    );
  }

  // =====================================================
  // Admin: Events / {EventName} / {CompanyName} / {UserName}
  // {Events} and {EventName} are clickable
  // =====================================================
  if (user?.role === "Admin") {
    const eventLabel = selectedEvent?.name || "{EventName}";
    const companyLabel = selectedCompany?.name || "{CompanyName}";
    const userLabel = selectedUser?.firstName && selectedUser?.lastName
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : selectedUser?.name || selectedUser || "{Firstname Lastname}";

    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-page-background pointer-events-auto">
        <div className="container mx-auto px-6 py-2">
          <nav className="text-sm text-muted-foreground flex items-center space-x-2">
            <button onClick={handleEventsClick} className="hover:underline text-primary">
              Events
            </button>
            <span>/</span>
            {selectedEvent ? (
              <button onClick={handleEventClick} className="hover:underline text-primary">
                {eventLabel}
              </button>
            ) : (
              <span className="text-muted-foreground">{eventLabel}</span>
            )}
            <span>/</span>
            <span className="text-muted-foreground">{companyLabel}</span>
            {selectedUser && (
              <>
                <span>/</span>
                <span className="text-muted-foreground">{userLabel}</span>
              </>
            )}
          </nav>
        </div>
      </div>
    );
  }

  // =====================================================
  // HIGHER ROLES (Event Organiser, Advanced, Super Admin)
  // Dashboard / Organiser / Events / Event / Company / User
  // =====================================================
  if (!selectedOrganiser && !selectedEvent && !selectedCompany && !selectedUser) {
    // If we're on the Events page, show `Events /` instead of Home
    if (currentPage === "events") {
      return (
        <div className="fixed top-16 left-0 right-0 z-40 bg-page-background  pointer-events-auto ">
          <div className="container mx-auto px-6 py-2">
            <nav className="text-sm text-muted-foreground flex items-center space-x-2">
              <span className="hover:underline text-primary">Events</span>
              <span>/</span>
            </nav>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-page-background  pointer-events-auto ">
        <div className="container mx-auto px-6 py-2">
          <nav className="text-sm text-muted-foreground flex items-center space-x-2">
            <span className="text-muted-foreground">System Dashboard</span>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-page-background  pointer-events-auto ">
      <div className="container mx-auto px-6 py-2">
        <nav className="text-sm text-muted-foreground flex items-center space-x-2">
        <span className="hover:underline text-primary cursor-pointer" onClick={handleSystemDashboardClick}>System Dashboard</span>
        {(selectedOrganiser || selectedEvent || selectedCompany || selectedUser) && <span>/</span>}

        {selectedOrganiser && (
          <>
            <button onClick={handleOrganiserClick} className="hover:underline">{selectedOrganiser.name}</button>
            {(selectedEvent || selectedCompany || selectedUser) && <span>/</span>}
          </>
        )}

        {selectedEvent && (
          <>
            <button onClick={handleEventClick} className="hover:underline">{selectedEvent.name}</button>
            {(selectedCompany || selectedUser) && <span>/</span>}
          </>
        )}

        {selectedCompany && (
          <>
            <button onClick={handleCompanyClick} className="hover:underline">{selectedCompany.name || selectedCompany}</button>
            {selectedUser && <span>/</span>}
          </>
        )}

        {selectedUser && (
          <button onClick={handleUserClick} className="hover:underline">{selectedUser.name || selectedUser}</button>
        )}
      </nav>
      </div>
    </div>
  );
}
