
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MedicalArticle } from '@/types/medical';
import { Clock, Eye } from 'lucide-react';

interface MedicalArticleCardProps {
  article: MedicalArticle;
  onSelect: (articleId: string) => void;
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

const MedicalArticleCard: React.FC<MedicalArticleCardProps> = ({
  article,
  onSelect
}) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white group h-full"
      onClick={() => onSelect(article.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </CardTitle>
          <Badge className={getArticleTypeColor(article.article_type)}>
            {getArticleTypeLabel(article.article_type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {article.excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.views_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(article.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
          {article.author && (
            <span className="text-blue-600 font-medium">{article.author}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalArticleCard;
