import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { BIOMARKER_KNOWLEDGE, searchBiomarkers, getBiomarkersByCategory } from '@/data/biomarkerKnowledge';
import { BIOMARKER_CATEGORIES } from '@/types/biomarker';
import BiomarkerDetailDialog from './BiomarkerDetailDialog';
import type { BiomarkerKnowledge } from '@/types/biomarker';

interface BiomarkersTabProps {
  searchQuery?: string;
}

const BiomarkersTab: React.FC<BiomarkersTabProps> = ({ searchQuery = '' }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBiomarker, setSelectedBiomarker] = useState<BiomarkerKnowledge | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Фильтрация биомаркеров
  const filteredBiomarkers = React.useMemo(() => {
    let result = BIOMARKER_KNOWLEDGE;
    
    if (localSearchQuery) {
      result = searchBiomarkers(localSearchQuery);
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(biomarker => biomarker.category === selectedCategory);
    }
    
    return result;
  }, [localSearchQuery, selectedCategory]);

  // Обновляем счетчики категорий
  const categoriesWithCounts = BIOMARKER_CATEGORIES.map(category => ({
    ...category,
    count: BIOMARKER_KNOWLEDGE.filter(biomarker => biomarker.category === category.id).length
  }));

  const handleBiomarkerClick = (biomarker: BiomarkerKnowledge) => {
    setSelectedBiomarker(biomarker);
    setIsDetailOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const categoryData = BIOMARKER_CATEGORIES.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  const getCategoryName = (category: string) => {
    const categoryData = BIOMARKER_CATEGORIES.find(cat => cat.id === category);
    return categoryData?.name || category;
  };

  const getStatusIcon = (value: number) => {
    if (value > 100) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (value < 80) return <TrendingUp className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск биомаркеров..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center justify-between w-full">
                <span>Все биомаркеры</span>
                <Badge variant="secondary" className="ml-2">
                  {BIOMARKER_KNOWLEDGE.length}
                </Badge>
              </div>
            </SelectItem>
            {categoriesWithCounts.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Сетка биомаркеров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBiomarkers.map((biomarker) => (
          <Card 
            key={biomarker.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleBiomarkerClick(biomarker)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">{biomarker.name}</CardTitle>
                  {biomarker.alternativeNames && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {biomarker.alternativeNames.join(', ')}
                    </p>
                  )}
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getCategoryColor(biomarker.category)} text-white text-xs`}
                >
                  {getCategoryName(biomarker.category).split(' ')[0]}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Нормальные значения */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Норма:</p>
                  <div className="space-y-1">
                    {biomarker.normalRanges.general && (
                      <p className="text-xs">{biomarker.normalRanges.general}</p>
                    )}
                    {biomarker.normalRanges.men && (
                      <p className="text-xs">М: {biomarker.normalRanges.men}</p>
                    )}
                    {biomarker.normalRanges.women && (
                      <p className="text-xs">Ж: {biomarker.normalRanges.women}</p>
                    )}
                  </div>
                </div>

                {/* Описание */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {biomarker.description}
                </p>

                {/* Теги */}
                <div className="flex flex-wrap gap-1">
                  {biomarker.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {biomarker.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{biomarker.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Кнопка подробнее */}
                <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredBiomarkers.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Биомаркеры не найдены</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить критерии поиска или выбрать другую категорию
          </p>
        </div>
      )}

      {/* Диалог детального просмотра */}
      <BiomarkerDetailDialog
        biomarker={selectedBiomarker}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default BiomarkersTab;