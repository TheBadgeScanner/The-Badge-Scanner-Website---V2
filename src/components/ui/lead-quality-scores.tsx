// File: components/ui/lead-quality-scores.tsx
import { Thermometer, Target, AlertCircle } from "lucide-react";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card";
import {
  getScoreBadgeColor,
  getPriorityBadgeColor,
  getScoreCardBackground,
  getConversionCardBackground,
  getPriorityCardBackground,
  getScoreIconColor,
  getPriorityIconColor,
} from "../utils/dashboardHelpers";

export function LeadQualityScores({ lead }) {
  return (
    <div className="space-y-4">

      {/* THE BELOW ELEMENT IS HIDDEN */}
      {false && (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Lead Quality & Scores OLD
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          {/*Sales Intel */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2 min-h-[40px]">
              <Thermometer className="h-10 w-10 text-muted-foreground" />

              <span className="text-sm font-medium text-center">
                Sales Intel Score
              </span>
            </div>
            <Badge
              className={getScoreBadgeColor(
                lead.salesIntelScore,
              )}
            >
              {lead.salesIntelScore
                ? `${lead.salesIntelScore}/10`
                : "Pending/10"}
            </Badge>
          </div>

          {/* Conversion */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2 min-h-[40px]">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-center">
                Conversion Score
              </span>
            </div>
            <Badge
              className={getScoreBadgeColor(
                lead.conversionScore,
              )}
            >
              {lead.conversionScore
                ? `${lead.conversionScore}/10`
                : "Pending/10"}
            </Badge>
          </div>

          {/* Priority */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2 min-h-[40px]">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-center whitespace-nowrap">
                Priority
              </span>
            </div>
            <Badge
              className={getPriorityBadgeColor(lead.priority)}
            >
              {lead.priority}
            </Badge>
          </div>
        </div>
      </div>
      )}
      {/* THE ABOVE ELEMENT IS HIDDEN */}
      

      <div id="testLQS" className="space-y-4">
        <h3 className="text-lg font-medium">
          Lead Quality & Scores
        </h3>

        <div className="grid gap-4 md:grid-cols-3 items-start pb-0">
          {/* Sales Intel */}
          <Card
            className={`border ${getScoreCardBackground(lead.salesIntelScore)}`}
          >
            <CardHeader className="flex flex-col items-center text-center gap-1 px-3 pt-2 pb-0">
              <Thermometer
                className={`h-10 w-10 pt-1 ${getScoreIconColor(lead.salesIntelScore)}`}
              />
              {/* Reserve space for up to 2 lines */}
              <div className="  flex items-center">
                <CardTitle className="text-sm font-medium leading-snug">
                  Sales Intel Score
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-2 pt-0 text-center">
              <div className="text-2xl font-bold">
                {lead.salesIntelScore
                  ? `${lead.salesIntelScore}/10`
                  : "Pending"}
              </div>
              <p className="text-xs pt-1 text-muted-foreground">
                AI-generated quality rating
              </p>
            </CardContent>
          </Card>

          {/* Conversion */}
          <Card
            className={`border ${getScoreCardBackground(lead.conversionScore)}`}
          >
            <CardHeader className="flex flex-col items-center text-center gap-1 px-3 pt-2 pb-0">
              <Target className={`h-10 w-10 pt-1 ${getScoreIconColor(lead.conversionScore)}`} />
              <div className="  flex items-center">
                <CardTitle className="text-sm font-medium leading-snug">
                  Conversion Score
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-2 pt-0 text-center">
              <div className="text-2xl font-bold">
                {lead.conversionScore
                  ? `${lead.conversionScore}/10`
                  : "Pending"}
              </div>
              <p className="text-xs pt-1 text-muted-foreground">
                Interest level assessment
              </p>
            </CardContent>
          </Card>

          {/* Priority */}
          <Card
            className={`border ${getPriorityCardBackground(lead.priority)}`}
          >
            <CardHeader className="flex flex-col items-center text-center gap-1 px-3 pt-2 pb-0">
              <AlertCircle
                className={`h-10 w-10 pt-1 ${getPriorityIconColor(lead.priority)}`}
              />
              <div className="  flex items-center">
                <CardTitle className="text-sm font-medium leading-snug whitespace-nowrap">
                  Priority
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-2 pt-0 text-center">
              <div className="text-2xl font-bold">
                {lead.priority || "Not Set"}
              </div>
              <p className="text-xs pt-1 text-muted-foreground">
                Lead priority<br/> level
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
