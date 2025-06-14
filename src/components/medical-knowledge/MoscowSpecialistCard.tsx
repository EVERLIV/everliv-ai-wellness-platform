
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoscowSpecialist } from '@/types/medical';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  GraduationCap, 
  Building,
  Languages,
  Award
} from 'lucide-react';

interface MoscowSpecialistCardProps {
  specialist: MoscowSpecialist;
  onSelect: (specialistId: string) => void;
}

const MoscowSpecialistCard: React.FC<MoscowSpecialistCardProps> = ({
  specialist,
  onSelect
}) => {
  const formatPrice = (price?: number) => {
    return price ? `${price.toLocaleString('ru-RU')} ₽` : 'Цена не указана';
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white group h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {specialist.photo_url && (
            <img 
              src={specialist.photo_url}
              alt={specialist.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors mb-1">
              {specialist.name}
            </CardTitle>
            {specialist.specialization?.name && (
              <Badge variant="outline" className="text-xs mb-2">
                {specialist.specialization.name}
              </Badge>
            )}
            
            {specialist.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{specialist.rating}</span>
                {specialist.reviews_count && (
                  <span className="text-xs text-gray-500">
                    ({specialist.reviews_count} отзывов)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {specialist.bio && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {specialist.bio}
          </p>
        )}

        <div className="space-y-2">
          {specialist.experience_years && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Award className="h-3 w-3" />
              <span>Опыт: {specialist.experience_years} лет</span>
            </div>
          )}

          {specialist.education && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <GraduationCap className="h-3 w-3" />
              <span className="line-clamp-1">{specialist.education}</span>
            </div>
          )}

          {specialist.workplace && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Building className="h-3 w-3" />
              <span className="line-clamp-1">{specialist.workplace}</span>
            </div>
          )}

          {specialist.metro_station && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>м. {specialist.metro_station}</span>
            </div>
          )}

          {specialist.working_hours && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{specialist.working_hours}</span>
            </div>
          )}

          {specialist.languages && specialist.languages.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Languages className="h-3 w-3" />
              <span>{specialist.languages.join(', ')}</span>
            </div>
          )}
        </div>

        {specialist.services && specialist.services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {specialist.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
            {specialist.services.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{specialist.services.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm font-medium text-green-600">
            {formatPrice(specialist.consultation_price)}
          </div>
          <Button 
            size="sm" 
            onClick={() => onSelect(specialist.id)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Подробнее
          </Button>
        </div>

        {specialist.phone && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:${specialist.phone}`);
            }}
          >
            <Phone className="h-3 w-3 mr-2" />
            Позвонить
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MoscowSpecialistCard;
