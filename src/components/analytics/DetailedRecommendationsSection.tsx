
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Target,
  Activity,
  Clock,
  Star
} from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";
import { HealthProfileData } from "@/types/healthProfile";

interface DetailedRecommendationsSectionProps {
  analytics: CachedAnalytics;
  healthProfile: HealthProfileData | null;
}

const DetailedRecommendationsSection: React.FC<DetailedRecommendationsSectionProps> = ({
  analytics,
  healthProfile
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Детальные рекомендации ИИ-доктора
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Сильные стороны */}
        {analytics.strengths && analytics.strengths.length > 0 && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Ваши сильные стороны
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <p className="text-sm text-green-800 font-medium">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Области для внимания */}
        {analytics.concerns && analytics.concerns.length > 0 && (
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                Области для внимания
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.concerns.map((concern, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                    </div>
                    <p className="text-sm text-amber-800 font-medium">{concern}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Основные рекомендации */}
      {analytics.recommendations && analytics.recommendations.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-5 w-5" />
              Персональные рекомендации ИИ-доктора
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium leading-relaxed">
                        {recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Последние активности */}
      {analytics.recentActivities && analytics.recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-600" />
              Последние активности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                    <Activity className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Анализ трендов */}
      {analytics.trendsAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Анализ трендов здоровья
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.trendsAnalysis.improving}
                </div>
                <div className="text-sm text-green-800 font-medium">Улучшается</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {analytics.trendsAnalysis.stable}
                </div>
                <div className="text-sm text-gray-800 font-medium">Стабильно</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {analytics.trendsAnalysis.worsening}
                </div>
                <div className="text-sm text-red-800 font-medium">Требует внимания</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Дополнительная информация */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Персональный подход к вашему здоровью
            </h3>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Все рекомендации созданы на основе анализа ваших данных о здоровье, 
              профиля и истории анализов. Следуйте им для достижения оптимального состояния здоровья.
            </p>
            {analytics.scoreExplanation && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  💡 {analytics.scoreExplanation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedRecommendationsSection;
