
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, X } from 'lucide-react';
import { useSpecialistSearch } from '@/hooks/useSpecialistSearch';
import SpecialistSearchCard from './SpecialistSearchCard';
import EmptyState from './EmptyState';

interface AISpecialistSearchProps {
  onSpecialistSelect: (specialistId: string) => void;
}

const AISpecialistSearch: React.FC<AISpecialistSearchProps> = ({
  onSpecialistSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchSpecialists, isSearching, searchResults, clearResults } = useSpecialistSearch();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await searchSpecialists(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearResults();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Поиск специалистов с ИИ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Опишите вашу проблему или найдите нужного специалиста..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={handleClear}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim() || isSearching}
              className="w-full sm:w-auto"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Поиск...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Найти
                </>
              )}
            </Button>
          </div>
          
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Например: "болит голова", "проблемы с сердцем", "нужен кардиолог"
            </p>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Найдено специалистов: {searchResults.length}
            </h3>
            <Button variant="outline" onClick={handleClear} size="sm">
              Очистить результаты
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((result, index) => (
              <SpecialistSearchCard
                key={`${result.specialist.id}-${index}`}
                result={result}
                onSelect={onSpecialistSelect}
              />
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && !isSearching && searchQuery && (
        <EmptyState
          icon={Search}
          title="Специалисты не найдены"
          description="Попробуйте изменить поисковый запрос или описать проблему по-другому."
        />
      )}
    </div>
  );
};

export default AISpecialistSearch;
