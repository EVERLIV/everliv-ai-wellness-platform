import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Clock, Target } from 'lucide-react';

interface QuickStartOptionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  accuracy: string;
  onClick: () => void;
}

const QuickStartOption: React.FC<QuickStartOptionProps> = ({
  title,
  description,
  icon: Icon,
  duration,
  accuracy,
  onClick
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{accuracy}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Выбрать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartOption;