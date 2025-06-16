
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import MedicalKnowledgeWithAI from '@/components/medical-knowledge/MedicalKnowledgeWithAI';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const MedicalKnowledge = () => {
  const headerComponent = (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 rounded-none">
      <CardHeader className="text-center py-8">
        <CardTitle className="flex items-center justify-center gap-3 text-3xl">
          <Brain className="h-10 w-10 text-blue-600" />
          Медицинская база знаний
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Исследуйте медицинские статьи и найдите специалистов с помощью AI поиска
        </p>
      </CardHeader>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Медицинская база знаний с AI поиском - EverLiv</title>
        <meta name="description" content="Исследуйте медицинские статьи и найдите специалистов с помощью традиционного и семантического поиска на базе ИИ" />
        <meta name="keywords" content="медицинские статьи, врачи специалисты, семантический поиск, AI поиск, здоровье" />
      </Helmet>
      
      <PageLayoutWithHeader headerComponent={headerComponent}>
        <MedicalKnowledgeWithAI />
      </PageLayoutWithHeader>
    </>
  );
};

export default MedicalKnowledge;
