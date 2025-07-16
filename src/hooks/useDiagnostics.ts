import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { DiagnosticSession, DiagnosticFile, ECGRecord, AIDiagnosticAnalysis } from '@/types/diagnostics';

export const useDiagnostics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<DiagnosticSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DiagnosticSession | null>(null);

  // Create new diagnostic session
  const createSession = useCallback(async (sessionData: {
    title: string;
    description?: string;
    session_type: string;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('diagnostic_sessions')
        .insert({
          user_id: user.id,
          ...sessionData,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setSessions(prev => [data, ...prev]);
      
      toast({
        title: "Сессия создана",
        description: `Создана новая диагностическая сессия: ${data.title}`,
      });

      return data;
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать сессию диагностики",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Upload file to session
  const uploadFile = useCallback(async (file: File, sessionId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${sessionId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('diagnostics')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('diagnostics')
        .getPublicUrl(filePath);

      // Create file record
      const { data: fileRecord, error: fileError } = await supabase
        .from('diagnostic_files')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          upload_status: 'uploaded'
        })
        .select()
        .single();

      if (fileError) throw fileError;

      // If it's an ECG file, create ECG record
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        await supabase
          .from('ecg_records')
          .insert({
            session_id: sessionId,
            user_id: user.id,
            file_url: urlData.publicUrl,
            file_type: file.type,
            analysis_status: 'pending'
          });
      }

      toast({
        title: "Файл загружен",
        description: `Файл ${file.name} успешно загружен`,
      });

      return fileRecord;
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить файл",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Start AI analysis
  const startAIAnalysis = useCallback(async (sessionId: string, fileUrl: string, analysisType: string = 'ecg') => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-ecg-analysis', {
        body: {
          sessionId,
          fileUrl,
          analysisType
        }
      });

      if (error) throw error;

      toast({
        title: "Анализ запущен",
        description: "ИИ-анализ начат. Результаты появятся через несколько минут.",
      });

      return data;
    } catch (error) {
      toast({
        title: "Ошибка анализа",
        description: "Не удалось запустить ИИ-анализ",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Get sessions
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('diagnostic_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сессии",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Get session with details
  const fetchSessionDetails = useCallback(async (sessionId: string) => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      // Get session
      const { data: sessionData, error: sessionError } = await supabase
        .from('diagnostic_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (sessionError) throw sessionError;

      // Get files
      const { data: filesData } = await supabase
        .from('diagnostic_files')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      // Get ECG records
      const { data: ecgData } = await supabase
        .from('ecg_records')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      // Get AI analyses
      const { data: analysesData } = await supabase
        .from('ai_diagnostic_analyses')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      // Get recommendations
      const { data: recommendationsData } = await supabase
        .from('diagnostic_recommendations')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      const sessionWithDetails = {
        ...sessionData,
        files: filesData || [],
        ecg_records: ecgData || [],
        ai_analyses: analysesData || [],
        recommendations: recommendationsData || []
      };

      setCurrentSession(sessionWithDetails);
      return sessionWithDetails;
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить детали сессии",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Delete session
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('diagnostic_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: "Сессия удалена",
        description: "Диагностическая сессия успешно удалена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сессию",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    sessions,
    currentSession,
    createSession,
    uploadFile,
    startAIAnalysis,
    fetchSessions,
    fetchSessionDetails,
    deleteSession,
    setCurrentSession
  };
};