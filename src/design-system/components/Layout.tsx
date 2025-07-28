import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Container Component
const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md", 
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
      },
      padding: {
        none: "px-0",
        sm: "px-4 sm:px-6",
        md: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
      },
    },
    defaultVariants: {
      size: "xl",
      padding: "md",
    },
  }
);

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

export const Container = ({ size, padding, className, ...props }: ContainerProps) => (
  <div className={cn(containerVariants({ size, padding }), className)} {...props} />
);

// Section Component
const sectionVariants = cva(
  "relative",
  {
    variants: {
      spacing: {
        none: "py-0",
        sm: "py-8 sm:py-12",
        md: "py-12 sm:py-16 lg:py-20",
        lg: "py-16 sm:py-20 lg:py-24",
        xl: "py-20 sm:py-24 lg:py-32",
      },
      background: {
        default: "bg-background",
        muted: "bg-muted/30",
        accent: "bg-gradient-to-br from-accent/10 to-brand-secondary/10",
        brand: "bg-gradient-to-br from-brand-primary/10 to-brand-accent/10",
        glass: "bg-white/5 backdrop-blur-sm border border-white/10",
      },
    },
    defaultVariants: {
      spacing: "md",
      background: "default",
    },
  }
);

interface SectionProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {}

export const Section = ({ spacing, background, className, ...props }: SectionProps) => (
  <section className={cn(sectionVariants({ spacing, background }), className)} {...props} />
);

// Grid Component
const gridVariants = cva(
  "grid w-full",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
        auto: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
      },
      gap: {
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "md",
    },
  }
);

interface GridProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {}

export const Grid = ({ cols, gap, className, ...props }: GridProps) => (
  <div className={cn(gridVariants({ cols, gap }), className)} {...props} />
);

// Stack Component
const stackVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        col: "flex-col",
        "row-reverse": "flex-row-reverse",
        "col-reverse": "flex-col-reverse",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
      wrap: {
        true: "flex-wrap",
        false: "flex-nowrap",
      },
    },
    defaultVariants: {
      direction: "col",
      align: "stretch",
      justify: "start",
      gap: "md",
      wrap: false,
    },
  }
);

interface StackProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {}

export const Stack = ({ direction, align, justify, gap, wrap, className, ...props }: StackProps) => (
  <div className={cn(stackVariants({ direction, align, justify, gap, wrap }), className)} {...props} />
);

// Spacer Component
export const Spacer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1", className)} {...props} />
);

// Center Component
export const Center = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-center", className)} {...props}>
    {children}
  </div>
);

// Box Component - Generic container
const boxVariants = cva(
  "relative",
  {
    variants: {
      p: {
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      m: {
        none: "m-0",
        sm: "m-2", 
        md: "m-4",
        lg: "m-6",
        xl: "m-8",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },
    },
    defaultVariants: {
      p: "none",
      m: "none",
      rounded: "none",
      shadow: "none",
    },
  }
);

interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {}

export const Box = ({ p, m, rounded, shadow, className, ...props }: BoxProps) => (
  <div className={cn(boxVariants({ p, m, rounded, shadow }), className)} {...props} />
);