import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BiomarkerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  biomarker: {
    name: string;
    latestValue: string;
    lastUpdated: string;
    status: 'normal' | 'high' | 'low';
  } | null;
  onSave: (data: {
    value: string;
    date: Date;
    status: 'normal' | 'high' | 'low';
  }) => void;
}

const BiomarkerEditDialog: React.FC<BiomarkerEditDialogProps> = ({
  isOpen,
  onClose,
  biomarker,
  onSave,
}) => {
  const [value, setValue] = useState(biomarker?.latestValue || '');
  const [date, setDate] = useState<Date>(biomarker ? new Date(biomarker.lastUpdated) : new Date());
  const [status, setStatus] = useState<'normal' | 'high' | 'low'>(biomarker?.status || 'normal');

  const handleSave = () => {
    onSave({
      value,
      date,
      status,
    });
    onClose();
  };

  if (!biomarker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать {biomarker.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="value">Значение</Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите значение"
            />
          </div>

          <div>
            <Label>Дата анализа</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'dd MMMM yyyy', { locale: ru })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="status">Статус</Label>
            <Select value={status} onValueChange={(value: 'normal' | 'high' | 'low') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">В норме</SelectItem>
                <SelectItem value="high">Выше нормы</SelectItem>
                <SelectItem value="low">Ниже нормы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Сохранить
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerEditDialog;