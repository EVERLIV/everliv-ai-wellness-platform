
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Eye, User } from 'lucide-react';
import { MedicalArticle } from '@/types/medical';

interface MedicalArticleDetailProps {
  article: MedicalArticle;
  onBack: () => void;
}

const getArticleTypeLabel = (type: string) => {
  const labels = {
    'symptom': 'Симптом',
    'disease': 'Заболевание',
    'guide': 'Руководство',
    'faq': 'FAQ',
    'doctor_info': 'О враче'
  };
  return labels[type as keyof typeof labels] || type;
};

const getArticleTypeColor = (type: string) => {
  const colors = {
    'symptom': 'bg-yellow-100 text-yellow-700',
    'disease': 'bg-red-100 text-red-700',
    'guide': 'bg-blue-100 text-blue-700',
    'faq': 'bg-green-100 text-green-700',
    'doctor_info': 'bg-purple-100 text-purple-700'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};

const MedicalArticleDetail: React.FC<MedicalArticleDetailProps> = ({ 
  article, 
  onBack 
}) => {
  // Конвертируем markdown-подобный контент в HTML-структуру
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3 first:mt-0">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-base font-semibold text-gray-800 mt-4 mb-2">
              {line.replace('### ', '')}
            </h3>
          );
        }
        if (line.startsWith('#### ')) {
          return (
            <h4 key={index} className="text-sm font-medium text-gray-700 mt-3 mb-2">
              {line.replace('#### ', '')}
            </h4>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="text-sm text-gray-600 mb-1">
              {line.replace('- ', '')}
            </li>
          );
        }
        if (line.startsWith('  * ')) {
          return (
            <li key={index} className="text-sm text-gray-600 mb-1 ml-4">
              {line.replace('  * ', '')}
            </li>
          );
        }
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }
        if (line.includes('**') && line.includes('**')) {
          // Обработка жирного текста
          const parts = line.split('**');
          return (
            <p key={index} className="text-sm text-gray-600 mb-2 leading-relaxed">
              {parts.map((part, partIndex) => 
                partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
              )}
            </p>
          );
        }
        return (
          <p key={index} className="text-sm text-gray-600 mb-2 leading-relaxed">
            {line}
          </p>
        );
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Навигация назад */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-0"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="text-sm">Назад к статьям</span>
        </Button>
      </div>

      {/* Заголовок статьи */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <Badge className={getArticleTypeColor(article.article_type)}>
            {getArticleTypeLabel(article.article_type)}
          </Badge>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.views_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(article.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-3">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-base text-gray-600 mb-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {article.author && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <User className="h-3 w-3" />
            <span>{article.author}</span>
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Содержание статьи */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="prose prose-sm max-w-none">
          {formatContent(article.content)}
        </div>

        {/* Медицинский дисклеймер */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Важно:</strong> Данная информация носит исключительно образовательный характер и не является медицинской консультацией. 
            Обязательно проконсультируйтесь с квалифицированным врачом перед принятием любых решений о лечении.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalArticleDetail;
