
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getStatusText } from "@/utils/biomarkerUtils";

interface Biomarker {
  name: string;
  value: string;
  unit?: string;
  status: string;
}

interface AnalysisResults {
  markers?: Biomarker[];
  [key: string]: any;
}

interface EditBiomarkersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: {
    id: string;
    analysis_type: string;
    results?: AnalysisResults;
  };
  onSave: () => void;
}

const EditBiomarkersDialog: React.FC<EditBiomarkersDialogProps> = ({
  open,
  onOpenChange,
  analysis,
  onSave,
}) => {
  const [markers, setMarkers] = useState<Biomarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState(false);

  useEffect(() => {
    if (open && analysis.id) {
      loadBiomarkersData();
    }
  }, [open, analysis.id]);

  const loadBiomarkersData = async () => {
    setIsLoadingMarkers(true);
    try {
      // Загружаем полные данные анализа из базы данных
      const { data: fullAnalysis, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('id', analysis.id)
        .single();

      if (error) {
        console.error('Error loading analysis:', error);
        toast.error("Не удалось загрузить данные анализа");
        return;
      }

      // Проверяем и парсим результаты анализа
      if (fullAnalysis?.results && typeof fullAnalysis.results === 'object') {
        const results = fullAnalysis.results as AnalysisResults;
        if (results.markers && Array.isArray(results.markers)) {
          setMarkers([...results.markers]);
        } else {
          // Если нет данных в results.markers, пробуем загрузить из таблицы biomarkers
          const { data: biomarkers, error: biomarkersError } = await supabase
            .from('biomarkers')
            .select('*')
            .eq('analysis_id', analysis.id);

          if (biomarkersError) {
            console.error('Error loading biomarkers:', biomarkersError);
            toast.error("Не удалось загрузить биомаркеры");
            return;
          }

          if (biomarkers && biomarkers.length > 0) {
            const markersData = biomarkers.map(b => ({
              name: b.name,
              value: b.value || '',
              unit: '',
              status: b.status || 'normal'
            }));
            setMarkers(markersData);
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error loading markers:', error);
      toast.error("Произошла ошибка при загрузке данных");
    } finally {
      setIsLoadingMarkers(false);
    }
  };

  const updateMarkerValue = (index: number, newValue: string) => {
    const updatedMarkers = [...markers];
    updatedMarkers[index] = { ...updatedMarkers[index], value: newValue };
    setMarkers(updatedMarkers);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': case 'good': case 'normal':
        return 'bg-green-100 text-green-800';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'risk': case 'high': case 'low': case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Convert markers to plain objects compatible with Json type
      const plainMarkers = markers.map(marker => ({
        name: marker.name,
        value: marker.value,
        unit: marker.unit || null,
        status: marker.status
      }));

      // Загружаем текущие результаты
      const { data: currentAnalysis, error: fetchError } = await supabase
        .from('medical_analyses')
        .select('results')
        .eq('id', analysis.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current analysis:', fetchError);
        toast.error("Не удалось загрузить текущие данные");
        return;
      }

      // Создаем новый объект результатов
      const currentResults = (currentAnalysis.results && typeof currentAnalysis.results === 'object') 
        ? currentAnalysis.results as AnalysisResults 
        : {};

      const updatedResults = {
        ...currentResults,
        markers: plainMarkers
      };

      const { error } = await supabase
        .from('medical_analyses')
        .update({ results: updatedResults as any })
        .eq('id', analysis.id);

      if (error) {
        console.error('Error updating analysis:', error);
        toast.error("Не удалось сохранить изменения");
        return;
      }

      toast.success("Биомаркеры успешно обновлены");
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Произошла ошибка при сохранении");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Редактировать биомаркеры</DialogTitle>
        </DialogHeader>
        
        {isLoadingMarkers ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="max-h-[50vh] pr-2 md:pr-4">
            <div className="space-y-3 md:space-y-4">
              {markers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Биомаркеры не найдены</p>
                </div>
              ) : (
                markers.map((marker, index) => (
                  <div key={index} className="p-3 md:p-4 border rounded-lg space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Label className="font-medium text-sm md:text-base">{marker.name}</Label>
                      <Badge className={`text-xs ${getStatusColor(marker.status)}`}>
                        {getStatusText(marker.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={marker.value}
                          onChange={(e) => updateMarkerValue(index, e.target.value)}
                          placeholder="Значение"
                          className="text-sm md:text-base"
                        />
                      </div>
                      {marker.unit && (
                        <div className="flex items-center px-2 md:px-3 text-xs md:text-sm text-gray-500 bg-gray-50 rounded-md whitespace-nowrap">
                          {marker.unit}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Отмена
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || isLoadingMarkers || markers.length === 0}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBiomarkersDialog;
