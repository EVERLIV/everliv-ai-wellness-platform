import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Heading Component
const headingVariants = cva(
  "font-semibold tracking-tight",
  {
    variants: {
      level: {
        1: "text-4xl lg:text-5xl xl:text-6xl leading-tight",
        2: "text-3xl lg:text-4xl leading-tight",
        3: "text-2xl lg:text-3xl leading-snug",
        4: "text-xl lg:text-2xl leading-snug",
        5: "text-lg lg:text-xl leading-normal",
        6: "text-base lg:text-lg leading-normal",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        brand: "bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent",
        accent: "text-accent-foreground",
      },
    },
    defaultVariants: {
      level: 1,
      variant: "default",
    },
  }
);

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = ({ level, variant, className, children, ...props }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return React.createElement(
    Tag,
    {
      className: cn(headingVariants({ level, variant }), className),
      ...props,
    },
    children
  );
};

// Text Component
const textVariants = cva(
  "leading-relaxed",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        brand: "text-brand-primary",
        accent: "text-accent-foreground",
        success: "text-brand-success",
        warning: "text-brand-warning",
        error: "text-brand-error",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "default",
      weight: "normal",
    },
  }
);

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export const Text = ({ size, variant, weight, as = "p", className, children, ...props }: TextProps) => {
  const Tag = as;
  
  return React.createElement(
    Tag,
    {
      className: cn(textVariants({ size, variant, weight }), className),
      ...props,
    },
    children
  );
};

// Display Component for Hero Text
export const Display = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight",
      "bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent",
      className
    )}
    {...props}
  >
    {children}
  </h1>
);

// Code Component
export const Code = ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <code
    className={cn(
      "relative rounded bg-muted px-2 py-1 font-mono text-sm font-medium",
      "border border-border",
      className
    )}
    {...props}
  >
    {children}
  </code>
);

// Quote Component
export const Quote = ({ className, children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className={cn(
      "border-l-4 border-brand-primary pl-6 italic text-lg",
      "text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </blockquote>
);

// Link Component
export const Link = ({ className, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    className={cn(
      "text-brand-primary underline-offset-4 hover:underline",
      "transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
      className
    )}
    {...props}
  >
    {children}
  </a>
);

import React from "react";