
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Clock, 
  Star, 
  Target, 
  TrendingUp, 
  Shield, 
  Pill, 
  UserCheck,
  TestTube,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { generateDetailedRecommendations } from "@/utils/detailedRecommendationsGenerator";

interface EnhancedRecommendationsSectionProps {
  analytics: CachedAnalytics;
}

const EnhancedRecommendationsSection: React.FC<EnhancedRecommendationsSectionProps> = ({
  analytics
}) => {
  const { healthProfile } = useHealthProfile();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const recommendations = generateDetailedRecommendations(analytics, healthProfile || undefined);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskLevelColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Улучшенная система рекомендаций
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="risks">Риски</TabsTrigger>
            <TabsTrigger value="supplements">Добавки</TabsTrigger>
            <TabsTrigger value="specialists">Специалисты</TabsTrigger>
            <TabsTrigger value="tests">Анализы</TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.recommendations.map((rec) => (
              <Card key={rec.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(rec.id)}
                      >
                        {expandedItems.has(rec.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">{rec.category}</div>
                  <p className="text-gray-700 mb-3">{rec.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {rec.timeframe}
                    </div>
                    {rec.cost && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {rec.cost}
                      </div>
                    )}
                  </div>

                  {expandedItems.has(rec.id) && (
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Конкретные действия:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {rec.specificActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Ожидаемый результат:</h5>
                        <p className="text-sm text-gray-700">{rec.expectedResult}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Risk Factors Tab */}
          <TabsContent value="risks" className="space-y-4">
            {recommendations.riskFactors.map((risk) => (
              <Card key={risk.id} className={`border-l-4 ${risk.level === 'high' ? 'border-l-red-500' : risk.level === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${risk.level === 'high' ? 'text-red-600' : risk.level === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                      <h4 className="font-semibold text-gray-900">{risk.factor}</h4>
                    </div>
                    <Badge className={getRiskLevelColor(risk.level)}>
                      {risk.level === 'high' ? 'Высокий риск' : risk.level === 'medium' ? 'Средний риск' : 'Низкий риск'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{risk.description}</p>
                  <p className="text-sm text-gray-600 mb-3">{risk.currentImpact}</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Меры по снижению риска:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {risk.mitigation.map((measure, index) => (
                        <li key={index}>{measure}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    Частота мониторинга: {risk.monitoringFrequency}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Supplements Tab */}
          <TabsContent value="supplements" className="space-y-4">
            {recommendations.supplements.map((supplement) => (
              <Card key={supplement.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-gray-900">{supplement.name}</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Дозировка:</span> {supplement.dosage}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Время приема:</span> {supplement.timing}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Длительность:</span> {supplement.duration}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Стоимость:</span> {supplement.cost}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-700 mb-2">{supplement.benefit}</p>
                    <p className="text-sm text-gray-600">Где купить: {supplement.whereToBuy}</p>
                  </div>
                  
                  {supplement.interactions && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">⚠️ Взаимодействия: {supplement.interactions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Specialists Tab */}
          <TabsContent value="specialists" className="space-y-4">
            {recommendations.specialists.map((specialist) => (
              <Card key={specialist.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">{specialist.specialist}</h4>
                    </div>
                    <Badge className={`${specialist.urgency === 'immediate' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {specialist.urgency === 'immediate' ? 'Срочно' : specialist.urgency === 'within_month' ? 'В течение месяца' : 'Плановый'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{specialist.reason}</p>
                  <p className="text-sm text-gray-600 mb-3">{specialist.whatToExpected}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-gray-700">Стоимость:</span> {specialist.estimatedCost}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Частота:</span> {specialist.frequency}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Подготовка к визиту:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {specialist.preparation.map((prep, index) => (
                        <li key={index}>{prep}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            {recommendations.tests.map((test) => (
              <Card key={test.id} className="border-l-4 border-l-cyan-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-cyan-600" />
                      <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                    </div>
                    <Badge className={getPriorityColor(test.priority)}>
                      {test.priority === 'high' ? 'Высокий' : test.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{test.reason}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-gray-700">Частота:</span> {test.frequency}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Стоимость:</span> {test.expectedCost}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Где сдать:</span> {test.whereToGet}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Что проверяется:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {test.whatItChecks.map((check, index) => (
                        <li key={index}>{check}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {test.preparation.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-900 mb-2">Подготовка:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {test.preparation.map((prep, index) => (
                          <li key={index}>{prep}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedRecommendationsSection;
