import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle, XCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProtocolData } from '@/hooks/useProtocolData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProtocolSupplement } from '@/types/database';

type Supplement = {
  id: string;
  supplement_name: string;
  dosage: string | null;
  taken: boolean;
  taken_at: string | null;
};

export const SupplementsTracker = () => {
  const { id } = useParams();
  const { protocolDay, userId } = useProtocolData(id);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newSupplementName, setNewSupplementName] = useState<string>('');
  const [newSupplementDosage, setNewSupplementDosage] = useState<string>('');
  
  // Fetch supplements for the current day
  useEffect(() => {
    if (!id || !userId || !protocolDay) return;
    
    const fetchSupplements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('protocol_supplements')
          .select('*')
          .eq('protocol_id', id)
          .eq('user_id', userId)
          .eq('day', protocolDay);
        
        if (error) throw error;
        
        setSupplements(data as Supplement[] || []);
      } catch (error) {
        console.error('Error fetching supplements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSupplements();
  }, [id, userId, protocolDay]);
  
  const toggleTaken = async (supplementId: string, currentStatus: boolean) => {
    try {
      const now = new Date().toISOString();
      const updates = {
        taken: !currentStatus,
        taken_at: !currentStatus ? now : null
      };
      
      const { error } = await supabase
        .from('protocol_supplements')
        .update(updates)
        .eq('id', supplementId);
      
      if (error) throw error;
      
      // Update local state
      setSupplements(prev => prev.map(s => 
        s.id === supplementId 
          ? { ...s, taken: !currentStatus, taken_at: !currentStatus ? now : null } 
          : s
      ));
      
      toast.success(!currentStatus ? 'Добавка отмечена как принятая' : 'Отметка о приёме добавки снята');
    } catch (error) {
      console.error('Error updating supplement status:', error);
      toast.error('Не удалось обновить статус добавки');
    }
  };
  
  const addSupplement = async () => {
    if (!newSupplementName.trim() || !id || !userId || !protocolDay) {
      toast.error('Введите название добавки');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('protocol_supplements')
        .insert({
          protocol_id: id,
          user_id: userId,
          day: protocolDay,
          supplement_name: newSupplementName.trim(),
          dosage: newSupplementDosage.trim() || null,
          taken: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setSupplements(prev => [...prev, data as Supplement]);
      setNewSupplementName('');
      setNewSupplementDosage('');
      toast.success('Добавка добавлена');
    } catch (error) {
      console.error('Error adding supplement:', error);
      toast.error('Не удалось добавить добавку');
    }
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Pill size={20} className="mr-2 text-blue-600" />
        Добавки на день {protocolDay}
      </h2>
      
      <div className="space-y-4">
        {supplements.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Нет запланированных добавок на этот день
          </div>
        ) : (
          supplements.map((supplement) => (
            <div 
              key={supplement.id} 
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
            >
              <div>
                <p className="text-sm font-medium">{supplement.supplement_name}</p>
                {supplement.dosage && (
                  <p className="text-xs text-gray-500">{supplement.dosage}</p>
                )}
              </div>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => toggleTaken(supplement.id, supplement.taken)}
              >
                {supplement.taken ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Принято
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                    Отметить как принято
                  </>
                )}
              </Button>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-md font-semibold mb-3">Добавить новую добавку</h3>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название добавки
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              placeholder="Название добавки"
              value={newSupplementName}
              onChange={(e) => setNewSupplementName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дозировка (необязательно)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              placeholder="Дозировка"
              value={newSupplementDosage}
              onChange={(e) => setNewSupplementDosage(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={addSupplement}>
            Добавить добавку
          </Button>
        </div>
      </div>
    </div>
  );
};
