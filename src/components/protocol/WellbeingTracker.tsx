
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProtocolData } from '@/hooks/useProtocolData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProtocolWellbeing } from '@/types/database';

export const WellbeingTracker = () => {
  const { id } = useParams();
  const { protocolDay, userId } = useProtocolData(id);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Fetch existing wellbeing data for the current day
  useEffect(() => {
    if (!id || !userId || !protocolDay) return;
    
    const fetchWellbeing = async () => {
      try {
        const { data, error } = await supabase
          .from('protocol_wellbeing')
          .select('*')
          .eq('protocol_id', id)
          .eq('user_id', userId)
          .eq('day', protocolDay)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching wellbeing data:', error);
          return;
        }
        
        if (data) {
          setEnergyLevel((data as ProtocolWellbeing).energy_level);
          setNotes((data as ProtocolWellbeing).notes || '');
        } else {
          // Reset to defaults if no data found
          setEnergyLevel(5);
          setNotes('');
        }
      } catch (error) {
        console.error('Unexpected error fetching wellbeing:', error);
      }
    };
    
    fetchWellbeing();
  }, [id, userId, protocolDay]);
  
  const handleSave = async () => {
    if (!id || !userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('protocol_wellbeing')
        .upsert({
          protocol_id: id,
          user_id: userId,
          day: protocolDay,
          energy_level: energyLevel,
          notes: notes.trim() || null
        }, {
          onConflict: 'protocol_id,user_id,day'
        });
      
      if (error) throw error;
      
      toast.success('Данные о самочувствии сохранены');
    } catch (error) {
      console.error('Error saving wellbeing data:', error);
      toast.error('Не удалось сохранить данные о самочувствии');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <User size={20} className="mr-2 text-blue-600" />
        Самочувствие на день {protocolDay}
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Уровень энергии (0-10)
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="0"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-3 w-6 text-blue-700 font-semibold">{energyLevel}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Низкая</span>
          <span>Средняя</span>
          <span>Высокая</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Заметки о самочувствии
        </label>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Опишите ваше самочувствие, побочные эффекты или другие наблюдения..."
        ></textarea>
      </div>

      <Button 
        className="w-full"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? 'Сохранение...' : 'Сохранить наблюдения'}
      </Button>
    </div>
  );
};
