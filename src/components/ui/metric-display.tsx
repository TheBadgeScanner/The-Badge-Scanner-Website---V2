// File: components/ui/metric-display.tsx
import React from 'react';

interface MetricDisplayProps {
  value: number;
  decimals?: number;
  color?: string;
  className?: string;
}

export function MetricDisplay({ value, decimals = 1, color, className = "" }: MetricDisplayProps) {
  const isInteger = Number.isInteger(value);
  
  if (isInteger) {
    return <span className={className} style={{ color }}>{value}</span>;
  }
  
  const integerPart = Math.floor(value);
  const decimalPart = (value - integerPart).toFixed(decimals).substring(1); // Remove the "0" part
  
  return (
    <span className={className} style={{ color }}>
      {integerPart}
      <span className="decimal-superscript">{decimalPart}</span>
    </span>
  );
}
