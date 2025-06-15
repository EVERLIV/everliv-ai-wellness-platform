
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "EVERLIV - Платформа для оптимального здоровья и долголетия на базе ИИ",
  description = "EVERLIV — инновационная технологическая платформа для здоровья на базе искусственного интеллекта. Персонализированные рекомендации, анализ биомаркеров, протоколы долголетия и AI-врач для достижения оптимального здоровья.",
  keywords = "здоровье, долголетие, биохакинг, анализ крови, биомаркеры, персонализированная медицина, искусственный интеллект, ИИ врач, протоколы здоровья, превентивная медицина, антиэйджинг, оптимальное здоровье",
  image = "https://everliv.online/og-image.jpg",
  url = "https://everliv.online/",
  type = "website",
  noIndex = false
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
