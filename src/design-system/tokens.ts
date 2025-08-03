/**
 * Design System Tokens
 * Centralized design tokens for the entire application
 */

export const designTokens = {
  // EVERLIV Brand Colors
  colors: {
    brand: {
      primary: 'hsl(160, 70%, 45%)',          // #10B981 - Основной зеленый как на картинке
      primaryDark: 'hsl(160, 70%, 35%)',     // #047857 - Темный зеленый  
      primaryLight: 'hsl(160, 70%, 55%)',    // #34D399 - Светлый зеленый
      secondary: 'hsl(160, 70%, 45%)',       // #10B981 - Зеленый вместо изумрудного
      accent: 'hsl(45, 95%, 55%)',           // #F59E0B - Желтый акцент как на картинке
      warning: 'hsl(45, 95%, 55%)',          // #F59E0B - Янтарный
      success: 'hsl(160, 70%, 45%)',         // #10B981 - Зеленый успех
      error: 'hsl(0, 85%, 60%)',             // #EF4444 - Красный ошибок
    },
    
    // Neutral Scale (Серые оттенки)
    neutral: {
      50: 'hsl(210, 20%, 98%)',             // #F8FAFC - Почти белый
      100: 'hsl(210, 20%, 96%)',            // #F1F5F9 - Очень светлый
      200: 'hsl(210, 20%, 90%)',            // #E2E8F0 - Светлый
      300: 'hsl(210, 20%, 80%)',            // #CBD5E1 - Светло-серый
      400: 'hsl(210, 20%, 60%)',            // #94A3B8 - Средний
      500: 'hsl(210, 20%, 45%)',            // #64748B - Темно-средний
      600: 'hsl(210, 20%, 35%)',            // #475569 - Темный
      700: 'hsl(210, 20%, 25%)',            // #334155 - Очень темный
      800: 'hsl(210, 20%, 15%)',            // #1E293B - Почти черный
      900: 'hsl(210, 20%, 10%)',            // #0F172A - Черный
    },
    
    // Semantic Colors
    semantic: {
      background: 'hsl(0, 0%, 100%)',       // #FFFFFF - Белый фон
      foreground: 'hsl(222, 84%, 4.9%)',    // #0A0A0B - Основной текст
      card: 'hsl(0, 0%, 100%)',             // #FFFFFF - Фон карточек
      popover: 'hsl(0, 0%, 100%)',          // #FFFFFF - Фон поповеров
      border: 'hsl(214, 32%, 91%)',         // #E1E7EF - Границы
      input: 'hsl(214, 32%, 91%)',          // #E1E7EF - Поля ввода
      ring: 'hsl(160, 70%, 45%)',           // Фокус outline - зеленый
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
    glow: '0 0 40px hsl(160, 70%, 45%, 0.3)',
    colored: '0 10px 30px -10px hsl(160, 70%, 45%, 0.3)',
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