// File: components/ui/leads-by-hour-chart.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Tooltip as Tooltip2,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { HelpCircle } from "lucide-react";

interface LeadsByHourChartProps {
  title?: string;
  description?: string;
  data: Record<string, Array<{ hour: string; leads: number }>>;
  activeChartDay: string;
  onChartDayChange: (day: string) => void;
  onHourClick: (hour: string) => void;
}

export function LeadsByHourChart({
  title = "Leads by Hour",
  description = "When your team is most active (click bars to filter leads)",
  data,
  activeChartDay,
  onChartDayChange,
  onHourClick,
}: LeadsByHourChartProps) {
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
        <Tabs
          value={activeChartDay}
          onValueChange={onChartDayChange}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Jan 22">
              Day 1 (Jan 22)
            </TabsTrigger>
            <TabsTrigger value="Jan 23">
              Day 2 (Jan 23)
            </TabsTrigger>
            <TabsTrigger value="Jan 24">
              Day 3 (Jan 24)
            </TabsTrigger>
          </TabsList>

          {Object.entries(data).map(([day, dayData]) => (
            <TabsContent
              key={day}
              value={day}
              className="space-y-0 mt-4"
            >
              <div className="h-64" style={{ outline: "none" }}>
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  style={{ outline: "none" }}
                >
                  <LineChart
                    data={dayData}
                    margin={{
                      top: 8,
                      right: 12,
                      left: 0,
                      bottom: 4,
                    }}
                    onClick={(chartData) => {
                      if (chartData && chartData.activeLabel) {
                        onHourClick(chartData.activeLabel);
                      }
                    }}
                    style={{
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {/* defs for gradient stroke + glow */}
                    <defs>
                      <linearGradient
                        id={`lineGradient-${day}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#1D4ED8"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3B82F6"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                      <filter
                        id={`glow-${day}`}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur
                          stdDeviation="2.5"
                          result="coloredBlur"
                        />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* modern subtle grid */}
                    <CartesianGrid
                      strokeDasharray="4 6"
                      strokeOpacity={0.25}
                      vertical={false}
                    />

                    {/* axes */}
                    <XAxis
                      dataKey="hour"
                      tickMargin={8}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#6B7280",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      width={28}
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#6B7280",
                        fontSize: 12,
                      }}
                      tickMargin={6}
                    />

                    {/* tooltip */}
                    <Tooltip
                      cursor={{
                        stroke: "rgba(29, 78, 216, 0.4)",
                        strokeWidth: 2,
                      }}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        boxShadow:
                          "0 8px 24px rgba(0,0,0,0.08)",
                      }}
                      labelStyle={{ fontWeight: 600 }}
                      formatter={(v) => [`${v} leads`]}
                    />

                    {/* line */}
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="#1D4ED8"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 7,
                        stroke: "#1D4ED8",
                        strokeWidth: 2,
                        fill: "#1D4ED8",
                        filter: `url(#glow-${day})`,
                        style: { cursor: "pointer" },
                      }}
                      isAnimationActive
                      animationBegin={200}
                      animationDuration={800}
                      animationEasing="ease-out"
                      style={{ cursor: "pointer" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
