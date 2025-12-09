// File: components/ui/sales-intel-score-bubble.tsx
import { Target, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { AnimatedCounter } from "./animated-counter";

interface SalesIntelScoreBubbleProps {
  score: number;
  dataStep?: string;
  subtitle?: string;
  helpText?: string;
  onClick?: () => void;
}

export function SalesIntelScoreBubble({ 
  score, 
  dataStep,
  subtitle = "Average quality score",
  helpText = "AI-generated score (1-10) rating information capture quality",
  onClick
}: SalesIntelScoreBubbleProps) {
  return (
    <Card 
      className={`bg-red-50 border-red-200 border ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      data-step={dataStep}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Sales Intel Score</CardTitle>
        <Target className="h-12 w-12 text-red-600" />
      </CardHeader>
      <CardContent className="relative">
        <div className="mb-2">
          <AnimatedCounter value={score} decimals={1} color="#dc2626" />
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
