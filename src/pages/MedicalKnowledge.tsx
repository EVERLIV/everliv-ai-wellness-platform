
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import MedicalKnowledgeWithAI from '@/components/medical-knowledge/MedicalKnowledgeWithAI';

const MedicalKnowledge = () => {
  return (
    <>
      <Helmet>
        <title>Медицинская база знаний с AI поиском - EverLiv</title>
        <meta name="description" content="Исследуйте медицинские статьи и найдите специалистов с помощью традиционного и семантического поиска на базе ИИ" />
        <meta name="keywords" content="медицинские статьи, врачи специалисты, семантический поиск, AI поиск, здоровье" />
      </Helmet>
      
      <PageLayoutWithHeader>
        <MedicalKnowledgeWithAI />
      </PageLayoutWithHeader>
    </>
  );
};

export default MedicalKnowledge;
