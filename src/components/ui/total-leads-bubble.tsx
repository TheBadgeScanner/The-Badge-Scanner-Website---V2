// File: components/ui/total-leads-bubble.tsx
import { Users, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { AnimatedCounter } from "./animated-counter";

interface TotalLeadsBubbleProps {
  totalLeads: number;
  onClick?: () => void;
  dataStep?: string;
  helpText?: string;
  subtitle?: string;
}

export function TotalLeadsBubble({ 
  totalLeads, 
  onClick, 
  dataStep,
  helpText = "Total number of leads captured by you for this event",
  subtitle = "Captured this event"
}: TotalLeadsBubbleProps) {
  return (
    <Card 
      className="bg-blue-50 border-blue-200 border cursor-pointer hover:shadow-md transition-shadow" 
      data-step={dataStep}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Total Leads</CardTitle>
        <Users className="h-12 w-12 text-blue-600" />
      </CardHeader>
      <CardContent className="relative">
        <div className="mb-4">
          <AnimatedCounter value={totalLeads} color="#1d4ed8" />
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
