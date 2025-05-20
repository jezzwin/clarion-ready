import React from "react";

export function ClarionLogo({ size = 40, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background Circle */}
      <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
      
      {/* Code Brackets */}
      <path 
        d="M35 30L25 50L35 70" 
        stroke="white" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      <path 
        d="M65 30L75 50L65 70" 
        stroke="white" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      
      {/* Code Lines */}
      <rect x="40" y="35" width="20" height="4" rx="2" fill="white" filter="url(#glow)" />
      <rect x="40" y="48" width="15" height="4" rx="2" fill="white" filter="url(#glow)" />
      <rect x="40" y="61" width="25" height="4" rx="2" fill="white" filter="url(#glow)" />
      
      {/* Binary Dots */}
      <circle cx="33" cy="40" r="2" fill="white" filter="url(#glow)" />
      <circle cx="33" cy="60" r="2" fill="white" filter="url(#glow)" />
      <circle cx="67" cy="40" r="2" fill="white" filter="url(#glow)" />
      <circle cx="67" cy="60" r="2" fill="white" filter="url(#glow)" />
      
      {/* Shine Effect */}
      <circle cx="70" cy="30" r="8" fill="white" opacity="0.2" />
    </svg>
  );
}

export default ClarionLogo;