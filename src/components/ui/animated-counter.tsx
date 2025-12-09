// File: components/ui/animated-counter.tsx
import { useState, useEffect } from "react";

export function AnimatedCounter({ value, decimals = 0, color = "#000000", duration = 1500, fontSize = "text-6xl" }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const start = 0;
    const end = value;
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  // Format the number with superscript decimals
  const formatWithSuperscript = (num) => {
    if (decimals > 0) {
      const fixed = num.toFixed(decimals);
      const [whole, decimal] = fixed.split('.');
      return (
        <>
          {whole}
          {decimal && (
            <span className="decimal-superscript">.{decimal}</span>
          )}
        </>
      );
    }
    return Math.floor(num);
  };
  
  return (
    <span className={`${fontSize} font-black italic`} style={{ color }}>
      {formatWithSuperscript(count)}
    </span>
  );
}
