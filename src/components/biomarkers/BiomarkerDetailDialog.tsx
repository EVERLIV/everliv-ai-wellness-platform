import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Activity, 
  Info, 
  Heart,
  Target,
  AlertTriangle,
  TestTube,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import BiomarkerTrendChart from '@/components/analysis-details/BiomarkerTrendChart';
import { getBiomarkerInfo } from '@/data/expandedBiomarkers';
import { getBiomarkerNorm } from '@/data/biomarkerNorms';

interface BiomarkerDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  biomarker: {
    name: string;
    latestValue: string;
    normalRange: string;
    status: 'normal' | 'high' | 'low';
    lastUpdated: string;
    analysisCount: number;
    trend: 'up' | 'down' | 'stable';
  } | null;
}

interface BiomarkerHistory {
  value: string;
  date: string;
  analysisId: string;
}

interface AIRecommendation {
  dietaryRecommendations?: string[];
  lifestyleChanges?: string[];
  supplementsToConsider?: string[];
  whenToRetest?: string;
  warningSignsToWatch?: string[];
  additionalTests?: string[];
}

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({
  isOpen,
  onClose,
  biomarker,
}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<BiomarkerHistory[]>([]);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  useEffect(() => {
    if (biomarker && isOpen) {
      fetchBiomarkerHistory();
      fetchAIRecommendation();
    }
  }, [biomarker, isOpen]);

  const fetchBiomarkerHistory = async () => {
    if (!biomarker || !user) return;

    setLoadingHistory(true);
    try {
      const { data: analyses } = await supabase
        .from('medical_analyses')
        .select('id, created_at, results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analyses) {
        const biomarkerHistory: BiomarkerHistory[] = [];
        
        analyses.forEach(analysis => {
          if (analysis.results?.markers) {
            const marker = analysis.results.markers.find((m: any) => m.name === biomarker.name);
            if (marker) {
              biomarkerHistory.push({
                value: marker.value,
                date: analysis.created_at,
                analysisId: analysis.id
              });
            }
          }
        });

        setHistory(biomarkerHistory);
      }
    } catch (error) {
      console.error('Error fetching biomarker history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchAIRecommendation = async () => {
    if (!biomarker || biomarker.status === 'normal') return;

    setLoadingRecommendation(true);
    try {
      const response = await supabase.functions.invoke('generate-biomarker-recommendations', {
        body: {
          biomarkerName: biomarker.name,
          currentValue: biomarker.latestValue,
          normalRange: biomarker.normalRange,
          status: biomarker.status
        }
      });

      if (response.data) {
        setRecommendation(response.data);
      }
    } catch (error) {
      console.error('Error fetching AI recommendation:', error);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  if (!biomarker) return null;

  const description = getBiomarkerInfo(biomarker.name);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              biomarker.status === 'normal' ? 'bg-green-100' :
              biomarker.status === 'high' ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <TestTube className={`h-5 w-5 ${
                biomarker.status === 'normal' ? 'text-green-600' :
                biomarker.status === 'high' ? 'text-red-600' : 'text-orange-600'
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{biomarker.name}</h2>
              <p className="text-sm text-muted-foreground">
                Последнее обновление: {format(new Date(biomarker.lastUpdated), 'dd MMMM yyyy', { locale: ru })}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted p-1 rounded-lg h-auto min-h-[44px]">
            <TabsTrigger 
              value="overview"
              className="!flex !items-center !justify-center !px-2 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !overflow-hidden !whitespace-nowrap !text-center"
            >
              Обзор
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="!flex !items-center !justify-center !px-2 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !overflow-hidden !whitespace-nowrap !text-center"
            >
              История
            </TabsTrigger>
            <TabsTrigger 
              value="trends"
              className="!flex !items-center !justify-center !px-2 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !overflow-hidden !whitespace-nowrap !text-center"
            >
              Динамика
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations"
              className="!flex !items-center !justify-center !px-1 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !overflow-hidden !whitespace-nowrap !text-center"
            >
              Советы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Текущее состояние */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Текущее состояние
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Текущее значение</p>
                    <p className="text-2xl font-bold">{biomarker.latestValue}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Норма</p>
                    <p className="text-lg font-semibold">{biomarker.normalRange}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Статус</p>
                    <Badge 
                      variant={
                        biomarker.status === 'normal' ? 'default' :
                        biomarker.status === 'high' ? 'destructive' : 'secondary'
                      }
                    >
                      {biomarker.status === 'normal' ? 'В норме' :
                       biomarker.status === 'high' ? 'Выше нормы' : 'Ниже нормы'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {biomarker.trend === 'up' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Растущий тренд</span>
                    </div>
                  )}
                  {biomarker.trend === 'down' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm">Убывающий тренд</span>
                    </div>
                  )}
                  {biomarker.trend === 'stable' && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="text-sm">Стабильные значения</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Описание */}
            {description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Что показывает этот биомаркер
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  История значений ({biomarker.analysisCount} записей)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {history.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-semibold">{record.value}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(record.date), 'dd MMM yyyy, HH:mm', { locale: ru })}
                          </p>
                        </div>
                        {index === 0 && (
                          <Badge variant="outline">Последнее</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <BiomarkerTrendChart biomarkerName={biomarker.name} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {biomarker.status === 'normal' ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Показатель в норме!</h3>
                  <p className="text-muted-foreground">
                    Ваш {biomarker.name} находится в пределах нормы. 
                    Продолжайте поддерживать здоровый образ жизни.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {loadingRecommendation ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
                      <p>Генерируем персональные рекомендации...</p>
                    </CardContent>
                  </Card>
                ) : recommendation ? (
                  <div className="space-y-4">
                    {recommendation.dietaryRecommendations && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-600">
                            <Target className="h-5 w-5" />
                            Рекомендации по питанию
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {recommendation.dietaryRecommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {recommendation.lifestyleChanges && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-blue-600">
                            <Activity className="h-5 w-5" />
                            Изменения образа жизни
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {recommendation.lifestyleChanges.map((change, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="text-sm">{change}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {recommendation.warningSignsToWatch && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-5 w-5" />
                            На что обратить внимание
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {recommendation.warningSignsToWatch.map((sign, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                <span className="text-sm">{sign}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {recommendation.whenToRetest && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-600">
                            <Calendar className="h-5 w-5" />
                            Когда пересдать анализ
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{recommendation.whenToRetest}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Не удалось загрузить рекомендации. Попробуйте позже.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={fetchAIRecommendation}
                      >
                        Попробовать снова
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerDetailDialog;