
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
    <Card className={`mobile-card ${className}`}>
      <CardHeader className="mobile-card-header">
        <CardTitle className="mobile-heading-secondary flex items-center gap-2">
          <Icon className="h-5 w-5 flex-shrink-0" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="mobile-card-content">
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalyticsDisplayCard;
