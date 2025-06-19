
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, Clock, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import { RecommendedTest } from '@/utils/comprehensiveHealthAnalyzer';

interface RecommendedTestsSectionProps {
  tests: RecommendedTest[];
}

const RecommendedTestsSection: React.FC<RecommendedTestsSectionProps> = ({ tests }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood': return <TestTube className="h-4 w-4 text-red-600" />;
      case 'urine': return <TestTube className="h-4 w-4 text-yellow-600" />;
      case 'imaging': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'functional': return <AlertCircle className="h-4 w-4 text-purple-600" />;
      default: return <TestTube className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <TestTube className="h-5 w-5" />
          Рекомендуемые анализы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getTypeIcon(test.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{test.name}</h4>
                      <Badge className={`text-xs ${getPriorityColor(test.priority)} border`}>
                        {test.priority === 'urgent' ? 'Срочно' :
                         test.priority === 'high' ? 'Высокий' :
                         test.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{test.reason}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{test.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{test.expectedCost}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Тип: </span>
                        <span className="text-gray-700 capitalize">{test.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Подготовка:</h5>
                  <ul className="space-y-1">
                    {test.preparation.map((prep, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {prep}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">Интерпретация результатов:</h5>
                  <p className="text-sm text-gray-700">{test.interpretation}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Дальнейшие шаги:</h5>
                  <ul className="space-y-1">
                    {test.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Записаться на анализ
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTestsSection;
