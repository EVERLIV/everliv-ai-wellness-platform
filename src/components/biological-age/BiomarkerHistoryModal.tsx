import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useBiomarkerHistory } from '@/hooks/useBiomarkerHistory';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BiomarkerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  biomarkerId: string;
  biomarkerName: string;
  unit: string;
}

const BiomarkerHistoryModal: React.FC<BiomarkerHistoryModalProps> = ({
  isOpen,
  onClose,
  biomarkerId,
  biomarkerName,
  unit
}) => {
  const { getBiomarkerHistory } = useBiomarkerHistory();
  const history = getBiomarkerHistory(biomarkerId);

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.01) return { icon: null, color: 'text-gray-500', text: '=' };
    if (diff > 0) return { 
      icon: <TrendingUp className="h-3 w-3" />, 
      color: 'text-red-500', 
      text: `+${diff.toFixed(2)}` 
    };
    return { 
      icon: <TrendingDown className="h-3 w-3" />, 
      color: 'text-green-500', 
      text: diff.toFixed(2) 
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            История: {biomarkerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Нет истории данных</p>
              <p className="text-xs text-gray-500 mt-1">
                Начните вводить значения для отслеживания изменений
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((entry, index) => {
                const previous = history[index + 1];
                const trend = previous ? getTrend(entry.value, previous.value) : null;

                return (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {entry.value} {unit}
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(entry.created_at), 'dd MMM yyyy, HH:mm', { locale: ru })}
                        </div>
                      </div>
                      {trend && (
                        <div className={`flex items-center gap-1 ${trend.color}`}>
                          {trend.icon}
                          <span className="text-sm font-medium">{trend.text}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {entry.source === 'biological_age_calculation' ? 'Расчет' : 'Ввод'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {history.length > 0 && (
            <div className="pt-3 border-t">
              <div className="text-xs text-gray-500 text-center">
                Всего записей: {history.length}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerHistoryModal;