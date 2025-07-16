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
            <span className="text-lg font-semibold">История биовозраста</span>
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
            <span className="text-lg font-semibold">История биовозраста</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Пока нет данных</p>
            <p className="text-xs text-gray-500 mt-1">
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
          <span className="text-lg font-semibold">История биовозраста</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Текущий результат */}
        <div className="bg-blue-50/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Последний расчет</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(latest.created_at), { 
                addSuffix: true,
                locale: ru 
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(latest.biological_age)} лет
              </div>
              <div className="text-sm text-gray-600">
                {latest.age_difference > 0 ? '+' : ''}{Math.round(latest.age_difference)} к хронологическому
              </div>
            </div>
            {previous && (
              <div className="flex items-center gap-1">
                {getTrendIcon(trend)}
                <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                  {trend > 0 ? '+' : ''}{Math.round(trend * 10) / 10}
                </span>
              </div>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {latest.biomarkers_count} анализов
            </Badge>
            <Badge variant="outline" className="text-xs">
              {latest.accuracy_percentage}% точность
            </Badge>
          </div>
        </div>

        {/* История */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Предыдущие расчеты</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {snapshots.slice(1, 6).map((snapshot) => (
              <div 
                key={snapshot.id}
                className="p-3 bg-gray-50/50 rounded-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round(snapshot.biological_age)} лет
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {snapshot.biomarkers_count}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(snapshot.created_at), 'dd.MM.yyyy', { locale: ru })}
                  </div>
                </div>
                
                {/* Показатели */}
                {snapshot.biomarker_history && snapshot.biomarker_history.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600 font-medium">Показатели:</div>
                    <div className="flex flex-wrap gap-1">
                      {snapshot.biomarker_history.map((biomarker, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="text-xs px-2 py-1"
                        >
                          {biomarker.biomarker_name}: {biomarker.value} {biomarker.unit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {snapshots.length > 6 && (
          <div className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Показать все ({snapshots.length})
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiologicalAgeHistoryCard;