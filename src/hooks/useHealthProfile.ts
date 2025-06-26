
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";
import { isDevelopmentMode } from "@/utils/devMode";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";

export const useHealthProfile = () => {
  const { user } = useSmartAuth();
  const [healthProfile, setHealthProfile] = useState<HealthProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!user) {
        setHealthProfile(null);
        setIsLoading(false);
        return;
      }

      // In dev mode, return mock health profile with lab results
      if (isDevelopmentMode() && user.id === 'dev-admin-12345') {
        console.log('🔧 Dev mode: Using mock health profile with lab results');
        const mockProfile: HealthProfileData = {
          age: 32,
          gender: 'male',
          height: 180,
          weight: 75,
          physicalActivity: 'moderate',
          exerciseFrequency: 3,
          fitnessLevel: 'intermediate',
          stressLevel: 3,
          anxietyLevel: 2,
          moodChanges: 'stable',
          mentalHealthSupport: 'family_friends',
          smokingStatus: 'never',
          alcoholConsumption: 'occasionally',
          dietType: 'omnivore',
          waterIntake: 8,
          caffeineIntake: 2,
          sleepHours: 7,
          sleepQuality: 'good',
          sleepIssues: [],
          chronicConditions: [],
          currentSymptoms: [],
          familyHistory: [],
          allergies: [],
          medications: [],
          previousSurgeries: [],
          lastCheckup: '2024-01-15',
          labResults: {
            hemoglobin: 145,
            erythrocytes: 4.5,
            hematocrit: 42,
            mcv: 90,
            mchc: 34,
            platelets: 280,
            serumIron: 18,
            cholesterol: 4.2,
            bloodSugar: 5.1,
            ldh: 180,
            testDate: '2024-06-15',
            lastUpdated: new Date().toISOString()
          }
        };
        setHealthProfile(mockProfile);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching health profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('health_profiles')
          .select('profile_data')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching health profile:', error);
          toast.error('Ошибка при загрузке профиля здоровья');
          setHealthProfile(null);
          return;
        }

        if (data?.profile_data) {
          console.log('Health profile loaded successfully');
          setHealthProfile(data.profile_data as unknown as HealthProfileData);
        } else {
          console.log('No health profile found for user');
          setHealthProfile(null);
        }

      } catch (error) {
        console.error('Error fetching health profile:', error);
        toast.error('Произошла ошибка при загрузке профиля');
        setHealthProfile(null);
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
      toast.error('Необходимо войти в систему для сохранения профиля');
      return false;
    }

    if (!healthProfile) {
      console.error('Cannot save: no health profile data');
      toast.error('Отсутствуют данные профиля для сохранения');
      return false;
    }

    try {
      console.log('Saving health profile for user:', user.id);
      console.log('Health profile data:', healthProfile);

      // Проверяем текущую сессию пользователя
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('No valid session found:', sessionError);
        toast.error('Сессия истекла. Пожалуйста, войдите в систему снова');
        return false;
      }

      console.log('Session is valid, user ID from session:', sessionData.session.user.id);

      // Обновляем lastUpdated для лабораторных данных
      if (healthProfile.labResults) {
        healthProfile.labResults.lastUpdated = new Date().toISOString();
      }

      const profilePayload = {
        user_id: sessionData.session.user.id, // Используем ID из сессии
        profile_data: healthProfile as unknown as any,
        updated_at: new Date().toISOString()
      };

      console.log('Saving with payload:', profilePayload);

      const { data, error } = await supabase
        .from('health_profiles')
        .upsert(profilePayload, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('Error saving health profile:', error);
        
        // Специальная обработка ошибки RLS
        if (error.code === '42501' || error.message.includes('row-level security')) {
          console.error('RLS Policy violation detected');
          
          // Проверяем, что пользователь действительно аутентифицирован
          const { data: userData } = await supabase.auth.getUser();
          console.log('Current authenticated user:', userData.user?.id);
          
          toast.error('Ошибка доступа к данным. Попробуйте выйти и войти в систему снова');
        } else {
          toast.error('Ошибка при сохранении профиля здоровья: ' + error.message);
        }
        return false;
      }

      console.log('Health profile saved successfully:', data);
      setEditMode(false);
      toast.success('Профиль здоровья успешно сохранен');
      return true;
    } catch (error) {
      console.error('Error saving health profile:', error);
      toast.error('Произошла ошибка при сохранении профиля');
      return false;
    }
  };

  const updateLabResultsFromAnalysis = (analysisData: any) => {
    if (!healthProfile || !analysisData.biomarkers) return;

    const labUpdates: any = {};
    
    // Маппинг биомаркеров на поля лабораторных данных
    analysisData.biomarkers.forEach((biomarker: any) => {
      const name = biomarker.name.toLowerCase();
      const value = parseFloat(biomarker.value);
      
      if (name.includes('гемоглобин') || name.includes('hemoglobin')) {
        labUpdates.hemoglobin = value;
      } else if (name.includes('эритроциты') || name.includes('erythrocytes')) {
        labUpdates.erythrocytes = value;
      } else if (name.includes('гематокрит') || name.includes('hematocrit')) {
        labUpdates.hematocrit = value;
      } else if (name.includes('mcv')) {
        labUpdates.mcv = value;
      } else if (name.includes('mchc')) {
        labUpdates.mchc = value;
      } else if (name.includes('тромбоциты') || name.includes('platelets')) {
        labUpdates.platelets = value;
      } else if (name.includes('железо') || name.includes('iron')) {
        labUpdates.serumIron = value;
      } else if (name.includes('холестерин') || name.includes('cholesterol')) {
        labUpdates.cholesterol = value;
      } else if (name.includes('глюкоза') || name.includes('glucose') || name.includes('сахар')) {
        labUpdates.bloodSugar = value;
      } else if (name.includes('лдг') || name.includes('ldh')) {
        labUpdates.ldh = value;
      }
    });

    if (Object.keys(labUpdates).length > 0) {
      const updatedLabResults = {
        ...healthProfile.labResults,
        ...labUpdates,
        lastUpdated: new Date().toISOString()
      };
      
      updateHealthProfile({ labResults: updatedLabResults });
      console.log('Lab results updated from analysis:', labUpdates);
    }
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
