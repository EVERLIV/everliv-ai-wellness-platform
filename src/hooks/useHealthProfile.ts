
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HealthProfileData } from "@/types/healthProfile";
import { healthProfileService } from "@/services/healthProfileService";
import { labResultsProcessor } from "@/utils/labResultsProcessor";
import { toast } from "sonner";

export const useHealthProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [healthProfile, setHealthProfile] = useState<HealthProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthProfile = async () => {
      // Ждем завершения проверки аутентификации
      if (authLoading) {
        console.log('🔄 Waiting for auth to complete...');
        return;
      }

      if (!user) {
        console.log('❌ No authenticated user found');
        setHealthProfile(null);
        setIsLoading(false);
        setError('Пользователь не авторизован');
        return;
      }

      console.log('✅ User authenticated, fetching health profile for:', user.id);

      try {
        setIsLoading(true);
        setError(null);
        
        const profile = await healthProfileService.fetchHealthProfile(user.id);
        console.log('📊 Health profile fetched:', profile ? 'Found' : 'Not found');
        
        setHealthProfile(profile);
      } catch (error) {
        console.error('❌ Error fetching health profile:', error);
        setHealthProfile(null);
        setError('Ошибка при загрузке профиля здоровья');
        toast.error('Ошибка при загрузке профиля здоровья');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthProfile();
  }, [user, authLoading]);

  const updateHealthProfile = (updates: Partial<HealthProfileData>) => {
    console.log('🔄 Updating health profile with:', updates);
    if (healthProfile) {
      const updatedProfile = { ...healthProfile, ...updates };
      setHealthProfile(updatedProfile);
    } else {
      // Если профиля нет, создаем новый с переданными данными
      const newProfile: HealthProfileData = {
        age: 25,
        gender: 'male',
        height: 170,
        weight: 70,
        exerciseFrequency: 0,
        stressLevel: 5,
        anxietyLevel: 5,
        waterIntake: 6,
        caffeineIntake: 1,
        sleepHours: 7,
        labResults: {},
        ...updates
      };
      setHealthProfile(newProfile);
    }
  };

  const saveHealthProfile = async () => {
    if (!user) {
      console.error('❌ Cannot save: no user logged in');
      setError('Вы не авторизованы');
      toast.error('Вы не авторизованы');
      return false;
    }

    if (!healthProfile) {
      console.error('❌ Cannot save: no health profile data');
      setError('Нет данных для сохранения');
      toast.error('Нет данных для сохранения');
      return false;
    }

    console.log('💾 Attempting to save health profile for user:', user.id);
    
    try {
      setError(null);
      const success = await healthProfileService.saveHealthProfile(healthProfile);
      if (success) {
        setEditMode(false);
        console.log('✅ Health profile saved successfully');
        toast.success('Профиль здоровья успешно сохранен');
      }
      return success;
    } catch (error) {
      console.error('❌ Error in saveHealthProfile:', error);
      setError('Ошибка при сохранении профиля');
      toast.error('Ошибка при сохранении профиля');
      return false;
    }
  };

  const updateLabResultsFromAnalysis = (analysisData: any) => {
    labResultsProcessor.updateLabResultsFromAnalysis(
      healthProfile, 
      analysisData, 
      updateHealthProfile
    );
  };

  return { 
    healthProfile, 
    isLoading: isLoading || authLoading, 
    error,
    setHealthProfile,
    isEditMode,
    setEditMode,
    updateHealthProfile,
    saveHealthProfile,
    updateLabResultsFromAnalysis
  };
};
