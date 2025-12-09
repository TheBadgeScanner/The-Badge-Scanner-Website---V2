// File: components/ui/stacked-bar-chart.tsx
import React, { useState, useEffect } from 'react';

interface StackedBarData {
  name: string;
  value: number;
  color: string;
}

interface StackedBarChartProps {
  data: StackedBarData[];
  onSegmentClick?: (segmentName: string) => void;
  height?: number;
  className?: string;
}

// Define all categories with their default colors
const ALL_CATEGORIES = [
  { name: "None", color: "#9CA3AF" },
  { name: "Info Only", color: "#6B7280" },
  { name: "Cold", color: "#3B82F6" },
  { name: "Warm", color: "#F97316" },
  { name: "Hot", color: "#EF4444" }
];

export function StackedBarChart({ 
  data, 
  onSegmentClick, 
  height = 50, 
  className = "" 
}: StackedBarChartProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  // Trigger animation on mount with slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Function to darken a hex color
  function darkenColor(hexColor: string, amount: number = 0.3): string {
    // Remove the hash if present
    const hex = hexColor.replace('#', '');
    
    // Parse r, g, b values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Darken by reducing each component
    const darkerR = Math.max(0, Math.floor(r * (1 - amount)));
    const darkerG = Math.max(0, Math.floor(g * (1 - amount)));
    const darkerB = Math.max(0, Math.floor(b * (1 - amount)));
    
    // Convert back to hex
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(darkerR)}${toHex(darkerG)}${toHex(darkerB)}`;
  }

  // Ensure all categories are represented, even if not in input data
  const allSegmentsData = ALL_CATEGORIES.map(category => {
    const inputData = data.find(item => item.name === category.name);
    return {
      name: category.name,
      value: inputData?.value || 0,
      color: inputData?.color || category.color
    };
  });

  // Calculate total and percentages
  const total = allSegmentsData.reduce((sum, item) => sum + item.value, 0);

  // Process segments with proper percentage calculation
  let remainingPercentage = 100;
  const processedSegments = allSegmentsData.map((segment, index) => {
    let percentage: number;
    
    if (total === 0) {
      // If no data, show equal distribution for visualization
      percentage = 100 / allSegmentsData.length;
    } else if (index === allSegmentsData.length - 1) {
      // Last segment gets remaining percentage to ensure 100% total
      percentage = Math.max(0, remainingPercentage);
    } else {
      const rawPercentage = (segment.value / total) * 100;
      percentage = Math.round(rawPercentage * 10) / 10;
      remainingPercentage -= percentage;
    }
    
    return {
      ...segment,
      percentage: percentage,
      // Calculate text color for contrast
      textColor: getContrastColor(segment.color),
      // Determine if text should be shown inside segment
      showTextInside: percentage >= 8 && segment.value > 0 // Only show text if segment has actual data and is wide enough
    };
  });

  // Function to determine text color for readability
  function getContrastColor(hexColor: string): string {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.6 ? '#111827' : '#ffffff';
  }

  const handleSegmentClick = (segmentName: string) => {
    if (onSegmentClick) {
      onSegmentClick(segmentName);
    }
  };

  const handleSegmentMouseEnter = (segmentName: string) => {
    setHoveredSegment(segmentName);
  };

  const handleSegmentMouseLeave = () => {
    setHoveredSegment(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Horizontal bar chart */}
      <div 
        className="w-full rounded-lg overflow-hidden flex border border-gray-200 shadow-sm bg-white"
        style={{ height: `${height}px` }}
      >
        {processedSegments.map((segment, index) => {
          const isHovered = hoveredSegment === segment.name;
          const animationDelay = index * 100; // Stagger animation by 100ms per segment
          const hasData = segment.value > 0;
          const darkerColor = darkenColor(segment.color, 0.2);
              const dimmed = !isHovered && Boolean(hoveredSegment);
          
          return (
            <div
              key={segment.name}
              className={`relative flex items-center justify-center transition-all duration-3000 ease-out ${
                onSegmentClick ? 'cursor-pointer' : ''
              } ${!hasData ? 'opacity-30' : ''}`}

style={{
  backgroundColor: segment.color,
  width: isAnimated ? `${segment.percentage}%` : '0%',
  minWidth: segment.percentage > 0 ? '2px' : '0',
  transitionDelay: isAnimated ? `${animationDelay}ms` : '0ms',
  transitionProperty: 'width, filter, transform, box-shadow, opacity',
  // nicer curves & per-property timings
  transition: `
    opacity 260ms cubic-bezier(0.22,1,0.36,1) ${dimmed ? '110ms' : '0ms'},
    filter 200ms cubic-bezier(0.4,0,0.2,1),
    transform 200ms cubic-bezier(0.4,0,0.2,1),
    box-shadow 200ms cubic-bezier(0.4,0,0.2,1),
    width 800ms cubic-bezier(0.4,0.5,0.2,1) ${isAnimated ? `${animationDelay}ms` : '0ms'}
  `,
  // keep your “pop” on hover, but lighten a touch
  // filter: isHovered
  //   ? 'brightness(1.08)'
  //   : (hoveredSegment ? 'grayscale(0.15) brightness(0.9)' : 'none'),
  // soft fade like Apex
  opacity: dimmed ? 0.18 : 1,
  boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
  zIndex: isHovered ? 10 : 1,
  willChange: 'opacity, filter, transform'
}}

              onClick={() => handleSegmentClick(segment.name)}
              onMouseEnter={() => handleSegmentMouseEnter(segment.name)}
              onMouseLeave={handleSegmentMouseLeave}
              title={`${segment.name}: ${segment.value} leads (${segment.percentage.toFixed(1)}%)`}
            >
              {/* Text inside segment - only show if segment has data and is wide enough */}
              {segment.showTextInside && hasData && (
                <span 
                  className="text-sm font-medium tabular-nums px-2 truncate transition-all duration-300"
                  style={{ 
    color: dimmed ? 'transparent' : segment.textColor,   // hide text when dimmed
                    opacity: isAnimated ? 1 : 0,
                    transitionDuration: '300ms',
                    transitionProperty: 'opacity, color',
                    textShadow: isHovered ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
                  }}
                >
                  {segment.percentage.toFixed(1)}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Labels below for segments too narrow to show text inside or with no data */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
        {processedSegments
          .filter(segment => (!segment.showTextInside || segment.value === 0) && segment.percentage > 0)
          .map((segment) => {
            const isHovered = hoveredSegment === segment.name;
            const hasData = segment.value > 0;
            return (
              <div 
                key={segment.name}
                className={`flex items-center space-x-2 transition-all duration-200 ease-out ${
                  onSegmentClick ? 'cursor-pointer' : ''
                } ${!hasData ? 'opacity-50' : ''}`}
                style={{
                  opacity: isHovered ? 0.8 : (hasData ? 1 : 0.5),
                  transform: isHovered ? 'translateY(-1px)' : 'translateY(0px)'
                }}
                onClick={() => handleSegmentClick(segment.name)}
                onMouseEnter={() => handleSegmentMouseEnter(segment.name)}
                onMouseLeave={handleSegmentMouseLeave}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-gray-200 transition-all duration-200"
                  style={{ 
                    backgroundColor: segment.color,
                    boxShadow: isHovered ? '0 0 0 2px rgba(59, 130, 246, 0.4)' : 'none',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
                <span className="text-sm font-medium text-gray-700 tabular-nums">
                  {segment.name}: {segment.percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
      </div>

      {/* Legend for all categories - always show all categories */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 pt-4 border-t border-gray-200">
        {processedSegments.map((segment) => {
          const isHovered = hoveredSegment === segment.name;
          const hasData = segment.value > 0;
          return (
            <div 
              key={segment.name}
              className={`flex items-center space-x-3 transition-all duration-200 ease-out ${
                onSegmentClick ? 'cursor-pointer' : ''
              } ${!hasData ? 'opacity-50' : ''}`}
              style={{
                opacity: isHovered ? 0.8 : (hasData ? 1 : 0.5),
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0px)'
              }}
              onClick={() => handleSegmentClick(segment.name)}
              onMouseEnter={() => handleSegmentMouseEnter(segment.name)}
              onMouseLeave={handleSegmentMouseLeave}
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-200 transition-all duration-200"
                style={{ 
                  backgroundColor: segment.color,
                  boxShadow: isHovered ? '0 0 0 2px rgba(59, 130, 246, 0.4)' : 'none',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                }}
              />
              <span className="text-sm font-medium text-gray-600 tabular-nums">
                {segment.name}: {segment.value} ({segment.percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
