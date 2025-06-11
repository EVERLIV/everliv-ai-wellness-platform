
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, FileText, User, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnalyticsDataRequiredStateProps {
  hasHealthProfile: boolean;
  hasAnalyses: boolean;
}

const AnalyticsDataRequiredState: React.FC<AnalyticsDataRequiredStateProps> = ({
  hasHealthProfile,
  hasAnalyses
}) => {
  const navigate = useNavigate();

  const missingData = [];
  if (!hasHealthProfile) missingData.push('профиль здоровья');
  if (!hasAnalyses) missingData.push('анализы крови');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <CardContent className="p-8">
          <div className="text-center max-w-2xl mx-auto">
            <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-amber-500" />
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Недостаточно данных для анализа здоровья
            </h2>
            
            <p className="text-gray-600 mb-6 text-lg">
              Для получения детального анализа здоровья необходимо заполнить профиль здоровья 
              и добавить хотя бы один общий анализ крови. Анализ здоровья основывается на данных 
              профиля здоровья и биомаркерах анализов.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className={`p-6 border rounded-lg ${hasHealthProfile ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <User className={`h-6 w-6 ${hasHealthProfile ? 'text-green-600' : 'text-red-600'}`} />
                  <h3 className={`font-semibold ${hasHealthProfile ? 'text-green-900' : 'text-red-900'}`}>
                    Профиль здоровья
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${hasHealthProfile ? 'text-green-700' : 'text-red-700'}`}>
                  {hasHealthProfile 
                    ? 'Профиль заполнен ✓' 
                    : 'Необходимо заполнить базовую информацию: возраст, пол, рост, вес'
                  }
                </p>
                {!hasHealthProfile && (
                  <Button 
                    onClick={() => navigate('/health-profile')}
                    className="w-full"
                  >
                    Заполнить профиль
                  </Button>
                )}
              </div>

              <div className={`p-6 border rounded-lg ${hasAnalyses ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <FileText className={`h-6 w-6 ${hasAnalyses ? 'text-green-600' : 'text-red-600'}`} />
                  <h3 className={`font-semibold ${hasAnalyses ? 'text-green-900' : 'text-red-900'}`}>
                    Анализы крови
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${hasAnalyses ? 'text-green-700' : 'text-red-700'}`}>
                  {hasAnalyses 
                    ? 'Анализы загружены ✓' 
                    : 'Необходимо загрузить хотя бы один общий анализ крови'
                  }
                </p>
                {!hasAnalyses && (
                  <Button 
                    onClick={() => navigate('/lab-analyses')}
                    className="w-full"
                  >
                    Загрузить анализ
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <Heart className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold text-blue-900 mb-2">
                Что вы получите после заполнения данных:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Персональный балл здоровья</li>
                <li>• Оценка уровня риска</li>
                <li>• Детальные рекомендации по улучшению здоровья</li>
                <li>• Анализ трендов ваших показателей</li>
                <li>• Персональные советы по питанию и образу жизни</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDataRequiredState;
