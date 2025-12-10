// File: components/LeadDetailsDialog.tsx
import { Package, X, MapPin, Calendar, Clock, User, Building } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { LeadBusinessCard } from "./ui/lead-business-card";
import { LeadAISummary } from "./ui/lead-ai-summary";
import { LeadQualityScores } from "./ui/lead-quality-scores";
import { LeadVoiceMemos } from "./ui/lead-voice-memos";
import { LeadMeetingPhotos } from "./ui/lead-meeting-photos";

export function LeadDetailsDialog({ 
  isOpen, 
  onClose, 
  selectedLead, 
  user, 
  playingMemo, 
  toggleMemoPlayback, 
  expandedMemos, 
  toggleMemoExpansion, 
  openImageViewer 
}) {
  if (!selectedLead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col
             [&>button.absolute.right-4.top-4]:hidden">
        <DialogTitle className="sr-only">
          Lead Details: {selectedLead.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information for {selectedLead.name} from {selectedLead.company}
        </DialogDescription>
        
        {/* Header bar */}
        <div className="flex items-center justify-between bg-blue-50 px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                {selectedLead.hasPhoto && selectedLead.photoUrl && (
                  <AvatarImage src={selectedLead.photoUrl} alt={selectedLead.name} />
                )}
                <AvatarFallback className="text-lg">
                  {selectedLead.name ? selectedLead.name.split(' ').map(n => n[0]).join('') : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                {selectedLead.name ? (
                  <>
                    <h2 className="text-xl">{selectedLead.name}</h2>
                    <p className="text-muted-foreground">{selectedLead.company}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl text-blue-600">Unmatched Scan</h2>
                    <p className="text-muted-foreground font-mono text-sm">{selectedLead.badgeCode}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 popup-scrollbar">
          {/* Lead captured by info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-muted-foreground pb-2 border-0">
                    <div className="flex items-center justify-center">
                      <User className="h-4 w-4" />
                      <span>Captured by</span>
                    </div>
                  </th>
                  <th className="text-left text-muted-foreground pb-2 border-0">
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left text-muted-foreground pb-2 border-0">
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium border-0 text-center">
                    {selectedLead.capturedBy || user?.name || "You"}
                  </td>
                  <td className="border-0 text-center">
                    {new Date(selectedLead.capturedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="border-0 text-center">
                    {new Date(selectedLead.capturedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Business Card */}
          <LeadBusinessCard lead={selectedLead} />

          {/* AI Summary */}
          <LeadAISummary summary={selectedLead.summary} />

          {/* Lead Quality and Scores */}
          <LeadQualityScores lead={selectedLead} />

          {/* Sales Information Old*/}
          {/* <div id="salesInfoOld" className="space-y-4">
            <h3 className="text-lg font-medium">Sales Information Old</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Lead Type</div>
                  <Badge variant="outline" className={`${getLeadTypeBadgeColor(selectedLead.leadType)}`}>
                    {selectedLead.leadType}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Timeline</div>
                  <div className="text-sm font-medium">{selectedLead.timeframe}</div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Sales Information 2*/}
          <div id="salesInfo" className="space-y-4">
            <h3 className="text-lg font-medium">Sales Information</h3>
            <div className="flex gap-4">
              {/* Lead Type Pill */}
              <div className="flex-1">
                <Badge 
                  variant="outline" 
                  className={`${getLeadTypeBadgeColor(selectedLead.leadType)} w-full px-4 py-3 rounded-full justify-center text-sm font-medium`}
                >
                  <span className="text-xs font-medium text-muted-foreground mr-2">Lead Type:</span>
                  {selectedLead.leadType}
                </Badge>
              </div>
              
              {/* Timeline Pill */}
              <div className="flex-1">
                <Badge 
                  variant="outline" 
                  className={`${getTimelineBadgeColor(selectedLead.timeframe)} w-full px-4 py-3 rounded-full justify-center text-sm font-medium`}
                >
                  <span className="text-xs font-medium text-muted-foreground mr-2">Timeline:</span>
                  {selectedLead.timeframe}
                </Badge>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{selectedLead.notes}</p>
            </div>
          </div>

          {/* Products of Interest */}
          {selectedLead.products && selectedLead.products.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Products of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {selectedLead.products.map((product, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Package className="h-3 w-3 mr-1" />
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Voice Memos */}
          <LeadVoiceMemos 
            voiceMemos={selectedLead.voiceMemos}
            playingMemo={playingMemo}
            toggleMemoPlayback={toggleMemoPlayback}
            expandedMemos={expandedMemos}
            toggleMemoExpansion={toggleMemoExpansion}
          />

          {/* Meeting Photos */}
          <LeadMeetingPhotos 
            pictures={selectedLead.pictures}
            openImageViewer={openImageViewer}
          />

          {/* AI Processing Status */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-medium">Processing Status</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${selectedLead.aiProcessed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium">
                  AI Processing: {selectedLead.aiProcessed ? 'Complete' : 'In Progress'}
                </span>
              </div>
              {!selectedLead.aiProcessed && (
                <p className="text-xs text-muted-foreground mt-2">
                  AI analysis is still processing. Scores and summary will be available shortly.
                </p>
              )}
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions for badge colors
function getLeadTypeBadgeColor(leadType) {
  switch (leadType) {
    case "Hot": return "bg-red-100 text-red-800 border-red-200";
    case "Warm": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cold": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Information Only": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getPriorityBadgeColor(priority) {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800 border-red-200";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getTimelineBadgeColor(timeframe) {
  switch (timeframe) {
    case "ASAP": return "bg-red-100 text-red-800 border-red-200";
    case "2 weeks": return "bg-red-100 text-red-800 border-red-200";
    case "4 weeks": return "bg-orange-100 text-orange-800 border-orange-200";
    case "2 months": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "6+ months": return "bg-gray-100 text-gray-800 border-gray-200";
    case "Info only": return "bg-gray-100 text-gray-800 border-gray-200";
    case "Other (see notes)": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
