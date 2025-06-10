
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  AlertTriangle,
  Pill,
  CheckCircle
} from "lucide-react";

interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'good' | 'attention' | 'risk';
  trend: 'up' | 'down' | 'stable';
  referenceRange: string;
  lastMeasured: string;
}

interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

interface RiskFactor {
  id: string;
  factor: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
}

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  benefit: string;
  timing: string;
  interactions?: string;
}

interface BiomarkerDetailsProps {
  biomarker: Biomarker | undefined;
  recommendations: Recommendation[];
  riskFactors: RiskFactor[];
  supplements: Supplement[];
}

const BiomarkerDetails: React.FC<BiomarkerDetailsProps> = ({
  biomarker,
  recommendations,
  riskFactors,
  supplements
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'attention':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'risk':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'Оптимально';
      case 'good':
        return 'Хорошо';
      case 'attention':
        return 'Внимание';
      case 'risk':
        return 'Риск';
      default:
        return 'Не определен';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Высокий</Badge>;
      case 'medium':
        return <Badge variant="secondary">Средний</Badge>;
      case 'low':
        return <Badge variant="outline">Низкий</Badge>;
      default:
        return <Badge variant="outline">Обычный</Badge>;
    }
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive">Высокий риск</Badge>;
      case 'medium':
        return <Badge variant="secondary">Средний риск</Badge>;
      case 'low':
        return <Badge variant="outline">Низкий риск</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  if (!biomarker) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Выберите биомаркер</h3>
            <p className="text-sm">
              Выберите биомаркер из списка слева для просмотра детальной информации,
              персональных рекомендаций и связанных факторов риска.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Фильтруем рекомендации, связанные с выбранным биомаркером
  const relatedRecommendations = recommendations.filter(rec => 
    rec.id.includes(biomarker.id) || 
    rec.title.toLowerCase().includes(biomarker.name.toLowerCase()) ||
    (biomarker.name.toLowerCase().includes('холестерин') && rec.title.toLowerCase().includes('холестерин')) ||
    (biomarker.name.toLowerCase().includes('витамин d') && rec.title.toLowerCase().includes('витамин d')) ||
    (biomarker.name.toLowerCase().includes('железо') && rec.title.toLowerCase().includes('железо')) ||
    (biomarker.name.toLowerCase().includes('глюкоза') && rec.title.toLowerCase().includes('глюкоза'))
  );

  // Фильтруем факторы риска, связанные с выбранным биомаркером
  const relatedRiskFactors = riskFactors.filter(risk => 
    risk.id.includes(biomarker.id) ||
    risk.factor.toLowerCase().includes(biomarker.name.toLowerCase()) ||
    (biomarker.name.toLowerCase().includes('холестерин') && risk.factor.toLowerCase().includes('холестерин')) ||
    (biomarker.name.toLowerCase().includes('глюкоза') && risk.factor.toLowerCase().includes('глюкоза'))
  );

  // Фильтруем добавки, связанные с выбранным биомаркером
  const relatedSupplements = supplements.filter(supp => 
    supp.id.includes(biomarker.id) ||
    (biomarker.name.toLowerCase().includes('витамин d') && supp.name.toLowerCase().includes('витамин d')) ||
    (biomarker.name.toLowerCase().includes('железо') && supp.name.toLowerCase().includes('железо')) ||
    (biomarker.name.toLowerCase().includes('b12') && supp.name.toLowerCase().includes('b12'))
  );

  return (
    <div className="space-y-6">
      {/* Детали биомаркера */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            {biomarker.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Текущее значение</h4>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {biomarker.value}
                  </span>
                  <span className="text-gray-600">{biomarker.unit}</span>
                  {getTrendIcon(biomarker.trend)}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Референсные значения</h4>
                <p className="text-gray-600">{biomarker.referenceRange}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Статус</h4>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(biomarker.status)}`}>
                  {biomarker.status === 'optimal' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {biomarker.status === 'risk' && <AlertTriangle className="h-4 w-4 mr-1" />}
                  {getStatusText(biomarker.status)}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Последнее измерение</h4>
                <p className="text-gray-600">
                  {new Date(biomarker.lastMeasured).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Персональные рекомендации */}
      {relatedRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Персональные рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-green-900">{rec.title}</h4>
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        {rec.category}
                      </span>
                    </div>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  <p className="text-sm text-green-800 mb-2">{rec.description}</p>
                  <p className="text-xs text-green-700 font-medium">
                    <strong>Действие:</strong> {rec.action}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Факторы риска */}
      {relatedRiskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Связанные факторы риска
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedRiskFactors.map((risk) => (
                <div key={risk.id} className="p-4 border-l-4 border-orange-200 bg-orange-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-orange-900">{risk.factor}</h4>
                    {getRiskLevelBadge(risk.level)}
                  </div>
                  <p className="text-sm text-orange-800 mb-3">{risk.description}</p>
                  <div className="p-3 bg-orange-100 rounded">
                    <p className="text-xs text-orange-700">
                      <strong>Как снизить риск:</strong> {risk.mitigation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Рекомендуемые добавки */}
      {relatedSupplements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-500" />
              Рекомендуемые добавки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedSupplements.map((supplement) => (
                <div key={supplement.id} className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-purple-900">{supplement.name}</h4>
                      <span className="text-sm font-semibold text-purple-700">
                        {supplement.dosage}
                      </span>
                    </div>
                    <Pill className="h-5 w-5 text-purple-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-purple-800 mb-1">
                        <strong>Польза:</strong> {supplement.benefit}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-purple-800 mb-1">
                        <strong>Как принимать:</strong> {supplement.timing}
                      </p>
                    </div>
                    
                    {supplement.interactions && (
                      <div className="p-2 bg-purple-100 rounded">
                        <p className="text-xs text-purple-700">
                          <strong>Взаимодействия:</strong> {supplement.interactions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Если нет связанных данных */}
      {relatedRecommendations.length === 0 && relatedRiskFactors.length === 0 && relatedSupplements.length === 0 && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
              <h3 className="text-lg font-medium mb-2">Показатель в норме</h3>
              <p className="text-sm">
                Для этого биомаркера нет специальных рекомендаций. 
                Ваш показатель находится в пределах нормы.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BiomarkerDetails;
