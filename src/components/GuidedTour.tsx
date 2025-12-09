// File: components/GuidedTour.tsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const tourSteps = {
  "User": [
    {
      id: 1,
      title: "Welcome to Badge Scanner!",
      content: "This is your personal dashboard where you can manage leads captured at events. Let's take a quick tour to get you started.",
      target: null,
      position: "center"
    },
    {
      id: 2,
      title: "Total Leads",
      content: "Here you can see your total lead count for this event. This number updates in real-time as you capture more leads.",
      target: "[data-step='2']",
      position: "bottom"
    },
    {
      id: 3,
      title: "User Licenses",
      content: "This shows how many team members are actively using the system. Click here to see your team details.",
      target: "[data-step='3']",
      position: "bottom",
      highlightClass: "tour-highlight"
    },
    {
      id: 4,
      title: "AI Scores",
      content: "The Sales Intel Score tracks how much helpful data your team is collecting about prospects. The Conversion score tracks likelihood of conversion. Both scores are out of 10, and are AI-generated based on the data your team collects.",
      target: "[data-step='4']",
      position: "bottom",
      highlightClass: "tour-highlight"
    },
    {
      id: 5,
      title: "Conversion Score",
      content: "This AI-generated score helps you understand the quality of prospects your team is capturing. Higher scores indicate better conversion potential.",
      target: "[data-step='5']",
      position: "bottom",
      highlightClass: "tour-highlight"
    },
    {
      id: 6,
      title: "Your Leads",
      content: "This is where you'll manage all your captured leads. You can sort, filter, and view detailed information about each prospect.",
      target: "#leads-tab",
      position: "bottom",
      highlightClass: "tour-highlight-tab",
      additionalTargets: ["#leads-content"]
    }
  ],
  "Admin": [
    {
      id: 1,
      title: "Welcome to Badge Scanner!",
      content: "This is your company dashboard where you can manage leads, team members, and products. Let's take a quick tour to get you started.",
      target: null,
      position: "center"
    },
    {
      id: 2,
      title: "Total Leads",
      content: "Here you can see your total lead count for this event. This number updates in real-time as you capture more leads.",
      target: "[data-step='2']",
      position: "bottom"
    },
    {
      id: 3,
      title: "User Licenses",
      content: "This shows how many team members are actively using the system. Click here to see your team details and manage licenses.",
      target: "#user-licenses-card",
      position: "bottom",
      highlightClass: "tour-highlight"
    },
    {
      id: 4,
      title: "AI Scores",
      content: "The Sales Intel Score tracks how much helpful data your team is collecting about prospects. The Conversion score tracks likelihood of conversion. Both scores are out of 10, and are AI-generated based on the data your team collects.",
      target: "[data-step='4']",
      position: "bottom",
      highlightClass: "tour-highlight"
    },
    {
      id: 5,
      title: "Conversion Score",
      content: "This AI-generated score helps you understand the quality of prospects your team is capturing. Higher scores indicate better conversion potential.",
      target: "[data-step='5']",
      position: "bottom",
      highlightClass: "tour-highlight"
    },
    {
      id: 6,
      title: "Your Leads",
      content: "This is where you'll manage all your captured leads. You can sort, filter, and view detailed information about each prospect.",
      target: "#leads-tab",
      position: "bottom",
      highlightClass: "tour-highlight-tab",
      additionalTargets: ["#leads-content"]
    },
    {
      id: 7,
      title: "Team Management",
      content: "Manage your team members, assign licenses, and see who's currently active at the event. As an admin, you have full control over user permissions.",
      target: "#team-tab",
      position: "bottom",
      highlightClass: "tour-highlight-tab",
      additionalTargets: ["#team-content"]
    },
    {
      id: 8,
      title: "Products of Interest",
      content: "Add your company's product list so your users can quickly select what prospects are interested in within the mobile app.",
      target: "#products-tab",
      position: "bottom",
      highlightClass: "tour-highlight-tab",
      additionalTargets: ["#products-content"]
    }
  ]
};

export function GuidedTour({ onComplete, onSkip, userRole, onTourTabChange, onTourScrollToTop }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  
  const steps = tourSteps[userRole] || tourSteps["User"];
  const step = steps.find(s => s.id === currentStep);
  
  useEffect(() => {
    if (step?.target && step.target !== null) {
      // Handle tour-driven tab changes for Admin
      if (userRole === "Admin" && onTourTabChange) {
        if (currentStep === 6 && step.target === "#leads-tab") {
          onTourTabChange("leads");
        } else if (currentStep === 7 && step.target === "#team-tab") {
          onTourTabChange("team");
        } else if (currentStep === 8 && step.target === "#products-tab") {
          onTourTabChange("products");
        }
      }
      
      // Remove existing highlights
      document.querySelectorAll('.tour-highlight, .tour-highlight-tab, .tour-highlight-button').forEach(el => {
        el.classList.remove('tour-highlight', 'tour-highlight-tab', 'tour-highlight-button');
      });
      
      // Add highlight to main target
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        const highlightClass = step.highlightClass || 'tour-highlight';
        targetElement.classList.add(highlightClass);
        
        // Scroll target into view
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }, 100);
      }
      
      // Add highlights to additional targets
      if (step.additionalTargets) {
        step.additionalTargets.forEach(target => {
          const additionalElement = document.querySelector(target);
          if (additionalElement) {
            const highlightClass = step.highlightClass || 'tour-highlight';
            additionalElement.classList.add(highlightClass);
          }
        });
      }
    }
    
    return () => {
      // Cleanup highlights when component unmounts or step changes
      document.querySelectorAll('.tour-highlight, .tour-highlight-tab, .tour-highlight-button').forEach(el => {
        el.classList.remove('tour-highlight', 'tour-highlight-tab', 'tour-highlight-button');
      });
    };
  }, [currentStep, step, userRole, onTourTabChange]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Remove highlights before completing
    document.querySelectorAll('.tour-highlight, .tour-highlight-tab, .tour-highlight-button').forEach(el => {
      el.classList.remove('tour-highlight', 'tour-highlight-tab', 'tour-highlight-button');
    });
    
    // Trigger scroll to top for AdminDashboard if callback is available
    if (onTourScrollToTop) {
      onTourScrollToTop();
    }
    
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    // Remove highlights before skipping
    document.querySelectorAll('.tour-highlight, .tour-highlight-tab, .tour-highlight-button').forEach(el => {
      el.classList.remove('tour-highlight', 'tour-highlight-tab', 'tour-highlight-button');
    });
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible || !step) return null;

  const getPositionClasses = () => {
    if (step.position === "center") {
      return "fixed inset-0 flex items-center justify-center z-[1010]";
    }
    
    // For targeted steps, position the modal in a corner to not obstruct the highlighted element
    return "fixed top-4 right-4 z-[1010] w-96 max-w-md";
  };

  return (
    <>
      {/* Backdrop */}
      {step.position === "center" && (
        <div className="fixed inset-0 bg-black/50 z-[1000]" />
      )}
      
      {/* Tour Modal */}
      <div className={getPositionClasses()}>
        <Card className={`${step.position === "center" ? "w-96 max-w-md shadow-2xl border-2" : "w-full shadow-2xl border-2"} h-[320px] flex flex-col`}>
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">B</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Badge Scanner Help</CardTitle>
                  <CardDescription>
                    Step {currentStep} of {steps.length}
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
              {steps.map((_, index) => (
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
          
          <CardContent className="flex flex-col flex-1 justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.content}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 flex-shrink-0">
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
                <span>{currentStep === steps.length ? 'Finish' : 'Next'}</span>
                {currentStep < steps.length && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
