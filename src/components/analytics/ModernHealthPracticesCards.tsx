
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Thermometer, 
  Wind, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Star
} from "lucide-react";
import { generateModernRecommendations } from "@/utils/modernRecommendationsGenerator";
import { HealthProfileData } from "@/types/healthProfile";
import { CachedAnalytics } from "@/types/analytics";

interface ModernHealthPracticesCardsProps {
  healthProfile?: HealthProfileData;
  analytics?: CachedAnalytics;
}

const ModernHealthPracticesCards: React.FC<ModernHealthPracticesCardsProps> = ({
  healthProfile,
  analytics
}) => {
  const recommendations = generateModernRecommendations(healthProfile, analytics);

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Современные практики здоровья
            </h3>
            <p className="text-gray-600 text-sm">
              Заполните профиль здоровья для получения персональных рекомендаций по современным практикам оздоровления
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'intermittent_fasting':
        return <Clock className="h-5 w-5 text-green-600" />;
      case 'cold_therapy':
        return <Thermometer className="h-5 w-5 text-blue-600" />;
      case 'breathing_practices':
        return <Wind className="h-5 w-5 text-purple-600" />;
      default:
        return <Star className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Начинающий';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return 'Не указан';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold">Современные практики здоровья</h2>
        <Badge variant="secondary" className="text-xs">
          Информационно
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(recommendation.category)}
                  <div>
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(recommendation.difficulty)}>
                  {getDifficultyText(recommendation.difficulty)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Основная информация */}
              <div className="grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Частота:</strong> {recommendation.frequency}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    <strong>Продолжительность:</strong> {recommendation.duration}
                  </span>
                </div>
              </div>

              {/* Польза */}
              <div>
                <h4 className="font-medium mb-2 text-green-800">✨ Польза для здоровья:</h4>
                <ul className="space-y-1">
                  {recommendation.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Инструкции (краткие) */}
              <div>
                <h4 className="font-medium mb-2 text-blue-800">📋 Как выполнять:</h4>
                <ol className="space-y-1">
                  {recommendation.instructions.slice(0, 2).map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Противопоказания (если есть) */}
              {recommendation.contraindications.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2 text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Противопоказания:
                    </h4>
                    <ul className="space-y-1">
                      {recommendation.contraindications.slice(0, 2).map((contraindication, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                          <AlertTriangle className="h-3 w-3 mt-1 flex-shrink-0" />
                          <span>{contraindication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Научная основа */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Научная основа:</strong> {recommendation.scientificBasis}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModernHealthPracticesCards;
