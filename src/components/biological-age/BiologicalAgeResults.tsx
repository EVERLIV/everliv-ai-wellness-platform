
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
  Download
} from 'lucide-react';
import { BiologicalAgeResult } from '@/types/biologicalAge';

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
  };

  return (
    <div className="space-y-6">
      {/* Основной результат */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ваш биологический возраст</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">Хронологический</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {results.chronological_age} лет
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Биологический</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {results.biological_age} лет
              </div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getAgeDifferenceColor()}`}>
            {getAgeDifferenceIcon()}
            <span className="font-semibold">
              {getAgeDifferenceText()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Точность расчета</div>
              <div className="text-lg font-semibold">{results.accuracy_percentage}%</div>
              <Progress value={results.accuracy_percentage} className="h-1 mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Уровень достоверности</div>
              <div className="text-lg font-semibold">{results.confidence_level}%</div>
              <Progress value={results.confidence_level} className="h-1 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Анализ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Детальный анализ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{results.analysis}</p>
          </div>
        </CardContent>
      </Card>

      {/* Рекомендации */}
      {results.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Рекомендации по улучшению
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Дополнительная информация */}
      <Card className="bg-amber-50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-900">Важные замечания:</h4>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Результат не является медицинским диагнозом</li>
              <li>Консультируйтесь с врачом перед принятием решений о здоровье</li>
              <li>Рекомендуется обновлять данные каждые 6-12 месяцев</li>
              <li>Точность увеличивается с количеством предоставленных анализов</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Действия */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={exportToPDF} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Экспорт в PDF
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Новый расчет
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiologicalAgeResults;
