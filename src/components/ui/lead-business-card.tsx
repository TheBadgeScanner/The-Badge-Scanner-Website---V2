// File: components/ui/lead-business-card.tsx
import { useState } from "react";
import { Phone, Building, Languages, Clock, Mail } from "lucide-react";
import { Badge } from "./badge";
import { getLeadTypeBadgeColor } from "../utils/dashboardHelpers";

export function LeadBusinessCard({ lead }) {
  const [showCopied, setShowCopied] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText(lead.email).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1000);
    }).catch(err => {
      console.error('Failed to copy email:', err);
    });
  };
  return (
    <div 
      className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 shadow-lg border border-slate-200"
      style={{ aspectRatio: '8/5' }}
    >
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-slate-800">{lead.name}</h3>
        <p className="text-lg text-slate-600">{lead.jobTitle}</p>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-medium">{lead.company}</h4>
            <p className="text-sm text-muted-foreground">{lead.industry}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge 
            variant="outline" 
            className={`${getLeadTypeBadgeColor(lead.leadType)} w-18 h-10 mb-0`}>
            {lead.leadType}
          </Badge>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 mb-4"></div>

      <div className="space-y-3">
        {/* Line 1: Phone and Company Size */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{lead.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{lead.companySize}</span>
          </div>
        </div>

        {/* Line 2: Email (full width) */}
        <div className="relative flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div 
            className="cursor-pointer hover:bg-slate-200/50 hover:font-semibold rounded px-1 -ml-1 py-0.5 transition-all truncate flex-1"
            onClick={handleEmailClick}
            title="Click to copy email"
          >
            <span className="truncate">{lead.email}</span>
          </div>
          {showCopied && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-md px-3 py-2 rounded shadow-lg whitespace-nowrap animate-fade-in-out pointer-events-none z-50">
              Copied to clipboard
            </div>
          )}
        </div>

        {/* Line 3: Timeline and Language */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Timeline: {lead.timeframe}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <span>{lead.language}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
