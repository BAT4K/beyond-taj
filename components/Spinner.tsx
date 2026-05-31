import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLogo?: boolean;
}

export default function Spinner({ size = 'md', className = '', showLogo = true }: SpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  };

  const textMap = {
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-xl'
  };

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      {/* Subtle track */}
      <div className="absolute inset-0 rounded-full border-[2px] border-white/5" />
      {/* Spinning element */}
      <div 
        className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-[#c9a96e] border-r-[#c9a96e] animate-spin" 
        style={{ animationDuration: '1.2s', animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} 
      />
    </div>
  );
}
