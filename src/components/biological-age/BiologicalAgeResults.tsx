
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Target, 
  FileText,
  Download,
  Share2,
  Trophy,
  Repeat
} from 'lucide-react';
import { BiologicalAgeResult } from '@/types/biologicalAge';
import { toast } from 'sonner';

interface BiologicalAgeResultsProps {
  results: BiologicalAgeResult;
}

const BiologicalAgeResults: React.FC<BiologicalAgeResultsProps> = ({ results }) => {
  const getAgeDifferenceColor = () => {
    if (results.age_difference <= -5) return 'text-green-600 bg-green-50';
    if (results.age_difference <= -2) return 'text-green-500 bg-green-50';
    if (results.age_difference <= 2) return 'text-yellow-600 bg-yellow-50';
    if (results.age_difference <= 5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAgeDifferenceIcon = () => {
    if (results.age_difference < 0) {
      return <TrendingDown className="h-6 w-6 text-green-600" />;
    } else if (results.age_difference > 0) {
      return <TrendingUp className="h-6 w-6 text-red-600" />;
    }
    return <Target className="h-6 w-6 text-yellow-600" />;
  };

  const getAgeDifferenceText = () => {
    const abs = Math.abs(results.age_difference);
    if (results.age_difference < 0) {
      return `На ${abs} лет моложе`;
    } else if (results.age_difference > 0) {
      return `На ${abs} лет старше`;
    }
    return 'Соответствует возрасту';
  };

  const exportToPDF = () => {
    // Будет реализовано позже
    console.log('Export to PDF');
    toast.success('Экспорт в PDF будет доступен в следующем обновлении');
  };

  const shareResults = () => {
    const shareText = `Мой биологический возраст: ${results.biological_age} лет (хронологический: ${results.chronological_age} лет)`;
    if (navigator.share) {
      navigator.share({
        title: 'Результаты анализа биологического возраста',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Результат скопирован в буфер обмена');
    }
  };

  const scheduleNextAnalysis = () => {
    toast.success('Напоминание настроено на повторный анализ через 6 месяцев');
  };

  return (
    <div className="space-y-3">
      {/* Основной результат */}
      <div className="border-2 border-blue-200 bg-white">
        <div className="p-3 text-center">
          <h3 className="bio-heading-tertiary mb-3">Ваш биологический возраст</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="bio-text-small text-muted-foreground">Хронологический</span>
              </div>
              <div className="bio-heading-secondary text-foreground">
                {results.chronological_age} лет
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Heart className="h-4 w-4 text-primary" />
                <span className="bio-text-small text-muted-foreground">Биологический</span>
              </div>
              <div className="bio-heading-secondary text-primary">
                {results.biological_age} лет
              </div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-1 px-3 py-1 border ${getAgeDifferenceColor()}`}>
            {getAgeDifferenceIcon()}
            <span className="bio-text-body font-medium">
              {getAgeDifferenceText()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t">
            <div className="text-center">
              <div className="bio-text-caption text-muted-foreground mb-1">Точность расчета</div>
              <div className="bio-text-body font-medium">{results.accuracy_percentage}%</div>
              <Progress value={results.accuracy_percentage} className="h-1 mt-1" />
            </div>
            
            <div className="text-center">
              <div className="bio-text-caption text-muted-foreground mb-1">Уровень достоверности</div>
              <div className="bio-text-body font-medium">{results.confidence_level}%</div>
              <Progress value={results.confidence_level} className="h-1 mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Анализ */}
      <div className="border border-gray-200 bg-white">
        <div className="p-3 border-b border-gray-200">
          <h4 className="bio-text-body font-medium flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Детальный анализ
          </h4>
        </div>
        <div className="p-3">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap bio-text-small">{results.analysis}</p>
          </div>
        </div>
      </div>

      {/* Рекомендации */}
      {results.recommendations.length > 0 && (
        <div className="border border-gray-200 bg-white">
          <div className="p-3 border-b border-gray-200">
            <h4 className="bio-text-body font-medium flex items-center gap-1">
              <Target className="h-4 w-4" />
              Рекомендации по улучшению
            </h4>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground border flex items-center justify-center bio-text-caption font-medium">
                    {index + 1}
                  </div>
                  <p className="bio-text-small">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Дополнительная информация */}
      <div className="bg-amber-50 border border-amber-200">
        <div className="p-3">
          <div className="space-y-2">
            <h4 className="bio-text-body font-medium text-amber-900">Важные замечания:</h4>
            <ul className="bio-text-small text-amber-800 space-y-1 list-disc list-inside">
              <li>Результат не является медицинским диагнозом</li>
              <li>Консультируйтесь с врачом перед принятием решений о здоровье</li>
              <li>Рекомендуется обновлять данные каждые 6-12 месяцев</li>
              <li>Точность увеличивается с количеством предоставленных анализов</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Действия */}
      <div className="border border-gray-200 bg-white">
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={exportToPDF} variant="outline" className="h-8 bio-text-caption px-2">
              <Download className="h-3 w-3 mr-1" />
              PDF
            </Button>
            <Button onClick={scheduleNextAnalysis} variant="outline" className="h-8 bio-text-caption px-2">
              <Trophy className="h-3 w-3 mr-1" />
              Напоминание
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiologicalAgeResults;
