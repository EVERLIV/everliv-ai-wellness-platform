
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";

interface HealthImprovementAction {
  id: string;
  category: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  actions: string[];
  expectedResult: string;
}

interface HealthImprovementActionsProps {
  actions: HealthImprovementAction[];
}

const HealthImprovementActions: React.FC<HealthImprovementActionsProps> = ({ actions }) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Высокий приоритет</Badge>;
      case 'medium':
        return <Badge variant="secondary">Средний приоритет</Badge>;
      case 'low':
        return <Badge variant="outline">Низкий приоритет</Badge>;
      default:
        return <Badge variant="outline">Обычный</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Действия для улучшения здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {actions.map((action) => (
            <div key={action.id} className="border-l-4 border-blue-200 bg-blue-50 p-4 rounded-r-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-blue-900">{action.title}</h4>
                  <p className="text-sm text-blue-700">{action.category}</p>
                </div>
                {getPriorityBadge(action.priority)}
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-2">Конкретные шаги:</p>
                  <ul className="space-y-1">
                    {action.actions.map((step, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start">
                        <ArrowRight className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-100 p-3 rounded">
                  <p className="text-xs text-blue-800">
                    <strong>Ожидаемый результат:</strong> {action.expectedResult}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthImprovementActions;
