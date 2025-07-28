import { cn } from "@/lib/utils";

interface DecorativeIconProps {
  className?: string;
  size?: number;
}

export const GeometricPattern = ({ className, size = 40 }: DecorativeIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-primary", className)}
  >
    <defs>
      <pattern id="hexPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <polygon
          points="10,2 18,7 18,17 10,22 2,17 2,7"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </pattern>
    </defs>
    <rect width="40" height="40" fill="url(#hexPattern)" />
  </svg>
);

export const WavePattern = ({ className, size = 60 }: DecorativeIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-secondary", className)}
  >
    <defs>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(160, 55%, 48%)" opacity="0.8" />
        <stop offset="50%" stopColor="hsl(285, 85%, 65%)" opacity="0.4" />
        <stop offset="100%" stopColor="hsl(210, 85%, 45%)" opacity="0.8" />
      </linearGradient>
    </defs>
    
    <path
      d="M0 10 Q15 0 30 10 T60 10"
      stroke="url(#waveGradient)"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M0 15 Q15 5 30 15 T60 15"
      stroke="url(#waveGradient)"
      strokeWidth="1.5"
      fill="none"
      opacity="0.6"
    />
  </svg>
);

export const CircleGrid = ({ className, size = 32 }: DecorativeIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-accent", className)}
  >
    {[...Array(16)].map((_, i) => {
      const x = (i % 4) * 8 + 4;
      const y = Math.floor(i / 4) * 8 + 4;
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2"
          fill="currentColor"
          opacity={0.2 + (i % 4) * 0.2}
        />
      );
    })}
  </svg>
);

export const GradientOrb = ({ className, size = 80 }: DecorativeIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-primary", className)}
  >
    <defs>
      <radialGradient id="orbGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="hsl(285, 85%, 65%)" opacity="0.8" />
        <stop offset="50%" stopColor="hsl(210, 85%, 45%)" opacity="0.4" />
        <stop offset="100%" stopColor="hsl(160, 55%, 48%)" opacity="0.1" />
      </radialGradient>
      <filter id="blur">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    
    <circle cx="40" cy="40" r="35" fill="url(#orbGradient)" filter="url(#blur)" />
    <circle cx="35" cy="35" r="20" fill="url(#orbGradient)" opacity="0.6" />
    <circle cx="30" cy="30" r="8" fill="hsl(285, 85%, 65%)" opacity="0.8" />
  </svg>
);

export const AbstractShape = ({ className, size = 50 }: DecorativeIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-brand-primary", className)}
  >
    <defs>
      <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(210, 85%, 45%)" />
        <stop offset="50%" stopColor="hsl(285, 85%, 65%)" />
        <stop offset="100%" stopColor="hsl(160, 55%, 48%)" />
      </linearGradient>
    </defs>
    
    <path
      d="M25 5 L45 15 L40 35 L20 45 L5 25 L15 10 Z"
      fill="url(#shapeGradient)"
      opacity="0.3"
    />
    <path
      d="M25 10 L40 18 L35 32 L22 40 L10 28 L18 15 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);