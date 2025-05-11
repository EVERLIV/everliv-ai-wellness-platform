import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type Protocol = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: string;
  status: string;
  benefits: string[];
  steps: string[];
  completion_percentage: number;
  started_at: string | null;
};

export const useProtocolData = (protocolId?: string) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [protocolDay, setProtocolDay] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch protocol details
  useEffect(() => {
    if (!protocolId || !userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchProtocol = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_protocols')
          .select('*')
          .eq('id', protocolId)
          .eq('user_id', userId)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching protocol:', error);
          return;
        }
        
        if (data) {
          setProtocol(data);
          
          // Calculate current day based on started_at date if available
          if (data.started_at) {
            const startDate = new Date(data.started_at);
            const today = new Date();
            const diffTime = today.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to start from day 1
            
            // Limit to the protocol duration
            const durationDays = parseInt(data.duration.split(' ')[0]);
            setProtocolDay(Math.min(Math.max(diffDays, 1), durationDays));
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching protocol:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProtocol();
  }, [protocolId, userId]);
  
  // Update protocol day in protocol_wellbeing if it changes
  useEffect(() => {
    if (!protocolId || !userId || !protocol || !protocolDay) return;
    
    const updateProtocolProgress = async () => {
      // Calculate completion percentage
      const durationDays = parseInt(protocol.duration.split(' ')[0]);
      const newCompletionPercentage = Math.floor((protocolDay / durationDays) * 100);
      
      // If this is day 1 and the protocol hasn't started yet, mark it as started
      if (protocolDay === 1 && !protocol.started_at) {
        const { error } = await supabase
          .from('user_protocols')
          .update({ 
            started_at: new Date().toISOString(),
            status: 'in_progress',
            completion_percentage: newCompletionPercentage
          })
          .eq('id', protocolId);
        
        if (error) {
          console.error('Error updating protocol start:', error);
        }
      } else if (newCompletionPercentage !== protocol.completion_percentage) {
        // Otherwise just update the completion percentage
        const { error } = await supabase
          .from('user_protocols')
          .update({ 
            completion_percentage: newCompletionPercentage 
          })
          .eq('id', protocolId);
        
        if (error) {
          console.error('Error updating protocol completion percentage:', error);
        }
      }
    };
    
    updateProtocolProgress();
  }, [protocolId, userId, protocolDay, protocol]);
  
  return {
    protocol,
    protocolDay,
    setProtocolDay,
    userId,
    isLoading
  };
};
