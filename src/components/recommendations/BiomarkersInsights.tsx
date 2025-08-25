import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface BiomarkersInsightsProps {
  recommendations: any;
  healthProfile: any;
  analytics: any;
}

const BiomarkersInsights: React.FC<BiomarkersInsightsProps> = ({ 
  recommendations, 
  healthProfile, 
  analytics 
}) => {
  const labTests = recommendations?.labTests || [];
  const labResults = healthProfile?.labResults || {};

  const getTestPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return TrendingUp;
      case 'low': return TrendingDown;
      default: return FlaskConical;
    }
  };

  return (
    <div className="space-y-content">
      {/* Recommended Lab Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Рекомендуемые анализы
          </CardTitle>
        </CardHeader>
        <CardContent>
          {labTests.length > 0 ? (
            <div className="space-y-3">
              {labTests.map((test: any, index: number) => {
                const PriorityIcon = getPriorityIcon(test.priority);
                return (
                  <div key={index} className={`p-3 rounded-lg border ${getTestPriorityColor(test.priority)}`}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <PriorityIcon className="h-4 w-4 flex-shrink-0" />
                          <h4 className="font-medium">{test.name}</h4>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full border bg-background">
                          {test.frequency}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{test.reason}</p>
                      {test.preparation && (
                        <div className="text-xs opacity-75 p-2 bg-background/50 rounded">
                          <strong>Подготовка:</strong> {test.preparation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Рекомендации по анализам будут доступны после анализа ваших данных</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Lab Results Analysis */}
      {Object.keys(labResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Анализ текущих показателей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(labResults).map(([key, value]: [string, any]) => (
                <div key={key} className="p-3 bg-surface rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-primary">{key}</span>
                    <span className="text-sm text-foreground">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Index Breakdown */}
      {analytics?.healthScore && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Анализ индекса здоровья
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {analytics.healthScore}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Общий индекс здоровья
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-surface rounded">
                  <span className="text-sm">Уровень риска</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    analytics.riskLevel === 'low' ? 'bg-success/10 text-success' :
                    analytics.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {analytics.riskLevel === 'low' ? 'Низкий' :
                     analytics.riskLevel === 'high' ? 'Высокий' : 'Средний'}
                  </span>
                </div>
                
                {analytics.lastUpdated && (
                  <div className="flex justify-between items-center p-2 bg-surface rounded">
                    <span className="text-sm">Последнее обновление</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(analytics.lastUpdated).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BiomarkersInsights;