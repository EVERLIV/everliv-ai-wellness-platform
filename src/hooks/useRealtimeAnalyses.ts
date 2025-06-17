
import { useEffect, useState } from 'react';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MedicalAnalysis {
  id: string;
  analysis_type: string;
  summary?: string;
  created_at: string;
}

export const useRealtimeAnalyses = () => {
  const { user } = useSmartAuth();
  const [newAnalyses, setNewAnalyses] = useState<MedicalAnalysis[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`analyses_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'medical_analyses',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newAnalysis = payload.new as MedicalAnalysis;
          
          setNewAnalyses(prev => [...prev, newAnalysis]);
          
          // Show toast notification
          toast({
            title: "Новый анализ готов!",
            description: `Анализ "${newAnalysis.analysis_type}" обработан и доступен для просмотра`,
            duration: 5000,
          });

          // Play notification sound (optional)
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {
              // Ignore audio errors if user hasn't interacted with page yet
            });
          } catch (error) {
            // Ignore audio errors
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { newAnalyses, setNewAnalyses };
};
