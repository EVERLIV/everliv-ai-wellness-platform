
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Clock, Star } from "lucide-react";

interface KeyRecommendation {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  specificActions: string[];
  timeframe: string;
  cost?: string;
}

interface KeyRecommendationsProps {
  recommendations: KeyRecommendation[];
}

const KeyRecommendations: React.FC<KeyRecommendationsProps> = ({ recommendations }) => {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (recommendations.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Ключевые рекомендации</h2>
        <Badge variant="secondary">На основе вашего профиля</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
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
              <div className="space-y-2">
                <div className="text-xs text-gray-600">
                  <strong>Действия:</strong>
                  <ul className="mt-1 space-y-1">
                    {rec.specificActions.slice(0, 2).map((action, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default KeyRecommendations;
