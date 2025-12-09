// File: components/ui/navigation-bar.tsx
import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./dropdown-menu";
import { ChevronDown, Settings, HelpCircle, LogOut } from "lucide-react";

const roleColors = {
  "User": "bg-blue-100 text-blue-800",
  "Admin": "bg-purple-100 text-purple-800", 
  "Event Admin": "bg-green-100 text-green-800",
  "Event Organiser": "bg-orange-100 text-orange-800",
  "Super Admin": "bg-red-100 text-red-800"
};

interface NavigationBarProps {
  user: {
    name?: string;
    email?: string;
    company?: string;
    role?: string;
  };
  navItems: Array<{
    icon: React.ComponentType<any>;
    label: string;
    page: string;
    active: boolean;
  }>;
  onNavigate: (page: string, payload?: any) => void;
  onLogout: () => void;
}

export function NavigationBar({ user, navItems, onNavigate, onLogout, selectedEvent, selectedOrganiser, selectedCompany, selectedUser }: NavigationBarProps & { selectedEvent?: any; selectedOrganiser?: any; selectedCompany?: any; selectedUser?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    // Forward current selection context with every navigation click
    onNavigate && onNavigate(page, { event: selectedEvent, organiser: selectedOrganiser, company: selectedCompany, user: selectedUser });
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TBS</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Badge Scanner</h1>
              <p className="text-xs text-muted-foreground">Lead Capture System</p>
            </div>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.page}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.page)}
                className="flex items-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Badge 
              variant="secondary"
              className={roleColors[user?.role] || "bg-gray-100 text-gray-800"}
            >
              {user?.role}
            </Badge>
            
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block">{user?.name || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{user?.company}</p>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Mobile Navigation Items */}
                <div className="md:hidden">
                  {navItems.map((item) => (
                    <DropdownMenuItem
                      key={item.page}
                      onClick={() => handleNavigation(item.page)}
                      className="flex items-center space-x-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </div>
                
                {user?.role === "Super Admin" && (
                  <DropdownMenuItem onClick={() => handleNavigation("knowledge-base")}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onClick={() => handleNavigation("settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
