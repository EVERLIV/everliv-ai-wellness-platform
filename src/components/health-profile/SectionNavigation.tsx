
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Section {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

interface SectionNavigationProps {
  sections: Section[];
  currentSection: number;
  onSectionChange: (index: number) => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  sections,
  currentSection,
  onSectionChange
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-8">
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Button
            key={index}
            variant={index === currentSection ? "default" : "outline"}
            size="sm"
            onClick={() => onSectionChange(index)}
            className="flex flex-col gap-1 h-auto py-3"
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs text-center">{section.title}</span>
            {index < currentSection && (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default SectionNavigation;
