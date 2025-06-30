
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
        setError(null); // Не показываем ошибку для неавторизованных пользователей
        return;
      }

      console.log('✅ User authenticated, fetching health profile for:', user.id);

      try {
        setIsLoading(true);
        setError(null);
        
        const profile = await healthProfileService.fetchHealthProfile(user.id);
        console.log('📊 Health profile fetched:', profile ? 'Found' : 'Not found');
        
        setHealthProfile(profile);
      } catch (error: any) {
        console.error('❌ Error fetching health profile:', error);
        setHealthProfile(null);
        
        // Улучшенная обработка ошибок с более понятными сообщениями
        let errorMessage = 'Ошибка при загрузке профиля здоровья';
        
        if (error.message?.includes('JWT')) {
          errorMessage = 'Проблема с авторизацией. Попробуйте войти в систему заново';
        } else if (error.message?.includes('row-level security')) {
          errorMessage = 'Нет доступа к данным профиля. Обратитесь к администратору';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMessage = 'Проблема с подключением к серверу. Проверьте интернет-соединение';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        
        // Не показываем toast для ошибок доступа, только логируем
        console.error('Health profile fetch error:', errorMessage);
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
      const errorMsg = 'Вы не авторизованы';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    if (!healthProfile) {
      console.error('❌ Cannot save: no health profile data');
      const errorMsg = 'Нет данных для сохранения';
      setError(errorMsg);
      toast.error(errorMsg);
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
    } catch (error: any) {
      console.error('❌ Error in saveHealthProfile:', error);
      
      let errorMessage = 'Ошибка при сохранении профиля';
      if (error.message?.includes('JWT')) {
        errorMessage = 'Проблема с авторизацией. Попробуйте войти в систему заново';
      } else if (error.message?.includes('row-level security')) {
        errorMessage = 'Нет прав для сохранения данных. Обратитесь к администратору';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
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
