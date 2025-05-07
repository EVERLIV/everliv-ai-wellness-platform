
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  },
  // New components
  "container": {
    component: ({ maxWidth, padding, content, align }) => {
      return (
        <div className={`mx-auto ${maxWidth} ${padding} ${align === "center" ? "text-center" : align === "right" ? "text-right" : ""}`}>
          {content || "Container content goes here"}
        </div>
      );
    },
    label: "Container",
    icon: "📦",
    category: "Layout",
    defaultProps: {
      maxWidth: "max-w-7xl",
      padding: "px-4 py-8",
      content: "Add components inside this container",
      align: "left"
    }
  },
  "separator": {
    component: ({ orientation }) => {
      return <Separator orientation={orientation} className="my-4" />;
    },
    label: "Separator",
    icon: "➖",
    category: "Basic",
    defaultProps: {
      orientation: "horizontal"
    }
  },
  "spacer": {
    component: ({ height }) => {
      return <div style={{ height: `${height}px` }}></div>;
    },
    label: "Spacer",
    icon: "↕️",
    category: "Layout",
    defaultProps: {
      height: 40
    }
  },
  "grid": {
    component: ({ columns, gap }) => {
      return (
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap}`}>
          <div className="bg-gray-100 p-4 rounded">Grid Item 1</div>
          <div className="bg-gray-100 p-4 rounded">Grid Item 2</div>
          {columns > 2 && <div className="bg-gray-100 p-4 rounded">Grid Item 3</div>}
          {columns > 3 && <div className="bg-gray-100 p-4 rounded">Grid Item 4</div>}
        </div>
      );
    },
    label: "Grid Layout",
    icon: "🔲",
    category: "Layout",
    defaultProps: {
      columns: 2,
      gap: 4
    }
  },
  "feature-card": {
    component: ({ title, description, iconName }) => {
      return (
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">{iconName || "✨"}</span>
            </div>
            <CardTitle>{title || "Feature Title"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{description || "Feature description goes here"}</p>
          </CardContent>
        </Card>
      );
    },
    label: "Feature Card",
    icon: "✨",
    category: "Content",
    defaultProps: {
      title: "Feature Title",
      description: "Describe the feature and benefits it provides to your users.",
      iconName: "✨"
    }
  },
  "testimonial": {
    component: ({ quote, author, role, avatar }) => {
      return (
        <Card>
          <CardContent className="pt-6 pb-2">
            <div className="mb-4 text-lg italic text-gray-700">"{quote}"</div>
          </CardContent>
          <CardFooter className="flex items-center border-t pt-4">
            {avatar && (
              <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                <img src={avatar} alt={author} className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <h4 className="font-medium">{author}</h4>
              {role && <p className="text-sm text-gray-500">{role}</p>}
            </div>
          </CardFooter>
        </Card>
      );
    },
    label: "Testimonial",
    icon: "💬",
    category: "Content",
    defaultProps: {
      quote: "This product has completely transformed how we work. I can't imagine going back!",
      author: "Jane Smith",
      role: "CEO at Company",
      avatar: ""
    }
  },
  "hero": {
    component: ({ title, subtitle, buttonText, buttonLink, align, bgColor }) => {
      return (
        <div className={`py-20 px-6 ${bgColor}`}>
          <div className={`max-w-3xl mx-auto ${align === "center" ? "text-center" : ""}`}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">{title}</h1>
            <p className="text-xl text-gray-600 mb-8">{subtitle}</p>
            {buttonText && (
              <Button size="lg" asChild>
                <a href={buttonLink || "#"}>{buttonText}</a>
              </Button>
            )}
          </div>
        </div>
      );
    },
    label: "Hero Section",
    icon: "🦸",
    category: "Sections",
    defaultProps: {
      title: "Your Catchy Headline Here",
      subtitle: "A supporting subtitle that explains your value proposition in more detail.",
      buttonText: "Get Started",
      buttonLink: "#",
      align: "center",
      bgColor: "bg-gray-50"
    }
  },
  "pricing-card": {
    component: ({ planName, price, period, features, buttonText, highlighted }) => {
      const featuresList = features.split('\n').filter(Boolean);
      
      return (
        <Card className={`overflow-hidden ${highlighted ? 'border-primary shadow-lg' : ''}`}>
          {highlighted && (
            <div className="bg-primary text-primary-foreground text-center py-1 text-sm">
              Most Popular
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl">{planName}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">{price}</span>
              {period && <span className="text-gray-500 ml-1">/{period}</span>}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {featuresList.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={highlighted ? "default" : "outline"}>
              {buttonText}
            </Button>
          </CardFooter>
        </Card>
      );
    },
    label: "Pricing Card",
    icon: "💲",
    category: "Content",
    defaultProps: {
      planName: "Standard Plan",
      price: "$49",
      period: "month",
      features: "Feature one\nFeature two\nFeature three",
      buttonText: "Choose Plan",
      highlighted: false
    }
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
