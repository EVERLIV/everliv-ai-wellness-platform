
import React, { ReactNode } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TabContentProps {
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
  icon?: ReactNode;
  variant?: "default" | "highlighted";
  className?: string;
  buttonVariant?: "default" | "outline" | "secondary";
}

const TabContent = ({ 
  title, 
  description, 
  linkTo, 
  linkText,
  icon,
  variant = "default",
  className,
  buttonVariant = "default"
}: TabContentProps) => {
  return (
    <Card className={cn(
      className,
      variant === "highlighted" && "border-2 border-everliv-600 shadow-md"
    )}>
      {variant === "highlighted" && (
        <div className="bg-everliv-600 text-white text-xs font-semibold px-3 py-1 absolute right-0 top-0 rounded-bl">
          Рекомендуемый
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon && <span className="text-everliv-600">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 mb-4">{description}</p>
        <Link to={linkTo}>
          <Button 
            variant={buttonVariant}
            className={cn(
              "w-full",
              buttonVariant === "outline" && "border-everliv-600 text-everliv-600 hover:bg-everliv-50"
            )}
          >
            {linkText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TabContent;
