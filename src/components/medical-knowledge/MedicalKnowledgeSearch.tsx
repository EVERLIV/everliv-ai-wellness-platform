
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
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Поиск по симптомам, заболеваниям, ключевым словам..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
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
          className="w-full md:w-auto"
        >
          <Search className="h-4 w-4 mr-2" />
          Найти
        </Button>
      </div>
    </div>
  );
};

export default MedicalKnowledgeSearch;
