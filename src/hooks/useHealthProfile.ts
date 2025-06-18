
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";
import { isDevelopmentMode } from "@/utils/devMode";
import { HealthProfileData } from "@/types/healthProfile";

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
        
        const { data, error } = await supabase
          .from('health_profiles')
          .select('profile_data')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching health profile:', error);
          setHealthProfile(null);
          return;
        }

        if (data?.profile_data) {
          setHealthProfile(data.profile_data as unknown as HealthProfileData);
        } else {
          setHealthProfile(null);
        }

      } catch (error) {
        console.error('Error fetching health profile:', error);
        setHealthProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthProfile();
  }, [user]);

  const updateHealthProfile = (updates: Partial<HealthProfileData>) => {
    if (healthProfile) {
      setHealthProfile({ ...healthProfile, ...updates });
    } else {
      // Если профиля нет, создаем новый с базовыми значениями
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
    if (!user || !healthProfile) return;

    try {
      // Обновляем lastUpdated для лабораторных данных
      if (healthProfile.labResults) {
        healthProfile.labResults.lastUpdated = new Date().toISOString();
      }

      const { error } = await supabase
        .from('health_profiles')
        .upsert({
          user_id: user.id,
          profile_data: healthProfile as unknown as any
        });

      if (error) {
        console.error('Error saving health profile:', error);
        return;
      }

      setEditMode(false);
      console.log('Health profile saved successfully');
    } catch (error) {
      console.error('Error saving health profile:', error);
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
