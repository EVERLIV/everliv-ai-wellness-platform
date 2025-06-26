
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  BookOpen, 
  Clock, 
  Heart, 
  Info, 
  TestTube,
  TrendingUp,
  Calendar,
  AlertTriangle
} from "lucide-react";

interface BloodMarker {
  name: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  recommendation: string;
  education: string;
  lifestyle: string;
}

interface Supplement {
  name: string;
  reason: string;
  dosage: string;
  duration: string;
}

interface EnhancedBloodAnalysisResultsProps {
  results: {
    markers: BloodMarker[];
    supplements: Supplement[];
    generalRecommendation: string;
    riskFactors: string[];
    followUpTests: string[];
    urgencyLevel: 'low' | 'medium' | 'high';
    nextCheckup: string;
  } | null;
  isAnalyzing: boolean;
  apiError?: string | null;
  onBack: () => void;
}

const getUrgencyColor = (level: string) => {
  switch (level) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'high': return <TrendingUp className="h-4 w-4 text-red-500" />;
    case 'low': return <TrendingUp className="h-4 w-4 text-amber-500 rotate-180" />;
    default: return <Heart className="h-4 w-4 text-green-500" />;
  }
};

const EnhancedBloodAnalysisResults = ({ 
  results, 
  isAnalyzing, 
  apiError, 
  onBack 
}: EnhancedBloodAnalysisResultsProps) => {
  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка анализа</AlertTitle>
          <AlertDescription>
            {apiError}
          </AlertDescription>
        </Alert>
        <div className="pt-4">
          <Button variant="outline" onClick={onBack}>
            Вернуться к вводу данных
          </Button>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const abnormalMarkers = results.markers.filter(marker => marker.status !== 'normal');

  return (
    <div className="space-y-6">
      {/* Urgency Alert */}
      {results.urgencyLevel === 'high' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Требуется внимание врача</AlertTitle>
          <AlertDescription>
            Обнаружены показатели, требующие консультации специалиста в ближайшее время.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Статус анализа</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={getUrgencyColor(results.urgencyLevel)}>
                {results.urgencyLevel === 'high' ? 'Высокий приоритет' : 
                 results.urgencyLevel === 'medium' ? 'Средний приоритет' : 'Норма'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Отклонения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {abnormalMarkers.length}/{results.markers.length}
            </div>
            <p className="text-xs text-muted-foreground">показателей вне нормы</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Следующая проверка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{results.nextCheckup}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Результаты</TabsTrigger>
          <TabsTrigger value="education">Образование</TabsTrigger>
          <TabsTrigger value="supplements">Добавки</TabsTrigger>
          <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Анализ биомаркеров
            </h3>
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
                    <TableCell className={`font-medium ${
                      marker.status === 'high' ? 'text-red-500' : 
                      marker.status === 'low' ? 'text-amber-500' : 'text-green-500'
                    }`}>
                      {marker.value}
                    </TableCell>
                    <TableCell className="text-gray-500">{marker.normalRange}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(marker.status)}
                        <span className="capitalize">{
                          marker.status === 'high' ? 'Выше нормы' :
                          marker.status === 'low' ? 'Ниже нормы' : 'Норма'
                        }</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm">{marker.recommendation}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Образовательная информация
            </h3>
            <div className="space-y-4">
              {results.markers.map((marker, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{marker.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Что это такое:</h4>
                      <p className="text-sm text-gray-600">{marker.education}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Рекомендации по образу жизни:</h4>
                      <p className="text-sm text-gray-600">{marker.lifestyle}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="supplements" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Рекомендуемые добавки</h3>
            {results.supplements.length > 0 ? (
              <div className="space-y-4">
                {results.supplements.map((supplement, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">{supplement.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium text-sm">Обоснование:</span>
                        <p className="text-sm text-gray-600 mt-1">{supplement.reason}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Дозировка:</span>
                        <p className="text-sm text-gray-600 mt-1">{supplement.dosage}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Продолжительность:</span>
                        <p className="text-sm text-gray-600 mt-1">{supplement.duration}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">Нет специальных рекомендаций по добавкам для данных результатов анализа.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {/* General Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Общие рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{results.generalRecommendation}</p>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            {results.riskFactors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Факторы риска
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="min-w-4 mt-1">•</div>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Follow-up Tests */}
            {results.followUpTests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Рекомендуемые дополнительные анализы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.followUpTests.map((test, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="min-w-4 mt-1">•</div>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4">
        <Button variant="outline" onClick={onBack}>
          Вернуться к вводу данных
        </Button>
      </div>
    </div>
  );
};

export default EnhancedBloodAnalysisResults;
