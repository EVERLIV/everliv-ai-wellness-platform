
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Clock, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
        <h2 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>Ключевые рекомендации</h2>
        <Badge variant="secondary">На основе вашего профиля</Badge>
      </div>
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {recommendations.map((rec) => (
          <Card key={rec.id} className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className={`pb-3 ${isMobile ? 'px-4 py-3' : ''}`}>
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-start justify-between'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>{rec.title}</CardTitle>
                    <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>{rec.category}</p>
                  </div>
                </div>
                <Badge className={`${getPriorityColor(rec.priority)} ${isMobile ? 'text-xs self-start' : 'text-xs'}`}>
                  {rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className={`pt-0 ${isMobile ? 'px-4 pb-4' : ''}`}>
              <p className={`text-gray-700 mb-3 ${isMobile ? 'text-xs line-clamp-3' : 'text-sm line-clamp-2'}`}>{rec.description}</p>
              <div className="space-y-2">
                <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  <strong>Действия:</strong>
                  <ul className="mt-1 space-y-1">
                    {rec.specificActions.slice(0, isMobile ? 3 : 2).map((action, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span className={isMobile ? 'text-xs' : ''}>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`flex ${isMobile ? 'flex-col gap-1' : 'items-center gap-4'} text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>
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
