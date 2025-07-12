import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  Heart, 
  Brain, 
  Shield,
  BookOpen,
  Calendar,
  Target,
  Users
} from 'lucide-react';
import { BIOMARKER_CATEGORIES } from '@/types/biomarker';
import type { BiomarkerKnowledge } from '@/types/biomarker';

interface BiomarkerDetailDialogProps {
  biomarker: BiomarkerKnowledge | null;
  isOpen: boolean;
  onClose: () => void;
}

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({
  biomarker,
  isOpen,
  onClose,
}) => {
  if (!biomarker) return null;

  const getCategoryInfo = (categoryId: string) => {
    return BIOMARKER_CATEGORIES.find(cat => cat.id === categoryId);
  };

  const categoryInfo = getCategoryInfo(biomarker.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{biomarker.name}</DialogTitle>
              {biomarker.alternativeNames && (
                <p className="text-sm text-muted-foreground mt-1">
                  Альтернативные названия: {biomarker.alternativeNames.join(', ')}
                </p>
              )}
            </div>
            {categoryInfo && (
              <Badge className={`${categoryInfo.color} text-white`}>
                {categoryInfo.name}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="space-y-6 pr-4">
            {/* Основная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Основная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Описание</h4>
                  <p className="text-sm text-muted-foreground">{biomarker.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Функция</h4>
                  <p className="text-sm text-muted-foreground">{biomarker.function}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Что измеряет</h4>
                  <p className="text-sm text-muted-foreground">{biomarker.whatItMeasures}</p>
                </div>
              </CardContent>
            </Card>

            {/* Нормальные значения */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Референсные значения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {biomarker.normalRanges.general && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Общие</p>
                      <p className="text-sm">{biomarker.normalRanges.general}</p>
                    </div>
                  )}
                  {biomarker.normalRanges.men && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Мужчины</p>
                      <p className="text-sm">{biomarker.normalRanges.men}</p>
                    </div>
                  )}
                  {biomarker.normalRanges.women && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Женщины</p>
                      <p className="text-sm">{biomarker.normalRanges.women}</p>
                    </div>
                  )}
                  {biomarker.normalRanges.children && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Дети</p>
                      <p className="text-sm">{biomarker.normalRanges.children}</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Единицы измерения: {biomarker.unit}
                </p>
              </CardContent>
            </Card>

            {/* Клиническое значение */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Повышенные значения */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Повышенные значения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Причины</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {biomarker.clinicalSignificance.high.causes.map((cause, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Симптомы</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {biomarker.clinicalSignificance.high.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Рекомендации</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {biomarker.clinicalSignificance.high.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-red-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Пониженные значения */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingDown className="h-5 w-5" />
                    Пониженные значения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Причины</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {biomarker.clinicalSignificance.low.causes.map((cause, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-orange-500">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Симптомы</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {biomarker.clinicalSignificance.low.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-orange-500">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Рекомендации</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {biomarker.clinicalSignificance.low.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-orange-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Дополнительная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Подготовка к анализу */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Подготовка к анализу
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {biomarker.preparation.map((prep, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        {prep}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Связанные анализы */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Связанные анализы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {biomarker.relatedTests.map((test, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {test}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Частота и факторы риска */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Частота исследования
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{biomarker.frequency}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Факторы риска
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {biomarker.riskFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-orange-500">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Теги и источник */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Теги</h4>
                    <div className="flex flex-wrap gap-1">
                      {biomarker.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Источник: {biomarker.source === 'minzdrav' ? 'Минздрав РФ' : biomarker.source}</span>
                    <span>Обновлено: {new Date(biomarker.lastUpdated).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerDetailDialog;