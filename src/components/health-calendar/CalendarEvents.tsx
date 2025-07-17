import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2, Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarEventsProps {
  currentDate: Date;
  selectedDate?: Date;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  isCompleted: boolean;
}

const CalendarEvents = ({ currentDate, selectedDate }: CalendarEventsProps) => {
  const isMobile = useIsMobile();
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Прием у врача',
      description: 'Плановый осмотр у терапевта',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      type: 'health',
      location: 'Поликлиника №1',
      isCompleted: false
    },
    {
      id: 2,
      title: 'Тренировка',
      description: 'Кардио тренировка в зале',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '18:00',
      type: 'fitness',
      isCompleted: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    time: '',
    type: 'health',
    location: ''
  });

  const eventTypes = [
    { value: 'health', label: 'Здоровье', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'fitness', label: 'Фитнес', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'appointment', label: 'Встреча', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'medication', label: 'Лекарства', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'other', label: 'Другое', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time) {
      const event: Event = {
        id: Date.now(),
        ...newEvent,
        isCompleted: false
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        description: '',
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        time: '',
        type: 'health',
        location: ''
      });
      setShowAddForm(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      location: event.location || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateEvent = () => {
    if (editingEvent && newEvent.title && newEvent.time) {
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...editingEvent, ...newEvent }
          : e
      ));
      setEditingEvent(null);
      setNewEvent({
        title: '',
        description: '',
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        time: '',
        type: 'health',
        location: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const toggleEventComplete = (id: number) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, isCompleted: !e.isCompleted } : e
    ));
  };

  const getEventTypeInfo = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[0];
  };

  const todayEvents = getEventsForDate(selectedDate || new Date());

  return (
    <div className="space-y-2">
      {/* Add Event Button */}
      <Button 
        variant="outline" 
        className="w-full text-[10px] h-6 rounded-none border-gray-300"
        onClick={() => setShowAddForm(true)}
      >
        <Plus className="h-3 w-3 mr-1" />
        Добавить событие
      </Button>

      {/* Add/Edit Event Form */}
      {showAddForm && (
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-xs font-medium">
              {editingEvent ? 'Редактировать событие' : 'Новое событие'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="space-y-2">
              <div>
                <Label htmlFor="title" className="text-[10px]">Название</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Название события"
                  className="h-6 text-[10px] rounded-none border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-[10px]">Описание</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Описание"
                  className="h-12 text-[10px] rounded-none border-gray-300 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <Label htmlFor="date" className="text-[10px]">Дата</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="h-6 text-[10px] rounded-none border-gray-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time" className="text-[10px]">Время</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="h-6 text-[10px] rounded-none border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="type" className="text-[10px]">Тип</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                  <SelectTrigger className="h-6 text-[10px] rounded-none border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-[10px]">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location" className="text-[10px]">Место</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Место проведения"
                  className="h-6 text-[10px] rounded-none border-gray-300"
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent} 
                  size="xs" 
                  className="h-6 text-[10px] rounded-none"
                >
                  {editingEvent ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEvent(null);
                    setNewEvent({
                      title: '',
                      description: '',
                      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                      time: '',
                      type: 'health',
                      location: ''
                    });
                  }} 
                  size="xs" 
                  className="h-6 text-[10px] rounded-none border-gray-300"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="space-y-1">
        {todayEvents.length === 0 ? (
          <div className="text-center py-2 text-[10px] text-muted-foreground">
            Нет событий на этот день
          </div>
        ) : (
          todayEvents.map((event) => {
            const typeInfo = getEventTypeInfo(event.type);
            return (
              <Card key={event.id} className={`shadow-none border-gray-200/80 rounded-none ${event.isCompleted ? 'opacity-60' : ''}`}>
                <CardContent className="p-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <Badge className={`text-[8px] px-1 py-0 h-auto rounded-none ${typeInfo.color}`}>
                          {typeInfo.label}
                        </Badge>
                        <div className="flex items-center text-[9px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5 mr-0.5" />
                          {event.time}
                        </div>
                      </div>
                      
                      <div className={`text-[10px] font-medium mb-0.5 ${event.isCompleted ? 'line-through' : ''}`}>
                        {event.title}
                      </div>
                      
                      {event.description && (
                        <div className="text-[9px] text-muted-foreground mb-1">
                          {event.description}
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center text-[9px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5 mr-0.5" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => toggleEventComplete(event.id)}
                        className="h-5 w-5 p-0 rounded-none"
                      >
                        <div className={`w-3 h-3 border border-gray-400 rounded-sm ${event.isCompleted ? 'bg-primary' : ''}`}>
                          {event.isCompleted && <div className="w-full h-full flex items-center justify-center text-white text-[8px]">✓</div>}
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleEditEvent(event)}
                        className="h-5 w-5 p-0 rounded-none"
                      >
                        <Edit2 className="h-2.5 w-2.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="h-5 w-5 p-0 rounded-none text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CalendarEvents;