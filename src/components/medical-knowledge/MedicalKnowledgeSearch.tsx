
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { MedicalCategory } from '@/types/medical';

interface MedicalKnowledgeSearchProps {
  categories: MedicalCategory[];
  onSearch: (query: string, categoryId?: string) => void;
  isLoading?: boolean;
}

const MedicalKnowledgeSearch: React.FC<MedicalKnowledgeSearchProps> = ({
  categories,
  onSearch,
  isLoading
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSearch = () => {
    onSearch(query, selectedCategory === 'all' ? undefined : selectedCategory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Поиск медицинской информации
        </h2>
        <p className="text-gray-600">
          Найдите информацию о симптомах, заболеваниях и методах лечения
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск по симптомам, заболеваниям, ключевым словам..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full lg:w-64 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <Filter className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Search className="h-5 w-5 mr-2" />
          {isLoading ? 'Поиск...' : 'Найти'}
        </Button>
      </div>
    </div>
  );
};

export default MedicalKnowledgeSearch;
