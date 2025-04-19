
import React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressIndicatorProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  labelClassName?: string;
  label?: string;
}

export const CircularProgressIndicator: React.FC<CircularProgressIndicatorProps> = ({
  value,
  size = 100,
  strokeWidth = 10,
  className,
  labelClassName,
  label,
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate circle dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  // Determine color based on progress
  const getStrokeColor = () => {
    if (normalizedValue <= 25) return "stroke-zinc-400";
    if (normalizedValue <= 50) return "stroke-blue-400";
    if (normalizedValue <= 75) return "stroke-indigo-500";
    return "stroke-primary";
  };
  
  return (
    <div className={cn("relative inline-flex", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      {label && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center text-foreground font-medium", 
            labelClassName
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
};
