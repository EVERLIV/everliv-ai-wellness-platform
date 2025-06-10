
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  AlertTriangle, 
  Pill, 
  Stethoscope,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  User,
  Activity
} from "lucide-react";

interface DetailedRecommendation {
  id: string;
  category: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  specificActions: string[];
  expectedResult: string;
  timeframe: string;
  cost?: string;
}

interface RiskFactor {
  id: string;
  factor: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  currentImpact: string;
  mitigation: string[];
  monitoringFrequency: string;
}

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  benefit: string;
  duration: string;
  cost: string;
  whereToBuy: string;
  interactions?: string;
  sideEffects?: string;
}

interface SpecialistRecommendation {
  id: string;
  specialist: string;
  urgency: 'immediate' | 'within_month' | 'within_3_months' | 'annual';
  reason: string;
  whatToExpect: string;
  preparation: string[];
  estimatedCost: string;
  frequency: string;
}

interface TestRecommendation {
  id: string;
  testName: string;
  priority: 'high' | 'medium' | 'low';
  frequency: string;
  reason: string;
  preparation: string[];
  expectedCost: string;
  whereToGet: string;
  whatItChecks: string[];
}

interface DetailedHealthRecommendationsProps {
  recommendations: DetailedRecommendation[];
  riskFactors: RiskFactor[];
  supplements: Supplement[];
  specialists: SpecialistRecommendation[];
  tests: TestRecommendation[];
}

const DetailedHealthRecommendations: React.FC<DetailedHealthRecommendationsProps> = ({
  recommendations = [],
  riskFactors = [],
  supplements = [],
  specialists = [],
  tests = []
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-100 text-red-700';
      case 'within_month':
        return 'bg-orange-100 text-orange-700';
      case 'within_3_months':
        return 'bg-yellow-100 text-yellow-700';
      case 'annual':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'Срочно';
      case 'within_month':
        return 'В течение месяца';
      case 'within_3_months':
        return 'В течение 3 месяцев';
      case 'annual':
        return 'Раз в год';
      default:
        return 'По показаниям';
    }
  };

  return (
    <div className="space-y-8">
      {/* Персональные рекомендации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Персональные рекомендации (пошаговый план действий)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-blue-900">{rec.title}</h4>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {rec.category}
                    </span>
                  </div>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority === 'high' ? 'Высокий приоритет' : 
                     rec.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                  </Badge>
                </div>
                
                <p className="text-sm text-blue-800 mb-3">{rec.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Конкретные шаги:
                    </h5>
                    <ul className="space-y-1">
                      {rec.specificActions.map((action, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start">
                          <CheckCircle className="h-3 w-3 mt-1 mr-2 flex-shrink-0 text-green-600" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-blue-100 p-2 rounded">
                      <strong>Ожидаемый результат:</strong> {rec.expectedResult}
                    </div>
                    <div className="bg-blue-100 p-2 rounded">
                      <strong>Временные рамки:</strong> {rec.timeframe}
                    </div>
                    {rec.cost && (
                      <div className="bg-blue-100 p-2 rounded">
                        <strong>Примерная стоимость:</strong> {rec.cost}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Факторы риска */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Факторы риска и план их снижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk) => (
              <div key={risk.id} className={`border rounded-lg p-4 ${getRiskColor(risk.level)}`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{risk.factor}</h4>
                  <Badge variant="outline" className={getPriorityColor(risk.level)}>
                    {risk.level === 'high' ? 'Высокий риск' : 
                     risk.level === 'medium' ? 'Средний риск' : 'Низкий риск'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{risk.description}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Текущее влияние:</strong> {risk.currentImpact}
                </p>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">План снижения риска:</h5>
                  <ul className="space-y-1">
                    {risk.mitigation.map((action, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <ArrowRight className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3 p-2 bg-white rounded text-xs">
                  <strong>Частота контроля:</strong> {risk.monitoringFrequency}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Рекомендуемые добавки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-purple-500" />
            Рекомендуемые добавки (детальная инструкция)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplements.map((supplement) => (
              <div key={supplement.id} className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-purple-900">{supplement.name}</h4>
                  <Pill className="h-5 w-5 text-purple-500" />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Дозировка:</strong> {supplement.dosage}
                    </div>
                    <div>
                      <strong>Когда принимать:</strong> {supplement.timing}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Польза:</strong> {supplement.benefit}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Курс:</strong> {supplement.duration}
                    </div>
                    <div>
                      <strong>Стоимость:</strong> {supplement.cost}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Где купить:</strong> {supplement.whereToBy}
                  </div>
                  
                  {supplement.interactions && (
                    <div className="p-2 bg-purple-100 rounded text-xs">
                      <strong>Взаимодействия:</strong> {supplement.interactions}
                    </div>
                  )}
                  
                  {supplement.sideEffects && (
                    <div className="p-2 bg-red-50 rounded text-xs border border-red-200">
                      <strong>Возможные побочные эффекты:</strong> {supplement.sideEffects}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Рекомендуемые специалисты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-green-500" />
            Рекомендуемые врачи и частота посещений
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {specialists.map((specialist) => (
              <div key={specialist.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-green-900">{specialist.specialist}</h4>
                    <Badge className={getUrgencyColor(specialist.urgency)}>
                      {getUrgencyText(specialist.urgency)}
                    </Badge>
                  </div>
                  <User className="h-5 w-5 text-green-500" />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Причина обращения:</strong> {specialist.reason}
                  </div>
                  
                  <div>
                    <strong>Что ожидать на приеме:</strong> {specialist.whatToExpect}
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-green-900 mb-1">Подготовка к визиту:</h5>
                    <ul className="space-y-1">
                      {specialist.preparation.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowRight className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-green-200">
                    <div>
                      <strong>Примерная стоимость:</strong> {specialist.estimatedCost}
                    </div>
                    <div>
                      <strong>Частота посещений:</strong> {specialist.frequency}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Рекомендуемые анализы */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            Рекомендуемые анализы и обследования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4 bg-indigo-50 border-indigo-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-indigo-900">{test.testName}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getPriorityColor(test.priority)}>
                        {test.priority === 'high' ? 'Высокий приоритет' : 
                         test.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
                      </Badge>
                      <Badge variant="outline">
                        {test.frequency}
                      </Badge>
                    </div>
                  </div>
                  <Calendar className="h-5 w-5 text-indigo-500" />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Зачем нужен:</strong> {test.reason}
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-indigo-900 mb-1">Что проверяет:</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {test.whatItChecks.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-3 w-3 mt-1 mr-2 flex-shrink-0 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-indigo-900 mb-1">Подготовка:</h5>
                    <ul className="space-y-1">
                      {test.preparation.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Clock className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-200">
                    <div>
                      <strong>Стоимость:</strong> {test.expectedCost}
                    </div>
                    <div>
                      <strong>Где сдать:</strong> {test.whereToGet}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedHealthRecommendations;
