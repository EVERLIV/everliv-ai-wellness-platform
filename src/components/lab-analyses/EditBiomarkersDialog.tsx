
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

interface Biomarker {
  name: string;
  value: string;
  unit?: string;
  status: string;
}

interface EditBiomarkersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: {
    id: string;
    analysis_type: string;
    results?: {
      markers?: Biomarker[];
      [key: string]: any;
    };
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

  useEffect(() => {
    if (analysis.results?.markers) {
      setMarkers([...analysis.results.markers]);
    }
  }, [analysis]);

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

      const updatedResults = {
        ...analysis.results,
        markers: markers
      };

      const { error } = await supabase
        .from('medical_analyses')
        .update({ results: updatedResults })
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
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Редактировать биомаркеры</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-4">
            {markers.map((marker, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">{marker.name}</Label>
                  <Badge className={`text-xs ${getStatusColor(marker.status)}`}>
                    {marker.status}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={marker.value}
                      onChange={(e) => updateMarkerValue(index, e.target.value)}
                      placeholder="Значение"
                    />
                  </div>
                  {marker.unit && (
                    <div className="flex items-center px-3 text-sm text-gray-500 bg-gray-50 rounded-md">
                      {marker.unit}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBiomarkersDialog;
