
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Phone, MapPin, Clock } from 'lucide-react';

interface SpecialistSearchResult {
  specialist: any;
  relevanceScore: number;
  summary: string;
}

interface SpecialistSearchCardProps {
  result: SpecialistSearchResult;
  onSelect: (specialistId: string) => void;
}

const SpecialistSearchCard: React.FC<SpecialistSearchCardProps> = ({
  result,
  onSelect
}) => {
  const { specialist, relevanceScore, summary } = result;

  const formatPrice = (price?: number) => {
    return price ? `${price.toLocaleString('ru-RU')} ₽` : 'Цена не указана';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex items-start gap-3 flex-1">
            {specialist.photo_url && (
              <img 
                src={specialist.photo_url}
                alt={specialist.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight mb-1 break-words">
                {specialist.name}
              </CardTitle>
              {specialist.specialization?.name && (
                <Badge variant="outline" className="text-xs mb-2">
                  {specialist.specialization.name}
                </Badge>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {specialist.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{specialist.rating}</span>
                  </div>
                )}
                <Badge variant="secondary" className="text-xs">
                  Релевантность: {relevanceScore}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">
            {summary}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
          {specialist.experience_years && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Опыт: {specialist.experience_years} лет</span>
            </div>
          )}
          
          {specialist.metro_station && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>м. {specialist.metro_station}</span>
            </div>
          )}
        </div>

        {specialist.workplace && (
          <p className="text-xs text-gray-600 line-clamp-1">
            {specialist.workplace}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          <div className="text-sm font-medium text-green-600 sm:flex-1">
            {formatPrice(specialist.consultation_price)}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => onSelect(specialist.id)}
              className="flex-1 sm:flex-none"
            >
              Подробнее
            </Button>
            {specialist.phone && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${specialist.phone}`);
                }}
              >
                <Phone className="h-3 w-3 mr-1" />
                Звонок
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialistSearchCard;
