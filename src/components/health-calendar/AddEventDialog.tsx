import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCalendarEvents, CreateEventData } from '@/hooks/useCalendarEvents';

interface AddEventDialogProps {
  selectedDate: Date;
  prefilledData?: Partial<CreateEventData>;
  triggerButton?: React.ReactNode;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({ 
  selectedDate, 
  prefilledData,
  triggerButton 
}) => {
  const { createEvent } = useCalendarEvents();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    title: prefilledData?.title || '',
    description: prefilledData?.description || '',
    event_date: selectedDate,
    event_time: prefilledData?.event_time || '',
    event_type: prefilledData?.event_type || 'custom',
    priority: prefilledData?.priority || 'medium',
    related_data: prefilledData?.related_data || null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const result = await createEvent(formData);
    
    if (result) {
      // Если есть callback функция в related_data, вызываем её
      if (formData.related_data?.onSave) {
        await formData.related_data.onSave(formData.event_date);
      }
      
      setOpen(false);
      // Сбрасываем форму  
      setFormData({
        title: '',
        description: '',
        event_date: selectedDate,
        event_time: '',
        event_type: 'custom',
        priority: 'medium',
        related_data: null
      });
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="xs"
      className="h-6 px-2 text-xs rounded-none border-gray-300"
    >
      <Plus className="h-3 w-3 mr-1" />
      Добавить
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4" />
            Новое событие
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs">Название*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Название события"
              className="h-8 text-xs"
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Дополнительная информация"
              className="min-h-16 text-xs resize-none"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="event_date" className="text-xs">Дата*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-8 text-xs justify-start text-left font-normal",
                    !formData.event_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {formData.event_date ? format(formData.event_date, "d MMMM yyyy", { locale: ru }) : "Выберите дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.event_date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, event_date: date }))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="event_type" className="text-xs">Тип</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, event_type: value }))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analysis">Анализ</SelectItem>
                  <SelectItem value="appointment">Приём</SelectItem>
                  <SelectItem value="reminder">Напоминание</SelectItem>
                  <SelectItem value="custom">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="priority" className="text-xs">Приоритет</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="event_time" className="text-xs">Время (необязательно)</Label>
            <Input
              id="event_time"
              type="time"
              value={formData.event_time}
              onChange={(e) => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
              className="h-8 text-xs"
            />
          </div>


          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 px-3 text-xs"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={!formData.title.trim()}
            >
              Создать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;