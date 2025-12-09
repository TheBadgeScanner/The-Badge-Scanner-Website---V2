// File: components/ui/lead-ai-summary.tsx
import { Star } from "lucide-react";

export function LeadAISummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-medium">AI Summary</h3>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm font-medium text-blue-900 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
