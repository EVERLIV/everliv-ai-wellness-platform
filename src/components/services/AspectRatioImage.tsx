
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface AspectRatioImageProps {
  src: string;
  alt: string;
  ratio?: number;
  className?: string;
}

const AspectRatioImage = ({ src, alt, ratio = 16/9, className = '' }: AspectRatioImageProps) => {
  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <AspectRatio ratio={ratio} className="bg-gray-100">
        <img 
          src={src} 
          alt={alt} 
          className="object-cover w-full h-full rounded-lg transition-transform duration-500 hover:scale-105"
        />
      </AspectRatio>
    </div>
  );
};

export default AspectRatioImage;
