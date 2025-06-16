
import React, { useState } from 'react';
import { Sparkles, Target, Heart, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { useAuth } from '@/contexts/AuthContext';

const ProtocolRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState('');
  const { results, isSearching, getProtocolRecommendations, clearResults } = useSemanticSearch();

  const handleGetRecommendations = async () => {
    if (goals.trim()) {
      await getProtocolRecommendations(goals);
    }
  };

  const exampleGoals = [
    'Хочу улучшить качество сна и снизить стресс',
    'Интересуют протоколы для повышения энергии и выносливости',
    'Нужна помощь с концентрацией и ментальной ясностью',
    'Хочу укрепить иммунитет естественными методами'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Рекомендации протоколов
          </CardTitle>
          <p className="text-sm text-gray-600">
            Опишите ваши здоровые цели, и AI подберет наиболее подходящие протоколы
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Опишите ваши цели и интересы
            </label>
            <Textarea
              placeholder="Например: Хочу улучшить качество сна, снизить уровень стресса и повысить энергию в течение дня..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGetRecommendations}
              disabled={isSearching || !goals.trim() || !user}
              className="flex-1"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              Получить рекомендации
            </Button>
            {results.length > 0 && (
              <Button variant="outline" onClick={clearResults}>
                Очистить
              </Button>
            )}
          </div>

          {/* Примеры целей */}
          <div>
            <p className="text-sm font-medium mb-2">Примеры целей:</p>
            <div className="flex flex-wrap gap-2">
              {exampleGoals.map((example, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => setGoals(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Рекомендованные протоколы */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              Рекомендованные протоколы
            </h3>
          </div>

          <div className="grid gap-4">
            {results.map((protocol, index) => (
              <Card 
                key={protocol.protocol_id || index}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{protocol.title}</h4>
                        {protocol.description && (
                          <p className="text-gray-600 mb-3">
                            {protocol.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {Math.round(protocol.similarity * 100)}% совпадение
                        </Badge>
                        {protocol.category && (
                          <Badge variant="outline">
                            {protocol.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {protocol.recommendation_reason && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 mb-1">
                              Почему этот протокол подходит вам:
                            </p>
                            <p className="text-sm text-blue-700">
                              {protocol.recommendation_reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          // Здесь можно добавить навигацию к протоколу
                          console.log('Navigate to protocol:', protocol.protocol_id);
                        }}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Изучить протокол
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!user && (
        <Card className="bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-yellow-800">
              Войдите в систему, чтобы получить персональные рекомендации протоколов
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProtocolRecommendations;
