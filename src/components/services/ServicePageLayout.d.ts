
import React from 'react';

export interface BenefitProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface ServiceHeroProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface ServicePageProps {
  hero: ServiceHeroProps;
  benefits: BenefitProps[];
  scientificBackground: React.ReactNode;
  protocols: React.ReactNode;
  casesStudies: React.ReactNode;
  visualElement?: React.ReactNode;
  faq?: { question: string; answer: React.ReactNode }[];
}
