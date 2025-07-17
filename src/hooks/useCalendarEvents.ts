import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  event_type: 'analysis' | 'appointment' | 'reminder' | 'custom';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'completed' | 'cancelled';
  related_data?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  event_date: Date;
  event_time?: string;
  event_type: 'analysis' | 'appointment' | 'reminder' | 'custom';
  priority: 'high' | 'medium' | 'low';
  related_data?: any;
}

export const useCalendarEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async (startDate?: Date, endDate?: Date) => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

      if (startDate) {
        query = query.gte('event_date', format(startDate, 'yyyy-MM-dd'));
      }
      if (endDate) {
        query = query.lte('event_date', format(endDate, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить события",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData): Promise<CalendarEvent | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: eventData.title,
          description: eventData.description,
          event_date: format(eventData.event_date, 'yyyy-MM-dd'),
          event_time: eventData.event_time,
          event_type: eventData.event_type,
          priority: eventData.priority,
          related_data: eventData.related_data
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Событие создано",
        description: `${eventData.title} добавлено в календарь`
      });

      // Обновляем локальный список событий
      setEvents(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать событие",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<CreateEventData & { status: 'planned' | 'completed' | 'cancelled' }>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updateData: any = { ...updates };
      if (updates.event_date) {
        updateData.event_date = format(updates.event_date, 'yyyy-MM-dd');
      }

      const { error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Обновляем локальный список событий
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, ...updateData } : event
      ));

      toast({
        title: "Событие обновлено",
        description: "Изменения сохранены"
      });

      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить событие",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Удаляем из локального списка
      setEvents(prev => prev.filter(event => event.id !== eventId));

      toast({
        title: "Событие удалено",
        description: "Событие успешно удалено из календаря"
      });

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить событие",
        variant: "destructive"
      });
      return false;
    }
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.event_date === dateStr);
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  return {
    events,
    isLoading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate
  };
};