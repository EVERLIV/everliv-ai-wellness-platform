import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Clock, AlertTriangle, Info } from 'lucide-react';

interface SupplementsRecommendationsProps {
  recommendations: any;
}

const SupplementsRecommendations: React.FC<SupplementsRecommendationsProps> = ({ recommendations }) => {
  const supplements = recommendations?.supplements || [];
  const absorptionHelpers = recommendations?.absorptionHelpers || [];

  return (
    <div className="space-y-content">
      {/* Supplements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Рекомендуемые добавки
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supplements.length > 0 ? (
            <div className="space-y-4">
              {/* Disclaimer */}
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning mb-1">Важно!</p>
                    <p className="text-secondary-foreground">
                      Перед приемом любых добавок обязательно проконсультируйтесь с врачом. 
                      Рекомендации основаны только на анализе ваших данных.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {supplements.map((supplement: any, index: number) => (
                  <div key={index} className="p-4 bg-surface rounded-lg space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-primary">{supplement.name}</h4>
                        <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">
                          {supplement.dosage}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-foreground">{supplement.benefit}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>Время приема:</strong> {supplement.timing}
                        </span>
                      </div>
                      
                      {supplement.interactions && (
                        <div className="flex items-start gap-2 p-2 bg-warning/5 border border-warning/20 rounded">
                          <Info className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                          <span className="text-sm">
                            <strong>Взаимодействия:</strong> {supplement.interactions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Рекомендации по добавкам будут доступны после анализа ваших данных</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Absorption Helpers */}
      {absorptionHelpers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Улучшение усвоения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {absorptionHelpers.map((helper: any, index: number) => (
                <div key={index} className="p-3 bg-surface rounded-lg">
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">{helper.name}</h4>
                    <p className="text-sm text-secondary-foreground">{helper.function}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted/50 rounded">
                        Принимать с: {helper.takeWith}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupplementsRecommendations;