
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";
import { MedicalAnalysisResults as ResultsType } from "@/services/ai/medical-analysis";

interface MedicalAnalysisResultsProps {
  results: ResultsType | null;
  isAnalyzing: boolean;
  apiError?: string | null;
  onBack: () => void;
}

const MedicalAnalysisResults = ({ results, isAnalyzing, apiError, onBack }: MedicalAnalysisResultsProps) => {
  if (apiError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка анализа</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
        <div className="pt-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Вернуться к вводу данных
          </Button>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-amber-500" />;
      default:
        return <Minus className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'low':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'Высокий риск';
      case 'medium':
        return 'Средний риск';
      default:
        return 'Низкий риск';
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и краткая информация */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Результаты анализа</h2>
          <p className="text-gray-600">{results.analysisType}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getRiskLevelColor(results.riskLevel)} className="px-3 py-1">
            {getRiskLevelText(results.riskLevel)}
          </Badge>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>
      </div>

      {/* Краткое резюме */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Краткое резюме
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{results.summary}</p>
        </CardContent>
      </Card>

      {/* Таблица показателей */}
      <Card>
        <CardHeader>
          <CardTitle>Детальный анализ показателей</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Показатель</TableHead>
                <TableHead>Значение</TableHead>
                <TableHead>Норма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Рекомендация</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.markers.map((marker, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{marker.name}</TableCell>
                  <TableCell className="font-semibold">{marker.value}</TableCell>
                  <TableCell className="text-gray-500">{marker.normalRange}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${getStatusColor(marker.status)}`}>
                      {getStatusIcon(marker.status)}
                      <span className="text-xs font-medium">
                        {marker.status === 'high' ? 'Выше нормы' : 
                         marker.status === 'low' ? 'Ниже нормы' : 'Норма'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-gray-700">{marker.recommendation}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Рекомендуемые добавки */}
      {results.supplements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💊 Рекомендуемые добавки и препараты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.supplements.map((supplement, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <div className="font-semibold text-gray-900">{supplement.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{supplement.reason}</div>
                  <div className="text-xs text-blue-600 mt-2 font-medium">
                    Дозировка: {supplement.dosage}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Рекомендуемые дополнительные анализы */}
      {results.followUpTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔬 Рекомендуемые дополнительные анализы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.followUpTests.map((test, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{test}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Общие рекомендации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Общие рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{results.generalRecommendation}</p>
        </CardContent>
      </Card>

      {/* Предупреждение о консультации врача */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Важно</AlertTitle>
        <AlertDescription>
          Данный анализ предоставлен только в информационных целях. 
          Обязательно проконсультируйтесь с квалифицированным врачом для получения 
          профессиональной медицинской консультации и назначения лечения.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MedicalAnalysisResults;
