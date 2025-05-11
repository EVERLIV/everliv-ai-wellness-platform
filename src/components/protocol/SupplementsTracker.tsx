
import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProtocolData } from '@/hooks/useProtocolData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Supplement = {
  id: string;
  supplement_name: string;
  dose: string;
  taken: boolean;
  scheduled_time?: string | null;
};

export const SupplementsTracker = () => {
  const { id } = useParams();
  const { protocolDay, userId } = useProtocolData(id);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch supplements for the current protocol and day
  useEffect(() => {
    if (!id || !userId || !protocolDay) return;
    
    const fetchSupplements = async () => {
      setIsLoading(true);
      try {
        // First check if we have supplements for this day
        const { data, error } = await supabase
          .from('protocol_supplements')
          .select('*')
          .eq('protocol_id', id)
          .eq('user_id', userId)
          .eq('day', protocolDay);
        
        if (error) throw error;
        
        // If we have supplements for this day, use them
        if (data && data.length > 0) {
          setSupplements(data);
        } else {
          // If not, we'll get the default protocol supplements (could be from a template)
          // For now, let's use some defaults based on the protocol day
          const defaultSupplements = [
            {
              id: crypto.randomUUID(),
              supplement_name: "Коэнзим Q10",
              dose: "200 мг",
              taken: false,
              scheduled_time: "До завтрака"
            },
            {
              id: crypto.randomUUID(),
              supplement_name: "L-карнитин",
              dose: "1,5 г",
              taken: false,
              scheduled_time: "После завтрака"
            },
            {
              id: crypto.randomUUID(),
              supplement_name: "Альфа-липоевая кислота",
              dose: "600 мг",
              taken: false,
              scheduled_time: "До обеда"
            }
          ];
          
          // If we're past day 14, add more supplements
          if (protocolDay > 14) {
            defaultSupplements.push({
              id: crypto.randomUUID(),
              supplement_name: "Никотинамид рибозид",
              dose: "500 мг",
              taken: false,
              scheduled_time: "После обеда"
            });
          }
          
          // If we're past day 30, add more supplements
          if (protocolDay > 30) {
            defaultSupplements.push({
              id: crypto.randomUUID(),
              supplement_name: "Ресвератрол",
              dose: "150 мг",
              taken: false,
              scheduled_time: "С ужином"
            });
          }
          
          setSupplements(defaultSupplements);
          
          // Save these default supplements to the database
          for (const supplement of defaultSupplements) {
            await supabase.from('protocol_supplements').insert({
              protocol_id: id,
              user_id: userId,
              day: protocolDay,
              supplement_name: supplement.supplement_name,
              dose: supplement.dose,
              taken: false,
              scheduled_time: supplement.scheduled_time
            });
          }
        }
      } catch (error) {
        console.error('Error fetching supplements:', error);
        toast.error('Не удалось загрузить список добавок');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSupplements();
  }, [id, userId, protocolDay]);
  
  const toggleSupplement = async (supplementId: string) => {
    // Find and update the supplement in our local state
    const updatedSupplements = supplements.map(supplement => 
      supplement.id === supplementId 
        ? { ...supplement, taken: !supplement.taken } 
        : supplement
    );
    
    setSupplements(updatedSupplements);
    
    // Update in database
    const supplementToUpdate = updatedSupplements.find(s => s.id === supplementId);
    if (!supplementToUpdate) return;
    
    try {
      const { error } = await supabase
        .from('protocol_supplements')
        .update({ 
          taken: supplementToUpdate.taken,
          taken_at: supplementToUpdate.taken ? new Date().toISOString() : null 
        })
        .eq('id', supplementId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating supplement:', error);
      toast.error('Не удалось обновить статус приема добавки');
      
      // Revert the change in our state
      setSupplements(prevState => 
        prevState.map(supplement => 
          supplement.id === supplementId 
            ? { ...supplement, taken: !supplement.taken } 
            : supplement
        )
      );
    }
  };
  
  const markAllTaken = async () => {
    if (supplements.every(s => s.taken)) return; // All already taken
    
    // Update all supplements in our local state
    const updatedSupplements = supplements.map(supplement => ({ 
      ...supplement, 
      taken: true 
    }));
    
    setSupplements(updatedSupplements);
    
    // Update all in database
    try {
      const updates = updatedSupplements
        .filter(s => !s.taken)
        .map(s => ({
          id: s.id,
          taken: true,
          taken_at: new Date().toISOString()
        }));
      
      if (updates.length === 0) return;
      
      const { error } = await supabase
        .from('protocol_supplements')
        .upsert(updates);
      
      if (error) throw error;
      
      toast.success('Все добавки отмечены как принятые');
    } catch (error) {
      console.error('Error marking all supplements as taken:', error);
      toast.error('Не удалось обновить статус приема добавок');
      
      // Revert the change in our state
      const { data } = await supabase
        .from('protocol_supplements')
        .select('*')
        .eq('protocol_id', id as string)
        .eq('user_id', userId as string)
        .eq('day', protocolDay);
      
      if (data) {
        setSupplements(data);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-blue-600" />
          Добавки на день {protocolDay}
        </h2>
        <div className="py-6 text-center text-gray-500">Загрузка списка добавок...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar size={20} className="mr-2 text-blue-600" />
        Добавки на день {protocolDay}
      </h2>
      
      <div className="space-y-3">
        {supplements.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            На этот день не назначены добавки
          </div>
        ) : (
          supplements.map((supplement) => (
            <div 
              key={supplement.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer 
                ${supplement.taken ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}
              onClick={() => toggleSupplement(supplement.id)}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center 
                  ${supplement.taken ? 'bg-green-500 text-white' : 'bg-white border border-gray-300'}`}>
                  {supplement.taken && <CheckCircle size={14} />}
                </div>
                <div>
                  <div className="font-medium text-sm">{supplement.supplement_name}</div>
                  <div className="text-xs text-gray-500">{supplement.dose}</div>
                </div>
              </div>
              <div className="text-xs">
                {supplement.taken ? (
                  <span className="text-green-600">Принято</span>
                ) : (
                  <span className="text-gray-400">{supplement.scheduled_time}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {supplements.length > 0 && (
        <div className="mt-4 flex">
          <Button 
            variant="outline"
            className="w-full"
            onClick={markAllTaken}
            disabled={supplements.every(s => s.taken)}
          >
            <CheckCircle size={16} className="mr-2" />
            Отметить все как принятые
          </Button>
        </div>
      )}
    </div>
  );
};
