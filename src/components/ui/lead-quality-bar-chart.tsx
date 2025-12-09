// File: components/ui/lead-quality-bar-chart.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { StackedBarChart } from "./stacked-bar-chart";
import {
  Tooltip as Tooltip2,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { HelpCircle } from "lucide-react";

interface LeadQualityBarChartProps {
  title?: string;
  description?: string;
  data: Array<{ name: string; value: number; color: string }>;
  onSegmentClick: (segment: string) => void;
}

export function LeadQualityBarChart({
  title = "Lead Quality",
  description = "Distribution of lead types captured (click to filter)",
  data,
  onSegmentClick,
}: LeadQualityBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="font-medium">{title}</CardTitle>
          <Tooltip2>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
          </Tooltip2>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64 flex items-center justify-center px-4 mt-10">
          <div className="w-full">
            <StackedBarChart
              data={data}
              onSegmentClick={onSegmentClick}
              height={50}
              className="text-[10px] text-[10px] text-[10px] text-[11px] text-center"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
