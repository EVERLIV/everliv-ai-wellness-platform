import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Activity, Brain, Coffee, Moon, Target, FileText, TestTube } from 'lucide-react';

interface SectionNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  completedSections: string[];
}

const sections = [
  { id: 'personal', label: 'Личные данные', icon: User },
  { id: 'physical', label: 'Физическое здоровье', icon: Activity },
  { id: 'mental', label: 'Психическое здоровье', icon: Brain },
  { id: 'lifestyle', label: 'Образ жизни', icon: Coffee },
  { id: 'sleep', label: 'Сон', icon: Moon },
  { id: 'goals', label: 'Цели здоровья', icon: Target },
  { id: 'medical', label: 'Медицинская история', icon: FileText },
  { id: 'lab', label: 'Лабораторные данные', icon: TestTube },
];

const SectionNavigation: React.FC<SectionNavigationProps> = ({ 
  currentSection, 
  onSectionChange,
  completedSections 
}) => {
  return (
    <div className="flex items-center justify-between overflow-x-auto pb-4">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={currentSection === section.id ? 'default' : 'outline'}
          onClick={() => onSectionChange(section.id)}
          className="flex-shrink-0 min-w-[120px]"
        >
          <section.icon className="h-4 w-4 mr-2" />
          {section.label}
        </Button>
      ))}
    </div>
  );
};

export default SectionNavigation;
