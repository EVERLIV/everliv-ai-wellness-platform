import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useBiologicalAgeHistory } from '@/hooks/useBiologicalAgeHistory';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const BiologicalAgeHistoryCard = () => {
  const { snapshots, isLoading } = useBiologicalAgeHistory();

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="h-5 w-5 text-blue-500" />
          <span className="bio-heading-tertiary">История биовозраста</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (snapshots.length === 0) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="h-5 w-5 text-blue-500" />
        <span className="bio-heading-tertiary">История биовозраста</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="bio-text-body text-muted-foreground">Пока нет данных</p>
            <p className="bio-text-small text-muted-foreground mt-1">
              Рассчитайте биологический возраст для начала отслеживания
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latest = snapshots[0];
  const previous = snapshots[1];
  const trend = previous ? latest.biological_age - previous.biological_age : 0;

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-red-600';
    if (trend < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className="bio-heading-tertiary">История биовозраста</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Текущий результат */}
        <div className="bg-blue-50/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="bio-text-body text-muted-foreground">Последний расчет</span>
            <span className="bio-text-small text-muted-foreground">
              {formatDistanceToNow(new Date(latest.created_at), { 
                addSuffix: true,
                locale: ru 
              })}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(latest.biological_age)} лет
              </div>
              <div className="text-sm text-gray-600 break-words">
                {latest.age_difference > 0 ? '+' : ''}{Math.round(latest.age_difference)} к хронологическому
              </div>
            </div>
            {previous && (
              <div className="flex items-center gap-2 pt-1">
                {getTrendIcon(trend)}
                <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                  {trend > 0 ? '+' : ''}{Math.round(trend * 10) / 10}
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs px-2 py-1 h-auto">
              {latest.biomarkers_count} показателей
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-1 h-auto">
              {latest.accuracy_percentage}% точность
            </Badge>
          </div>
        </div>

        {/* Показатели последнего расчета */}
        {latest.biomarker_history && latest.biomarker_history.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Показатели:</h4>
            <div className="grid gap-2">
              {latest.biomarker_history.map((biomarker, index) => (
                <div 
                  key={index}
                  className="text-xs bg-gray-50 px-2 py-1 border border-gray-200"
                >
                  <span className="font-medium">{biomarker.biomarker_name}:</span> {biomarker.value} {biomarker.unit}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiologicalAgeHistoryCard;