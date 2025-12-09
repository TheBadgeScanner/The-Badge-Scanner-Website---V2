// File: components/ui/license-usage-bubble.tsx
import { TrendingUp, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { AnimatedCounter } from "./animated-counter";

interface LicenseUsageBubbleProps {
  activeUsers: number;
  totalUsers: number;
  dataStep?: string;
  subtitle?: string;
  helpText?: string;
  isClickable?: boolean;
  hasHoverEffect?: boolean;
  onClick?: () => void;
}

export function LicenseUsageBubble({ 
  activeUsers, 
  totalUsers, 
  dataStep,
  subtitle = "Active team members",
  helpText = "Active users vs total assigned licenses",
  isClickable = true,
  hasHoverEffect = true,
  onClick
}: LicenseUsageBubbleProps) {
  const getCardClassName = () => {
    let baseClasses = "bg-green-50 border-green-200 border";
    
    if (isClickable) {
      baseClasses += " cursor-pointer";
    }
    
    if (hasHoverEffect) {
      baseClasses += " hover:shadow-md transition-shadow";
    }
    
    return baseClasses;
  };

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  // Determine font size based on totalUsers value
  const fontSize = totalUsers > 1000 ? "text-4xl" : "text-6xl";
  const slashSize = totalUsers > 1000 ? "text-4xl" : "text-6xl";

  return (
    <Card 
      className={getCardClassName()}
      data-step={dataStep === "user-licenses-card" ? undefined : dataStep}
      id={dataStep === "user-licenses-card" ? "user-licenses-card" : undefined}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">User Licenses</CardTitle>
        <TrendingUp className="h-12 w-12 text-green-600" />
      </CardHeader>
      <CardContent className="relative">
        <div className="mb-4 flex items-baseline">
          <AnimatedCounter value={activeUsers} color="#15803d" fontSize={fontSize} />
          <span className={`font-black ${slashSize} italic text-muted-foreground ml-1`}>/</span>
          <AnimatedCounter value={totalUsers} color="#15803d" fontSize={fontSize} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{helpText}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
