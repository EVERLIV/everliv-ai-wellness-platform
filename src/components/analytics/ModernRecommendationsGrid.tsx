
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  AlertTriangle, 
  Pill, 
  UserCheck, 
  TestTube,
  ChevronRight,
  Heart,
  Activity,
  Shield,
  Clock,
  Star
} from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";
import { HealthProfileData } from "@/types/healthProfile";
import { generateDetailedRecommendations } from "@/utils/detailedRecommendationsGenerator";

interface ModernRecommendationsGridProps {
  analytics: CachedAnalytics;
  healthProfile: HealthProfileData | null;
}

const ModernRecommendationsGrid: React.FC<ModernRecommendationsGridProps> = ({
  analytics,
  healthProfile
}) => {
  const recommendations = generateDetailedRecommendations(analytics, healthProfile || undefined);

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskLevelColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Основные рекомендации */}
      {recommendations.recommendations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Персональные рекомендации</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.recommendations.map((rec) => (
              <Card key={rec.id} className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Heart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{rec.title}</CardTitle>
                        <p className="text-xs text-gray-500">{rec.category}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                      {rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{rec.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.timeframe}
                    </div>
                    {rec.cost && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {rec.cost}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Результат:</strong> {rec.expectedResult}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Факторы риска */}
      {recommendations.riskFactors.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Факторы риска</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.riskFactors.map((risk) => (
              <Card key={risk.id} className={`border-2 ${getRiskLevelColor(risk.level)} hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        risk.level === 'high' ? 'bg-red-100' : risk.level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <Shield className={`h-4 w-4 ${
                          risk.level === 'high' ? 'text-red-600' : risk.level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      </div>
                      <CardTitle className="text-sm font-medium">{risk.factor}</CardTitle>
                    </div>
                    <Badge className={getRiskLevelColor(risk.level)}>
                      {risk.level === 'high' ? 'Высокий' : risk.level === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                  <p className="text-xs text-gray-600 mb-3">{risk.currentImpact}</p>
                  <div className="text-xs text-gray-600">
                    <strong>Мониторинг:</strong> {risk.monitoringFrequency}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Добавки */}
      {recommendations.supplements.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Pill className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Рекомендованные добавки</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.supplements.map((supplement) => (
              <Card key={supplement.id} className="border-2 border-green-200 hover:border-green-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Pill className="h-4 w-4 text-green-600" />
                    </div>
                    <CardTitle className="text-sm font-medium">{supplement.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>Дозировка:</strong> {supplement.dosage}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Время:</strong> {supplement.timing}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Стоимость:</strong> {supplement.cost}
                  </div>
                  <p className="text-sm text-gray-700">{supplement.benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Специалисты */}
      {recommendations.specialists.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <UserCheck className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Консультации специалистов</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.specialists.map((specialist) => (
              <Card key={specialist.id} className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-purple-600" />
                      </div>
                      <CardTitle className="text-sm font-medium">{specialist.specialist}</CardTitle>
                    </div>
                    <Badge className={`text-xs ${specialist.urgency === 'immediate' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {specialist.urgency === 'immediate' ? 'Срочно' : 'Плановый'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-2">{specialist.reason}</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Стоимость:</strong> {specialist.estimatedCost}</div>
                    <div><strong>Частота:</strong> {specialist.frequency}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Анализы */}
      {recommendations.tests.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TestTube className="h-6 w-6 text-cyan-600" />
            <h2 className="text-xl font-semibold text-gray-900">Рекомендованные анализы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.tests.map((test) => (
              <Card key={test.id} className="border-2 border-cyan-200 hover:border-cyan-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <TestTube className="h-4 w-4 text-cyan-600" />
                      </div>
                      <CardTitle className="text-sm font-medium">{test.testName}</CardTitle>
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(test.priority)}`}>
                      {test.priority === 'high' ? 'Высокий' : test.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-2">{test.reason}</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Частота:</strong> {test.frequency}</div>
                    <div><strong>Стоимость:</strong> {test.expectedCost}</div>
                    <div><strong>Где сдать:</strong> {test.whereToGet}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernRecommendationsGrid;
