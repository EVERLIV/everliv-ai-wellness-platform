
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface BaseCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline';
    className?: string;
  };
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50',
  badge,
  onClick,
  children,
  className = ''
}) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white group h-full ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {Icon && (
            <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
          )}
          {badge && (
            <Badge variant={badge.variant || 'secondary'} className={badge.className || 'text-xs'}>
              {badge.text}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {description}
          </p>
        )}
        {children}
        <div className="flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3">
          <span>Подробнее</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseCard;
