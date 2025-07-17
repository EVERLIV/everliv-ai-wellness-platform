import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, TestTube, User, Bell, CheckCircle, XCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useCalendarEvents, CalendarEvent } from '@/hooks/useCalendarEvents';

interface CalendarEventsProps {
  selectedDate: Date | null;
}

const CalendarEvents: React.FC<CalendarEventsProps> = ({ selectedDate }) => {
  const { getEventsForDate, updateEvent, deleteEvent } = useCalendarEvents();
  const currentSelectedDate = selectedDate || new Date();
  const events = getEventsForDate(currentSelectedDate);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <TestTube className="h-3 w-3" />;
      case 'appointment': return <User className="h-3 w-3" />;
      case 'reminder': return <Bell className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'cancelled': return <XCircle className="h-3 w-3 text-red-600" />;
      default: return <Circle className="h-3 w-3 text-gray-400" />;
    }
  };

  const handleStatusChange = async (event: CalendarEvent, newStatus: 'planned' | 'completed' | 'cancelled') => {
    await updateEvent(event.id, { status: newStatus });
  };

  const handleDelete = async (eventId: string) => {
    if (confirm('Вы уверены, что хотите удалить это событие?')) {
      await deleteEvent(eventId);
    }
  };

  if (events.length === 0) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium">События</div>
        <div className="text-center py-4 text-[10px] text-muted-foreground">
          На {format(currentSelectedDate, 'd MMMM', { locale: ru })} событий нет
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium">
        События ({events.length})
      </div>
      <div className="text-[10px] text-muted-foreground">
        На {format(currentSelectedDate, 'd MMMM yyyy', { locale: ru })}
      </div>
      
      <div className="space-y-1">
        {events.map((event) => (
          <Card key={event.id} className="shadow-none border-gray-200/80 rounded-none">
            <CardContent className="p-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    {getEventIcon(event.event_type)}
                    <Badge className={`text-[8px] px-1 py-0 h-auto rounded-none ${getPriorityColor(event.priority)}`}>
                      {event.priority === 'high' ? 'Высокий' : 
                       event.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </Badge>
                    {getStatusIcon(event.status)}
                  </div>
                  
                  <div className="text-[10px] font-medium mb-0.5">
                    {event.title}
                  </div>
                  
                  {event.description && (
                    <div className="text-[9px] text-muted-foreground mb-1">
                      {event.description}
                    </div>
                  )}
                  
                  {event.event_time && (
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {event.event_time}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-0.5 ml-2">
                  {event.status === 'planned' && (
                    <>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleStatusChange(event, 'completed')}
                        className="h-5 w-5 p-0 rounded-none"
                        title="Отметить как выполненное"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleStatusChange(event, 'cancelled')}
                        className="h-5 w-5 p-0 rounded-none"
                        title="Отменить"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDelete(event.id)}
                    className="h-5 w-5 p-0 rounded-none text-red-600 hover:text-red-800"
                    title="Удалить"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CalendarEvents;