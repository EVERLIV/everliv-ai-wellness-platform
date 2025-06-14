
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface BaseCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children?: React.ReactNode;
  onClick?: () => void;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50',
  badge,
  children,
  onClick
}) => {
  return (
    <Card 
      className={`h-full border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer group' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${iconBgColor}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div className="flex-1">
              <CardTitle className={`text-lg leading-tight ${
                onClick ? 'group-hover:text-blue-600 transition-colors' : ''
              }`}>
                {title}
              </CardTitle>
              {description && (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
          {badge && (
            <Badge variant={badge.variant || 'secondary'} className="text-xs shrink-0">
              {badge.text}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {children && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default BaseCard;
