
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MedicalArticleDetail from '@/components/medical-knowledge/MedicalArticleDetail';
import { useMedicalKnowledge } from '@/hooks/useMedicalKnowledge';
import LoadingState from '@/components/medical-knowledge/LoadingState';
import EmptyState from '@/components/medical-knowledge/EmptyState';

const MedicalArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { articles, isLoading } = useMedicalKnowledge();

  if (isLoading) {
    return <LoadingState message="Загрузка статьи..." />;
  }

  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <EmptyState
        title="Статья не найдена"
        description="Запрошенной медицинской статьи не существует или она временно недоступна."
      />
    );
  }

  return (
    <MedicalArticleDetail
      article={article}
      onBack={() => navigate('/medical-knowledge')}
    />
  );
};

export default MedicalArticleDetailPage;
