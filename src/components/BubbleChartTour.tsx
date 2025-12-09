// File: components/BubbleChartTour.tsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const bubbleChartTourSteps = [
  {
    id: 1,
    title: "Chart Interpretation Guide",
    content: "This chart shows company performance across two key metrics. Let's explore what each quadrant means for your event strategy.",
    quadrant: null,
    position: "center"
  },
  {
    id: 2,
    title: "Top Left Quadrant",
    content: "Getting quality but not quantity. May benefit from moving to an area with higher footfall next time.",
    quadrant: "top-left",
    position: "top-right"
  },
  {
    id: 3,
    title: "Top Right Quadrant", 
    content: "Companies here are crushing it! Particularly if they're there when you normalize the chart. This means they're getting great results per user. They may benefit from a bigger stand next time so they can bring more stand staff.",
    quadrant: "top-right",
    position: "top-left"
  },
  {
    id: 4,
    title: "Bottom Left Quadrant",
    content: "Strugglers. May need guidance on getting more from the event, or their booth may be in a location that's not bringing the right footfall to them.",
    quadrant: "bottom-left",
    position: "bottom-right"
  },
  {
    id: 5,
    title: "Bottom Right Quadrant",
    content: "Doing well, but not maximising their follow-up opportunity. Might do better if they capture more information on each lead.",
    quadrant: "bottom-right",
    position: "bottom-left"
  }
];

export function BubbleChartTour({ onComplete, onSkip, chartContainerRef }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [quadrantHighlight, setQuadrantHighlight] = useState(null);
  
  const step = bubbleChartTourSteps.find(s => s.id === currentStep);
  
  useEffect(() => {
    if (step?.quadrant && chartContainerRef?.current) {
      // Remove existing quadrant highlights
      document.querySelectorAll('.tour-highlight-quadrant').forEach(el => {
        el.remove();
      });
      
      // Get chart container dimensions
      const chartRect = chartContainerRef.current.getBoundingClientRect();
      const chartWidth = chartRect.width;
      const chartHeight = chartRect.height;
      
      // Calculate quadrant position and size
      let quadrantStyle = {};
      const quadrantWidth = chartWidth * 0.45; // Slightly smaller than half to account for axis labels
      const quadrantHeight = chartHeight * 0.45;
      const offsetX = chartWidth * 0.08; // Offset from axis labels
      const offsetY = chartHeight * 0.08;
      
      switch (step.quadrant) {
        case "top-left":
          quadrantStyle = {
            left: `${chartRect.left + offsetX}px`,
            top: `${chartRect.top + offsetY}px`,
            width: `${quadrantWidth}px`,
            height: `${quadrantHeight}px`
          };
          break;
        case "top-right":
          quadrantStyle = {
            left: `${chartRect.left + chartWidth - quadrantWidth - offsetX}px`,
            top: `${chartRect.top + offsetY}px`,
            width: `${quadrantWidth}px`,
            height: `${quadrantHeight}px`
          };
          break;
        case "bottom-left":
          quadrantStyle = {
            left: `${chartRect.left + offsetX}px`,
            top: `${chartRect.top + chartHeight - quadrantHeight - offsetY}px`,
            width: `${quadrantWidth}px`,
            height: `${quadrantHeight}px`
          };
          break;
        case "bottom-right":
          quadrantStyle = {
            left: `${chartRect.left + chartWidth - quadrantWidth - offsetX}px`,
            top: `${chartRect.top + chartHeight - quadrantHeight - offsetY}px`,
            width: `${quadrantWidth}px`,
            height: `${quadrantHeight}px`
          };
          break;
      }
      
      // Create and position quadrant highlight
      const highlight = document.createElement('div');
      highlight.className = 'tour-highlight-quadrant';
      Object.assign(highlight.style, quadrantStyle);
      document.body.appendChild(highlight);
      
      setQuadrantHighlight(highlight);
    } else {
      // Remove highlights for non-quadrant steps
      document.querySelectorAll('.tour-highlight-quadrant').forEach(el => {
        el.remove();
      });
      setQuadrantHighlight(null);
    }
    
    return () => {
      // Cleanup on unmount or step change
      document.querySelectorAll('.tour-highlight-quadrant').forEach(el => {
        el.remove();
      });
    };
  }, [currentStep, step, chartContainerRef]);

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentStep < bubbleChartTourSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Remove highlights before completing
    document.querySelectorAll('.tour-highlight-quadrant').forEach(el => {
      el.remove();
    });
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = (e) => {
    e.stopPropagation();
    // Remove highlights before skipping
    document.querySelectorAll('.tour-highlight-quadrant').forEach(el => {
      el.remove();
    });
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible || !step) return null;

  const getPositionClasses = () => {
    if (step.position === "center") {
      return "fixed inset-0 flex items-center justify-center z-[1010]";
    }
    
    // Position based on quadrant to avoid obstruction - use standard popup width
    const baseClasses = "fixed z-[1010] w-96 max-w-md";
    
    switch (step.position) {
      case "top-left":
        return `${baseClasses} top-4 left-4`;
      case "top-right":
        return `${baseClasses} top-4 right-4`;
      case "bottom-left":
        return `${baseClasses} bottom-4 left-4`;
      case "bottom-right":
        return `${baseClasses} bottom-4 right-4`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Backdrop for center step only */}
      {step.position === "center" && (
        <div className="fixed inset-0 bg-black/30 z-[1005]" />
      )}
      
      {/* Tour Modal */}
      <div className={getPositionClasses()}>
        <Card className={step.position === "center" ? "w-96 max-w-md shadow-2xl border-2" : "w-full shadow-2xl border-2"} onClick={handleCardClick}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">?</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Chart Guide</CardTitle>
                  <CardDescription>
                    Step {currentStep} of {bubbleChartTourSteps.length}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress dots */}
            <div className="flex space-x-1 mt-3">
              {bubbleChartTourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 === currentStep 
                      ? 'bg-primary' 
                      : index + 1 < currentStep 
                        ? 'bg-primary/60' 
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <Button
                onClick={handleNext}
                size="sm"
                className="flex items-center space-x-1"
              >
                <span>{currentStep === bubbleChartTourSteps.length ? 'Finish' : 'Next'}</span>
                {currentStep < bubbleChartTourSteps.length && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
