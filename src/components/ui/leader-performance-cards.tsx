// File: components/ui/leader-performance-cards.tsx
import { Trophy, Crown, Medal, Star, Award } from "lucide-react";
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
  "StartupX Inc": [
    { name: "Emily Rodriguez", totalLeads: 28, avgSalesIntel: 9.1, overallScore: 8.8 },
    { name: "David Park", totalLeads: 25, avgSalesIntel: 8.9, overallScore: 8.6 }
  ],
  "MegaCorp Systems": [
    { name: "Jessica Taylor", totalLeads: 55, avgSalesIntel: 6.8, overallScore: 6.1 },
    { name: "Robert Kim", totalLeads: 42, avgSalesIntel: 6.2, overallScore: 5.8 }
  ],
  "Growth Co Ltd": [
    { name: "Lisa Rodriguez", totalLeads: 18, avgSalesIntel: 5.2, overallScore: 4.7 },
    { name: "Alex Thompson", totalLeads: 15, avgSalesIntel: 4.8, overallScore: 4.5 }
  ],
  "Digital Dynamics": [
    { name: "Rachel Green", totalLeads: 38, avgSalesIntel: 7.8, overallScore: 7.5 },
    { name: "Mark Johnson", totalLeads: 35, avgSalesIntel: 7.6, overallScore: 7.3 }
  ],
  "Innovate Industries": [
    { name: "Michael Chen", totalLeads: 47, avgSalesIntel: 7.2, overallScore: 6.8 }
  ],
  "NextGen Technologies": [
    { name: "Alex Chen", totalLeads: 29, avgSalesIntel: 7.0, overallScore: 6.5 }
  ]
};

