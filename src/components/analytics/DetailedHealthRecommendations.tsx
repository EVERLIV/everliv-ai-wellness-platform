import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, AlertTriangle, CheckCircle2, Flame, HeartCog, LayoutDashboard, Stethoscope, TestTube } from "lucide-react";
import { generateDetailedRecommendations } from "@/utils/detailedRecommendationsGenerator";
import { DetailedRecommendationsResult } from "@/types/detailedRecommendations";
import { HealthProfileData } from "@/types/healthProfile";
import { CachedAnalytics } from "@/types/analytics";
import ModernHealthRecommendations from "./ModernHealthRecommendations";

interface DetailedHealthRecommendationsProps {
  analytics: CachedAnalytics | null;
  healthProfile: HealthProfileData | null;
}

const DetailedHealthRecommendations: React.FC<DetailedHealthRecommendationsProps> = ({
  analytics,
  healthProfile
}) => {
  const detailedRecommendations = useMemo(() => {
    if (!analytics) return null;
    return generateDetailedRecommendations(analytics, healthProfile);
  }, [analytics, healthProfile]);

  if (!detailedRecommendations) {
    return (
      <div className="text-center py-8">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Детальные рекомендации недоступны
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Для получения детальных рекомендаций необходимы данные аналитики здоровья
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Современные практики здоровья */}
      <ModernHealthRecommendations 
        healthProfile={healthProfile}
        analytics={analytics}
      />
      
      <Separator className="my-8" />

      {/* Существующие рекомендации */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
          <TabsTrigger value="risks">Риски</TabsTrigger>
          <TabsTrigger value="supplements">Добавки</TabsTrigger>
          <TabsTrigger value="specialists">Специалисты</TabsTrigger>
          <TabsTrigger value="tests">Анализы</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {detailedRecommendations.recommendations.length > 0 ? (
            detailedRecommendations.recommendations.map((rec) => (
              <Card key={rec.id} className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {rec.title}
                    <Badge
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}
                    >
                      {rec.priority}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>{rec.description}</p>
                  <ul className="list-disc pl-5">
                    {rec.specificActions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                  <p>Ожидаемый результат: {rec.expectedResult}</p>
                  <p>Сроки: {rec.timeframe}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Нет рекомендаций</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {detailedRecommendations.riskFactors.length > 0 ? (
            detailedRecommendations.riskFactors.map((risk) => (
              <Card key={risk.id} className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {risk.factor}
                    <Badge
                      variant={risk.level === 'high' ? 'destructive' : risk.level === 'medium' ? 'secondary' : 'outline'}
                    >
                      {risk.level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>{risk.description}</p>
                  <p>Текущее влияние: {risk.currentImpact}</p>
                  <ul className="list-disc pl-5">
                    {risk.mitigation.map((mitigation, index) => (
                      <li key={index}>{mitigation}</li>
                    ))}
                  </ul>
                  <p>Частота мониторинга: {risk.monitoringFrequency}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Нет факторов риска</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="supplements" className="space-y-4">
          {detailedRecommendations.supplements.length > 0 ? (
            detailedRecommendations.supplements.map((supplement) => (
              <Card key={supplement.id} className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    {supplement.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Дозировка: {supplement.dosage}</p>
                  <p>Время приема: {supplement.timing}</p>
                  <p>Польза: {supplement.benefit}</p>
                  <p>Продолжительность: {supplement.duration}</p>
                  <p>Стоимость: {supplement.cost}</p>
                  <p>Где купить: {supplement.whereToBuy}</p>
                  {supplement.interactions && <p>Взаимодействия: {supplement.interactions}</p>}
                  {supplement.sideEffects && <p>Побочные эффекты: {supplement.sideEffects}</p>}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Нет рекомендованных добавок</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="specialists" className="space-y-4">
          {detailedRecommendations.specialists.length > 0 ? (
            detailedRecommendations.specialists.map((specialist) => (
              <Card key={specialist.id} className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    {specialist.specialist}
                    <Badge>{specialist.urgency}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Причина: {specialist.reason}</p>
                  <p>Что ожидать: {specialist.whatToExpected}</p>
                  <p>Подготовка: {specialist.preparation.join(', ')}</p>
                  <p>Ориентировочная стоимость: {specialist.estimatedCost}</p>
                  <p>Частота: {specialist.frequency}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Нет рекомендованных специалистов</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {detailedRecommendations.tests.length > 0 ? (
            detailedRecommendations.tests.map((test) => (
              <Card key={test.id} className="border-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    {test.testName}
                    <Badge
                      variant={test.priority === 'high' ? 'destructive' : test.priority === 'medium' ? 'secondary' : 'outline'}
                    >
                      {test.priority}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Частота: {test.frequency}</p>
                  <p>Причина: {test.reason}</p>
                  <p>Подготовка: {test.preparation.join(', ')}</p>
                  <p>Ориентировочная стоимость: {test.expectedCost}</p>
                  <p>Где получить: {test.whereToGet}</p>
                  <p>Что проверяет: {test.whatItChecks.join(', ')}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Нет рекомендованных тестов</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedHealthRecommendations;
