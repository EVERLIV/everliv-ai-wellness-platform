
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
    <div className={`bg-surface border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="p-content border-b border-border bg-muted/30">
        <h3 className="text-base font-semibold flex items-center gap-2 text-primary">
          <Icon className="h-5 w-5 flex-shrink-0" />
          {title}
        </h3>
      </div>
      <div className="p-content">
        {children}
      </div>
    </div>
  );
};

export default AnalyticsDisplayCard;
