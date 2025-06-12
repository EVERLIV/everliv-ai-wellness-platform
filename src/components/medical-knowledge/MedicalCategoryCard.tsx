
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MedicalCategory } from '@/types/medical';
import { 
  Stethoscope, 
  Heart, 
  BookOpen, 
  HelpCircle, 
  UserCheck,
  Activity
} from 'lucide-react';

interface MedicalCategoryCardProps {
  category: MedicalCategory;
  articleCount: number;
  onSelect: (categoryId: string) => void;
}

const iconMap = {
  'Stethoscope': Stethoscope,
  'Heart': Heart,
  'BookOpen': BookOpen,
  'HelpCircle': HelpCircle,
  'UserCheck': UserCheck,
};

const MedicalCategoryCard: React.FC<MedicalCategoryCardProps> = ({
  category,
  articleCount,
  onSelect
}) => {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Activity;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white group h-full"
      onClick={() => onSelect(category.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <IconComponent className="h-6 w-6 text-blue-600" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {articleCount} статей
          </Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 leading-relaxed">
          {category.description}
        </p>
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

export default MedicalCategoryCard;
