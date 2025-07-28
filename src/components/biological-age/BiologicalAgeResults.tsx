
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
    <div className="space-y-4">
      {/* Основной результат */}
      <div className="bg-background border-l-4 border-l-primary">
        <div className="p-4">
          <div className="text-center space-y-3">
            <h3 className="text-sm font-medium text-foreground">Биологический возраст</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Хронологический</div>
                <div className="text-lg font-medium text-foreground">{results.chronological_age}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Биологический</div>
                <div className="text-lg font-medium text-primary">{results.biological_age}</div>
              </div>
            </div>

            <div className={`inline-block px-3 py-1 text-xs font-medium ${getAgeDifferenceColor()}`}>
              {getAgeDifferenceText()}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Точность</div>
                <div className="text-sm font-medium">{results.accuracy_percentage}%</div>
                <Progress value={results.accuracy_percentage} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Достоверность</div>
                <div className="text-sm font-medium">{results.confidence_level}%</div>
                <Progress value={results.confidence_level} className="h-1 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Анализ */}
      <div className="bg-background border-l-2 border-l-muted">
        <div className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <div className="w-1 h-4 bg-muted"></div>
            Анализ
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{results.analysis}</p>
        </div>
      </div>

      {/* Рекомендации */}
      {results.recommendations.length > 0 && (
        <div className="bg-background border-l-2 border-l-blue-500">
          <div className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500"></div>
              Рекомендации
            </h4>
            <div className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex gap-3 text-xs">
                  <div className="w-4 h-4 bg-blue-500/10 text-blue-600 flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Действия */}
      <div className="bg-background border-l-2 border-l-muted">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={exportToPDF} variant="outline" size="sm" className="h-8 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Экспорт
            </Button>
            <Button onClick={scheduleNextAnalysis} variant="outline" size="sm" className="h-8 text-xs">
              <Repeat className="h-3 w-3 mr-1" />
              Повтор
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiologicalAgeResults;
