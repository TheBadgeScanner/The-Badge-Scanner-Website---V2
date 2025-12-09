// File: components/ui/lead-meeting-photos.tsx
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function LeadMeetingPhotos({ pictures, openImageViewer }) {
  if (!pictures || pictures.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Meeting Photos</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pictures.map((picture, index) => (
          <div key={index} className="group relative">
            <ImageWithFallback
              src={picture}
              alt={`Meeting photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
              onClick={() => openImageViewer(pictures, index)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                Click to view
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
