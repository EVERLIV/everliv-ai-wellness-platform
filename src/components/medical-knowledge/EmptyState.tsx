
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action
}) => {
  return (
    <div className="text-center py-12 md:py-20">
      <div className="max-w-md mx-auto px-4">
        <Icon className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm md:text-base text-gray-500 mb-4">
          {description}
        </p>
        {action}
      </div>
    </div>
  );
};

export default EmptyState;
