import { cn } from "@/lib/utils";

interface BrandIconProps {
  className?: string;
  size?: number;
}

export const BrandLogo = ({ className, size = 24 }: BrandIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-primary", className)}
  >
    <defs>
      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(210, 85%, 45%)" />
        <stop offset="100%" stopColor="hsl(285, 85%, 65%)" />
      </linearGradient>
    </defs>
    
    {/* Main Circle */}
    <circle cx="16" cy="16" r="14" fill="url(#brandGradient)" opacity="0.1" />
    
    {/* Core Shape */}
    <path
      d="M8 16 L16 8 L24 16 L20 20 L16 16 L12 20 Z"
      fill="url(#brandGradient)"
      stroke="currentColor"
      strokeWidth="1"
    />
    
    {/* Inner Detail */}
    <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.8" />
    
    {/* Decorative Elements */}
    <path
      d="M6 16 L10 16 M22 16 L26 16 M16 6 L16 10 M16 22 L16 26"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

export const BrandSymbol = ({ className, size = 16 }: BrandIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-primary", className)}
  >
    <path
      d="M8 2 L14 8 L8 14 L2 8 Z"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M8 4 L12 8 L8 12 L4 8 Z"
      fill="currentColor"
    />
  </svg>
);

export const BrandMark = ({ className, size = 20 }: BrandIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-accent", className)}
  >
    <defs>
      <linearGradient id="markGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(160, 55%, 48%)" />
        <stop offset="100%" stopColor="hsl(285, 85%, 65%)" />
      </linearGradient>
    </defs>
    
    <circle cx="10" cy="10" r="8" fill="url(#markGradient)" opacity="0.1" />
    <path
      d="M10 3 C13.866 3 17 6.134 17 10 C17 13.866 13.866 17 10 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="10" cy="10" r="2" fill="currentColor" />
  </svg>
);