export function LeaderPerformanceCards({ companies, onCompanyClick, onUserClick }) {
  // Convert companies data to match expected format
  const normalizedCompanies = companies.map(company => ({
    name: company.companyName || company.name,
    totalLeads: company.leadsCapured || company.totalLeads,
    avgSalesIntel: company.avgSalesIntelScore || company.avgSalesIntel,
    overallScore: company.overallScore || ((company.leadsCapured || company.totalLeads) + (company.avgSalesIntelScore || company.avgSalesIntel) + (company.avgConversionScore || company.avgConversion)) / 3
  }));

  // Sort companies and get top 3 for each metric
  const sortedByLeads = [...normalizedCompanies].sort((a, b) => b.totalLeads - a.totalLeads);
  const sortedBySalesIntel = [...normalizedCompanies].sort((a, b) => b.avgSalesIntel - a.avgSalesIntel);
  const sortedByOverall = [...normalizedCompanies].sort((a, b) => b.overallScore - a.overallScore);

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

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
      <Card className="bg-amber-50 border-amber-200 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-start justify-between min-w-0">
  <div className="min-w-0">
    <CardTitle className="text-xl font-semibold">
      Most<br />Leads<br />
    </CardTitle>

    <button
      className="text-lg mt-2 text-amber-600 hover:text-amber-800 hover:underline cursor-pointer text-left whitespace-normal break-words"
      onClick={() => onCompanyClick?.(mostLeads.name)}
    >
      {mostLeads.name}
    </button>
  </div>

  <Trophy className="h-12 w-12 text-amber-600 flex-shrink-0 mt-12" />
</div>

        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-4">
            <div className="mb-2">
              <AnimatedCounter value={mostLeads.totalLeads} color="#d97706" duration={1500} />
            </div>
            <p className="text-sm text-muted-foreground">
              total leads captured
            </p>
          </div>
          
          {/* Performance Rankings */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Performers</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">1st</span>
                </div>
                <button
                  className="text-sm text-amber-600 hover:text-amber-800 hover:underline cursor-pointer whitespace-normal break-words text-left"
                  onClick={() => onUserClick?.(getStarPerformer(mostLeads, 'leads'))}
                >
                  {getStarPerformer(mostLeads, 'leads')}
                </button>
              </div>
              {getSecondPlaceCompany(sortedByLeads) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-muted-foreground">2nd</span>
                  </div>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer whitespace-normal break-words text-left"
                    onClick={() => onCompanyClick?.(getSecondPlaceCompany(sortedByLeads).name)}
                  >
                    {getSecondPlaceCompany(sortedByLeads).name}
                  </button>
                </div>
              )}
              {getThirdPlaceCompany(sortedByLeads) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-muted-foreground">3rd</span>
                  </div>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer whitespace-normal break-words text-left"
                    onClick={() => onCompanyClick?.(getThirdPlaceCompany(sortedByLeads).name)}
                  >
                    {getThirdPlaceCompany(sortedByLeads).name}
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 border-purple-200 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-start justify-between min-w-0">
              <div className="min-w-0">
            <CardTitle className="text-xl font-semibold">Quality<br/>Leader</CardTitle>

            <button
              className="text-lg mt-2 text-purple-600 hover:text-purple-800 hover:underline cursor-pointer text-left whitespace-normal break-words"
              onClick={() => onCompanyClick?.(qualityLeader.name)}
            >
              {qualityLeader.name}
            </button>
          </div>
          <Crown className="h-12 w-12 text-purple-600 flex-shrink-0 mt-12" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-4">
            <div className="mb-2">
              <AnimatedCounter value={qualityLeader.avgSalesIntel} decimals={1} color="#9333ea" duration={1500} />
            </div>
            <p className="text-sm text-muted-foreground">
              average sales intel score
            </p>
          </div>
          
          {/* Performance Rankings */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Performers</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">1st</span>
                </div>
                  <button
                    className="text-sm text-purple-600 hover:text-purple-800 hover:underline cursor-pointer whitespace-normal break-words text-left"
                    onClick={() => onUserClick?.(getStarPerformer(qualityLeader, 'salesIntel'))}
                  >
                    {getStarPerformer(qualityLeader, 'salesIntel')}
                  </button>
              </div>
              {getSecondPlaceCompany(sortedBySalesIntel) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-muted-foreground">2nd</span>
                  </div>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer whitespace-normal break-words text-left"
                    onClick={() => onCompanyClick?.(getSecondPlaceCompany(sortedBySalesIntel).name)}
                  >
                    {getSecondPlaceCompany(sortedBySalesIntel).name}
                  </button>
                </div>
              )}
              {getThirdPlaceCompany(sortedBySalesIntel) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-muted-foreground">3rd</span>
                  </div>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer whitespace-normal break-words text-left"
                    onClick={() => onCompanyClick?.(getThirdPlaceCompany(sortedBySalesIntel).name)}
                  >
                    {getThirdPlaceCompany(sortedBySalesIntel).name}
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-50 border-emerald-200 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-start justify-between min-w-0">
              <div className="min-w-0">
            <CardTitle className="text-xl font-semibold">Best Overall Balance</CardTitle>
            <button
              className="text-lg mt-2 text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer text-left whitespace-normal break-words"
              onClick={() => onCompanyClick?.(bestBalance.name)}
            >
              {bestBalance.name}
            </button>
          </div>
          <Medal className="h-12 w-12 text-emerald-600 flex-shrink-0 mt-12" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-4">
            <div className="mb-2">
              <AnimatedCounter value={bestBalance.overallScore} decimals={1} color="#059669" duration={1500} />
            </div>
            <p className="text-sm text-muted-foreground">
              overall performance score
            </p>
          </div>
          
          {/* Performance Rankings */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Performers</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">1st</span>
                </div>
                <button
                  className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer whitespace-normal break-words text-left"
                  onClick={() => onUserClick?.(getStarPerformer(bestBalance, 'overall'))}
                >
                  {getStarPerformer(bestBalance, 'overall')}
                </button>
              </div>
              {getSecondPlaceCompany(sortedByOverall) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-muted-foreground">2nd</span>
                  </div>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer whitespace-normal break-words text-left"
                    onClick={() => onCompanyClick?.(getSecondPlaceCompany(sortedByOverall).name)}
                  >
                    {getSecondPlaceCompany(sortedByOverall).name}
                  </button>
                </div>
              )}
              {getThirdPlaceCompany(sortedByOverall) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-muted-foreground">3rd</span>
                  </div>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline cursor-pointer whitespace-normal break-words text-left"
                    onClick={() => onCompanyClick?.(getThirdPlaceCompany(sortedByOverall).name)}
                  >
                    {getThirdPlaceCompany(sortedByOverall).name}
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
