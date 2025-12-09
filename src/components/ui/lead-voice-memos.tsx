// File: components/ui/lead-voice-memos.tsx
import { Play, Pause, Volume2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";
import { mockTranscripts } from "../constants/leadDialogData";

export function LeadVoiceMemos({ 
  voiceMemos, 
  playingMemo, 
  toggleMemoPlayback, 
  expandedMemos, 
  toggleMemoExpansion 
}) {
  if (!voiceMemos || voiceMemos.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Voice Memos</h3>
      <div className="space-y-3">
        {voiceMemos.map((memo) => {
          const isExpanded = Boolean(expandedMemos[memo.id]);
          const mockTranscript = mockTranscripts[memo.id] || mockTranscripts.default;
          
          return (
            <div key={memo.id} className="bg-muted rounded-lg">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMemoPlayback(memo.id)}
                    className="h-8 w-8 p-0"
                  >
                    {playingMemo === memo.id ? 
                      <Pause className="h-4 w-4" /> : 
                      <Play className="h-4 w-4" />
                    }
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{memo.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {memo.timestamp} • {memo.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMemoExpansion(memo.id)}
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </div>
              {isExpanded && (
                <div className="px-3 pb-3">
                  <div className="bg-white p-3 rounded border-t">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Transcript:</h4>
                    {mockTranscript === "Transcript not completed" ? (
                      <p className="text-xs text-muted-foreground italic">{mockTranscript}</p>
                    ) : (
                      <div className="text-xs text-foreground max-h-32 overflow-y-auto popup-scrollbar">
                        <p className="leading-relaxed">{mockTranscript}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
