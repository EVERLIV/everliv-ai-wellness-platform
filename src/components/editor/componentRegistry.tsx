
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import CTASection from "@/components/CTASection";
import HowItWorksSection from "@/components/HowItWorksSection";

// Define available components
export const componentRegistry: Record<
  string,
  {
    component: React.ComponentType<any>;
    label: string;
    icon: string;
    category: string;
    defaultProps: Record<string, any>;
  }
> = {
  "heading": {
    component: ({ text, level, align }) => {
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag className={`font-heading text-gray-900 ${align === "center" ? "text-center" : align === "right" ? "text-right" : ""}`}>{text}</Tag>;
    },
    label: "Heading",
    icon: "📝",
    category: "Basic",
    defaultProps: {
      text: "Enter heading text",
      level: 2,
      align: "left"
    }
  },
  "paragraph": {
    component: ({ text, size }) => {
      return <p className={`text-${size} text-gray-600`}>{text}</p>;
    },
    label: "Paragraph",
    icon: "📄",
    category: "Basic",
    defaultProps: {
      text: "Enter paragraph text here. This is a sample text that you can edit in the settings panel.",
      size: "base"
    }
  },
  "button": {
    component: ({ text, variant, size, href }) => {
      return <Button variant={variant} size={size} asChild>{href ? <a href={href}>{text}</a> : text}</Button>;
    },
    label: "Button",
    icon: "🔘",
    category: "Basic",
    defaultProps: {
      text: "Click me",
      variant: "default",
      size: "default",
      href: ""
    }
  },
  "image": {
    component: ({ src, alt, aspectRatio }) => {
      return (
        <AspectRatio ratio={parseInt(aspectRatio.split(":")[0]) / parseInt(aspectRatio.split(":")[1])}>
          <img 
            src={src || "https://placehold.co/600x400?text=Select+an+image"} 
            alt={alt} 
            className="object-cover w-full h-full rounded-md"
          />
        </AspectRatio>
      );
    },
    label: "Image",
    icon: "🖼️",
    category: "Media",
    defaultProps: {
      src: "",
      alt: "Image description",
      aspectRatio: "16:9"
    }
  },
  "card": {
    component: ({ title, description, content }) => {
      return (
        <Card>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>
            <p>{content}</p>
          </CardContent>
        </Card>
      );
    },
    label: "Card",
    icon: "🃏",
    category: "Layout",
    defaultProps: {
      title: "Card Title",
      description: "Card description goes here",
      content: "This is the main content of the card."
    }
  },
  "ctaSection": {
    component: () => <CTASection />,
    label: "CTA Section",
    icon: "📣",
    category: "Sections",
    defaultProps: {}
  },
  "howItWorks": {
    component: () => <HowItWorksSection />,
    label: "How It Works",
    icon: "🔄",
    category: "Sections",
    defaultProps: {}
  }
};

// Group components by category
export const componentCategories = Object.entries(componentRegistry).reduce((acc, [key, value]) => {
  if (!acc[value.category]) {
    acc[value.category] = [];
  }
  acc[value.category].push({
    type: key,
    ...value
  });
  return acc;
}, {} as Record<string, Array<{ type: string; label: string; icon: string; category: string }>>);
