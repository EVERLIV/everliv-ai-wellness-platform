
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Загрузка...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 py-8',
    md: 'h-10 w-10 md:h-12 md:w-12 py-12 md:py-20',
    lg: 'h-12 w-12 md:h-16 md:w-16 py-16 md:py-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl'
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} animate-spin text-blue-600 mx-auto mb-4`} />
        <p className={`${textSizes[size]} text-gray-600`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
