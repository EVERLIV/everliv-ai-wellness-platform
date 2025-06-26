
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { HealthProfileData } from "@/types/healthProfile";
import { healthProfileService } from "@/services/healthProfileService";
import { labResultsProcessor } from "@/utils/labResultsProcessor";
import { toast } from "sonner";

export const useHealthProfile = () => {
  const { user } = useSmartAuth();
  const [healthProfile, setHealthProfile] = useState<HealthProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!user) {
        console.log('No user found, clearing profile');
        setHealthProfile(null);
        setIsLoading(false);
        return;
      }

      console.log('Fetching health profile for user:', user.id);

      try {
        setIsLoading(true);
        const profile = await healthProfileService.fetchHealthProfile(user.id);
        console.log('Health profile fetched:', profile);
        setHealthProfile(profile);
      } catch (error) {
        console.error('Error fetching health profile:', error);
        setHealthProfile(null);
        toast.error('Ошибка при загрузке профиля здоровья');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthProfile();
  }, [user]);

  const updateHealthProfile = (updates: Partial<HealthProfileData>) => {
    console.log('Updating health profile with:', updates);
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
      console.error('Cannot save: no user logged in');
      toast.error('Вы не авторизованы');
      return false;
    }

    if (!healthProfile) {
      console.error('Cannot save: no health profile data');
      toast.error('Нет данных для сохранения');
      return false;
    }

    console.log('Attempting to save health profile for user:', user.id);
    console.log('Health profile data:', healthProfile);
    
    try {
      const success = await healthProfileService.saveHealthProfile(healthProfile);
      if (success) {
        setEditMode(false);
        console.log('Health profile saved successfully, exiting edit mode');
        toast.success('Профиль здоровья успешно сохранен');
      }
      return success;
    } catch (error) {
      console.error('Error in saveHealthProfile:', error);
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
    isLoading, 
    setHealthProfile,
    isEditMode,
    setEditMode,
    updateHealthProfile,
    saveHealthProfile,
    updateLabResultsFromAnalysis
  };
};
