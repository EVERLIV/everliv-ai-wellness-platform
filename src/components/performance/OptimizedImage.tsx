import React, { useState, useCallback } from 'react';
import { optimizeImage } from '@/utils/performance';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  fallback?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width,
  height,
  quality = 80,
  lazy = true,
  fallback = '/placeholder.svg',
  className = '',
  alt = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(optimizeImage(src, width, quality));

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setImageSrc(fallback);
  }, [fallback]);

  const imageClassName = `
    transition-opacity duration-300
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    ${className}
  `.trim();

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={imageClassName}
      loading={lazy ? 'lazy' : 'eager'}
      onLoad={handleLoad}
      onError={handleError}
      decoding="async"
    />
  );
};

export default React.memo(OptimizedImage);