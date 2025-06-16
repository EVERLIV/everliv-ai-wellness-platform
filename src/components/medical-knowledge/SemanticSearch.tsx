
import React, { useState } from 'react';
import { Search, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';

interface SemanticSearchProps {
  onArticleSelect?: (articleId: string) => void;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({ onArticleSelect }) => {
  const [query, setQuery] = useState('');
  const { results, isSearching, searchMedicalArticles, clearResults } = useSemanticSearch();

  const handleSearch = async () => {
    if (query.trim()) {
      await searchMedicalArticles(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Поисковая форма */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Семантический поиск медицинских статей
          </CardTitle>
          <p className="text-sm text-gray-600">
            Используйте AI для поиска статей по смыслу, а не только по ключевым словам
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Например: 'как снизить воспаление в организме естественными методами'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="min-w-[100px]"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Найти
                </>
              )}
            </Button>
          </div>
          
          {results.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearResults}
              className="mt-2"
            >
              Очистить результаты
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Результаты поиска */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">
              Найдено {results.length} релевантных статей
            </h3>
          </div>

          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card 
                key={result.article_id || index}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => result.article_id && onArticleSelect?.(result.article_id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{result.title}</h4>
                      {result.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {result.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {Math.round(result.similarity * 100)}% релевантность
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Подсказки по использованию */}
      {results.length === 0 && !isSearching && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Как работает семантический поиск?
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Поиск понимает смысл вашего запроса, а не только ключевые слова</p>
              <p>• Можете задавать вопросы естественным языком</p>
              <p>• Находит статьи даже если они не содержат точных слов из запроса</p>
              <p>• Чем подробнее запрос, тем точнее результаты</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Примеры запросов:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'профилактика сердечно-сосудистых заболеваний',
                  'как улучшить качество сна',
                  'натуральные способы снижения стресса',
                  'питание при диабете'
                ].map((example) => (
                  <Badge 
                    key={example}
                    variant="outline" 
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() => setQuery(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SemanticSearch;
