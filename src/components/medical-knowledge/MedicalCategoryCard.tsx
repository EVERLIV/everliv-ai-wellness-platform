
import React from 'react';
import BaseCard from './BaseCard';
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
    <BaseCard
      title={category.name}
      description={category.description}
      icon={IconComponent}
      badge={{
        text: `${articleCount} статей`,
        variant: 'secondary'
      }}
      onClick={() => onSelect(category.id)}
    />
  );
};

export default MedicalCategoryCard;
