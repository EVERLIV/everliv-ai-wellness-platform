
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface AnalyticsDisplayCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const AnalyticsDisplayCard: React.FC<AnalyticsDisplayCardProps> = ({
  title,
  icon: Icon,
  children,
  className = ""
}) => {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5 flex-shrink-0" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalyticsDisplayCard;
