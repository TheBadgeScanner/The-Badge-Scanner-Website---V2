// File: components/ImageViewer.tsx
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export function ImageViewer({ isOpen, onClose, images, initialIndex = 0, title = "Meeting Photos" }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentImage = images[currentIndex];

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meeting-photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        onClose();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
    }
  };

  const resetState = () => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setRotation(0);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetState();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95"
        onKeyDown={handleKeyDown}
      >
        {/* Header with controls */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-white/70">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.25}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRotate}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div 
            className="transition-transform duration-200 ease-in-out"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            <ImageWithFallback
              src={currentImage}
              alt={`Meeting photo ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Image thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded-lg p-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setZoom(1);
                  setRotation(0);
                }}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex 
                    ? 'border-white' 
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
