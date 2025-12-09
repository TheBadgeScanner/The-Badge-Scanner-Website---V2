// File: components/ui/leader-performance-strip.tsx
import { Trophy, Crown, Medal, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { AnimatedCounter } from "./animated-counter";

// Mock user data for companies to determine star performers
const companyUsers = {
  "TechCorp Solutions": [
    { name: "John Doe", totalLeads: 45, avgSalesIntel: 8.2, overallScore: 8.0 },
    { name: "Jane Smith", totalLeads: 38, avgSalesIntel: 7.8, overallScore: 7.9 }
  ],
  "Innovation Labs": [
    { name: "Mike Wilson", totalLeads: 32, avgSalesIntel: 7.1, overallScore: 6.7 },
    { name: "Sarah Chen", totalLeads: 28, avgSalesIntel: 6.8, overallScore: 6.5 }
  ],
  "StartupX": [
    { name: "Emily Rodriguez", totalLeads: 28, avgSalesIntel: 9.1, overallScore: 8.8 },
    { name: "David Park", totalLeads: 25, avgSalesIntel: 8.9, overallScore: 8.6 }
  ],
  "MegaCorp Ltd": [
    { name: "Jessica Taylor", totalLeads: 55, avgSalesIntel: 6.8, overallScore: 6.1 },
    { name: "Robert Kim", totalLeads: 42, avgSalesIntel: 6.2, overallScore: 5.8 }
  ],
  "Growth Co": [
    { name: "Lisa Rodriguez", totalLeads: 18, avgSalesIntel: 5.2, overallScore: 4.7 },
    { name: "Alex Thompson", totalLeads: 15, avgSalesIntel: 4.8, overallScore: 4.5 }
  ],
  "Digital Solutions": [
    { name: "Rachel Green", totalLeads: 38, avgSalesIntel: 7.8, overallScore: 7.5 },
    { name: "Mark Johnson", totalLeads: 35, avgSalesIntel: 7.6, overallScore: 7.3 }
  ]
};

export function LeaderPerformanceStrip({ companies, compact }: { companies: any[]; compact?: boolean }) {
  // Sort companies and get top 3 for each metric
  const sortedByLeads = [...companies].sort((a, b) => b.totalLeads - a.totalLeads);
  const sortedBySalesIntel = [...companies].sort((a, b) => b.avgSalesIntel - a.avgSalesIntel);
  const sortedByOverall = [...companies].sort((a, b) => b.overallScore - a.overallScore);

  const mostLeads = sortedByLeads[0];
  const qualityLeader = sortedBySalesIntel[0];
  const bestBalance = sortedByOverall[0];

  // Get star performers (top user from each winning company)
  const getStarPerformer = (company, metric) => {
    const users = companyUsers[company.name] || [];
    if (users.length === 0) return company.name;
    
    let topUser;
    switch (metric) {
      case 'leads':
        topUser = users.reduce((prev, current) => (prev.totalLeads > current.totalLeads) ? prev : current);
        break;
      case 'salesIntel':
        topUser = users.reduce((prev, current) => (prev.avgSalesIntel > current.avgSalesIntel) ? prev : current);
        break;
      case 'overall':
        topUser = users.reduce((prev, current) => (prev.overallScore > current.overallScore) ? prev : current);
        break;
      default:
        topUser = users[0];
    }
    return topUser.name;
  };

  const getSecondPlaceCompany = (sortedList) => sortedList[1];
  const getThirdPlaceCompany = (sortedList) => sortedList[2];

  const outerClass = compact ? "w-full" : "w-full bg-muted/50 -mx-6 px-6 py-6";
  const innerContainerClass = compact ? "" : "container mx-auto";

  return (
    <div className={outerClass}>
      <div className={innerContainerClass}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-amber-50 border-amber-200 border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-2xl">Most Leads<br/><br/></CardTitle>
                <CardDescription className="text-lg mt-2">{mostLeads.name}</CardDescription>
              </div>
              <Trophy className="h-16 w-16 text-amber-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="mb-2">
                <AnimatedCounter value={mostLeads.totalLeads} color="#d97706" duration={1500} />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                total leads captured
              </p>
              
              {/* Top performers */}
              <div className="border-t pt-4"></div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-amber-500" />
                    <span className="font-medium">Star Performer</span>
                  </div>
                  <span>{getStarPerformer(mostLeads, 'leads')}</span>
                </div>
                {getSecondPlaceCompany(sortedByLeads) && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>2nd Place</span>
                    <span>{getSecondPlaceCompany(sortedByLeads).name}</span>
                  </div>
                )}
                {getThirdPlaceCompany(sortedByLeads) && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>3rd Place</span>
                    <span>{getThirdPlaceCompany(sortedByLeads).name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200 border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-2xl">Quality Leader</CardTitle>
                <CardDescription className="text-lg mt-2">{qualityLeader.name}</CardDescription>
              </div>
              <Crown className="h-16 w-16 text-purple-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="mb-2">
                <AnimatedCounter value={qualityLeader.avgSalesIntel} decimals={1} color="#9333ea" duration={1500} />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                average sales intel score
              </p>
              
              {/* Top performers */}
              <div className="border-t pt-4"></div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Star Performer</span>
                  </div>
                  <span>{getStarPerformer(qualityLeader, 'salesIntel')}</span>
                </div>
                {getSecondPlaceCompany(sortedBySalesIntel) && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>2nd Place</span>
                    <span>{getSecondPlaceCompany(sortedBySalesIntel).name}</span>
                  </div>
                )}
                {getThirdPlaceCompany(sortedBySalesIntel) && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>3rd Place</span>
                    <span>{getThirdPlaceCompany(sortedBySalesIntel).name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200 border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-2xl">Best Overall Balance</CardTitle>
                <CardDescription className="text-lg mt-2">{bestBalance.name}</CardDescription>
              </div>
              <Medal className="h-16 w-16 text-emerald-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="mb-2">
                <AnimatedCounter value={bestBalance.overallScore} decimals={1} color="#059669" duration={1500} />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                overall performance score
              </p>
              
              {/* Top performers */}
              <div className="border-t pt-4"></div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-emerald-500" />
                    <span className="font-medium">Star Performer</span>
                  </div>
                  <span>{getStarPerformer(bestBalance, 'overall')}</span>
                </div>
                {getSecondPlaceCompany(sortedByOverall) && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>2nd Place</span>
                    <span>{getSecondPlaceCompany(sortedByOverall).name}</span>
                  </div>
                )}
                {getThirdPlaceCompany(sortedByOverall) && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>3rd Place</span>
                    <span>{getThirdPlaceCompany(sortedByOverall).name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
