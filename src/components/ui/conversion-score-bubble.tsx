// File: components/ui/conversion-score-bubble.tsx
import { Award, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { AnimatedCounter } from "./animated-counter";

interface ConversionScoreBubbleProps {
  score: number;
  dataStep?: string;
  subtitle?: string;
  helpText?: string;
  onClick?: () => void;
  title?: string;
}

export function ConversionScoreBubble({ 
  score, 
  dataStep,
  subtitle = "Event-wide average",
  helpText = "AI-generated average score (1-10) rating prospect interest level across all companies",
  onClick,
  title = "Conversion Score"
}: ConversionScoreBubbleProps) {
  return (
    <Card 
      className={`bg-orange-50 border-orange-200 border ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      data-step={dataStep}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Award className="h-12 w-12 text-orange-600" />
      </CardHeader>
      <CardContent className="relative">
        <div className="mb-2">
          <AnimatedCounter value={score} decimals={1} color="#ea580c" />
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
