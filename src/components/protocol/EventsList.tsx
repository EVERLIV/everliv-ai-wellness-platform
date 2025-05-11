
import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, Activity, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProtocolData } from '@/hooks/useProtocolData';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string;
  completed: boolean;
};

export const EventsList = () => {
  const { id } = useParams();
  const { userId } = useProtocolData(id);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    event_type: 'reminder'
  });
  
  // Fetch events for this protocol
  useEffect(() => {
    if (!id || !userId) return;
    
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('protocol_events')
          .select('*')
          .eq('protocol_id', id)
          .eq('user_id', userId)
          .order('event_date', { ascending: true });
        
        if (error) throw error;
        
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [id, userId]);
  
  const handleAddEvent = async () => {
    if (!id || !userId) return;
    if (!newEvent.title || !newEvent.event_date) {
      toast.error('Заполните название и дату события');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('protocol_events')
        .insert({
          protocol_id: id,
          user_id: userId,
          title: newEvent.title,
          description: newEvent.description || null,
          event_date: new Date(newEvent.event_date).toISOString(),
          event_type: newEvent.event_type,
          completed: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setEvents(prev => [...prev, data]);
      setIsDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        event_date: '',
        event_type: 'reminder'
      });
      
      toast.success('Событие добавлено');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Не удалось добавить событие');
    }
  };
  
  const toggleEventCompletion = async (eventId: string) => {
    const eventToUpdate = events.find(e => e.id === eventId);
    if (!eventToUpdate) return;
    
    const newStatus = !eventToUpdate.completed;
    
    // Update UI optimistically
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, completed: newStatus } 
          : event
      )
    );
    
    // Update in database
    try {
      const { error } = await supabase
        .from('protocol_events')
        .update({ completed: newStatus })
        .eq('id', eventId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Не удалось обновить статус события');
      
      // Revert UI change if error
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, completed: eventToUpdate.completed } 
            : event
        )
      );
    }
  };
  
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'reminder':
        return <AlertCircle size={18} />;
      case 'appointment':
        return <Calendar size={18} />;
      case 'milestone':
        return <Activity size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };
  
  const getEventColor = (eventType: string, completed: boolean) => {
    if (completed) return 'bg-gray-100 text-gray-500';
    
    switch (eventType) {
      case 'reminder':
        return 'bg-yellow-100 text-yellow-600';
      case 'appointment':
        return 'bg-blue-100 text-blue-600';
      case 'milestone':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };
  
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <AlertCircle size={20} className="mr-2 text-blue-600" />
          События протокола
        </h2>
        <div className="py-6 text-center text-gray-500">Загрузка событий...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <AlertCircle size={20} className="mr-2 text-blue-600" />
          События протокола
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsDialogOpen(true)}
          className="text-xs"
        >
          <Plus size={16} className="mr-1" /> Добавить
        </Button>
      </div>
      
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Нет запланированных событий
          </div>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              className={`flex items-start p-3 rounded-lg border ${event.completed ? 'border-gray-200 opacity-60' : 'border-gray-200'}`}
              onClick={() => toggleEventCompletion(event.id)}
            >
              <div className={`mr-3 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full ${getEventColor(event.event_type, event.completed)}`}>
                {getEventIcon(event.event_type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${event.completed ? 'line-through text-gray-400' : ''}`}>
                    {event.title}
                  </p>
                  <div className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                    {formatEventDate(event.event_date)}
                  </div>
                </div>
                {event.description && (
                  <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новое событие</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                placeholder="Введите название события"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event_date">Дата</Label>
              <Input
                id="event_date"
                type="date"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event_type">Тип события</Label>
              <select 
                id="event_type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newEvent.event_type}
                onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
              >
                <option value="reminder">Напоминание</option>
                <option value="appointment">Встреча</option>
                <option value="milestone">Этап</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Описание (необязательно)</Label>
              <Input
                id="description"
                placeholder="Введите описание события"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddEvent}>
              Добавить событие
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
