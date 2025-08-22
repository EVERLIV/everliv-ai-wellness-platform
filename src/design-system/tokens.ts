/**
 * Design System Tokens
 * Centralized design tokens for the entire application
 */

export const designTokens = {
  // EVA Health App Colors
  colors: {
    eva: {
      // Primary blue gradient colors from screenshots
      primary: 'hsl(217, 91%, 60%)', // Main blue
      primaryDark: 'hsl(217, 91%, 45%)',
      primaryLight: 'hsl(217, 91%, 75%)',
      
      // Health status colors
      critical: 'hsl(0, 85%, 60%)', // Red for critical values
      warning: 'hsl(45, 95%, 55%)', // Orange for warnings
      normal: 'hsl(140, 60%, 45%)', // Green for normal values
      optimal: 'hsl(160, 70%, 40%)', // Darker green for optimal
      
      // UI colors
      background: 'hsl(217, 33%, 97%)', // Light blue-gray background
      surface: 'hsl(217, 33%, 99%)', // Card backgrounds
      accent: 'hsl(285, 85%, 65%)', // Purple accent
      
      // Text colors
      textPrimary: 'hsl(217, 25%, 15%)', // Dark blue-gray
      textSecondary: 'hsl(217, 15%, 45%)', // Medium blue-gray
      textMuted: 'hsl(217, 15%, 65%)', // Light blue-gray
    },
    
    // Legacy brand colors for compatibility
    brand: {
      primary: 'hsl(217, 91%, 60%)',
      primaryDark: 'hsl(217, 91%, 45%)',
      primaryLight: 'hsl(217, 91%, 75%)',
      secondary: 'hsl(160, 55%, 48%)',
      accent: 'hsl(285, 85%, 65%)',
      warning: 'hsl(45, 95%, 55%)',
      success: 'hsl(140, 60%, 45%)',
      error: 'hsl(0, 85%, 60%)',
    },
    
    // Neutral Scale
    neutral: {
      50: 'hsl(210, 20%, 98%)',
      100: 'hsl(210, 20%, 96%)',
      200: 'hsl(210, 20%, 90%)',
      300: 'hsl(210, 20%, 80%)',
      400: 'hsl(210, 20%, 60%)',
      500: 'hsl(210, 20%, 45%)',
      600: 'hsl(210, 20%, 35%)',
      700: 'hsl(210, 20%, 25%)',
      800: 'hsl(210, 20%, 15%)',
      900: 'hsl(210, 20%, 10%)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',       // 16px
    '3xl': '1.5rem',     // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
    glow: '0 0 40px hsl(210, 85%, 45%, 0.3)',
    colored: '0 10px 30px -10px hsl(210, 85%, 45%, 0.3)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Z-Index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skiplink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignTokens = typeof designTokens;