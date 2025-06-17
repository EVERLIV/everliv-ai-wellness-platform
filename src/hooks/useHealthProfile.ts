
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";
import { isDevelopmentMode } from "@/utils/devMode";

export interface HealthProfileData {
  age: number;
  gender: string;
  height: number;
  weight: number;
  physicalActivity?: string;
  exerciseFrequency: number;
  fitnessLevel?: string;
  stressLevel: number;
  anxietyLevel: number;
  moodChanges?: string;
  mentalHealthSupport?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  dietType?: string;
  waterIntake: number;
  caffeineIntake: number;
  sleepHours: number;
  sleepQuality?: string;
  sleepIssues?: string[];
  chronicConditions?: string[];
  currentSymptoms?: string[];
  familyHistory?: string[];
  allergies?: string[];
  medications?: string[];
  previousSurgeries?: string[];
  lastCheckup?: string;
}

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

      // In dev mode, return mock health profile
      if (isDevelopmentMode() && user.id === 'dev-admin-12345') {
        console.log('🔧 Dev mode: Using mock health profile');
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
          lastCheckup: '2024-01-15'
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

        setHealthProfile(data?.profile_data || null);

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
    }
  };

  const saveHealthProfile = async () => {
    if (!user || !healthProfile) return;

    try {
      const { error } = await supabase
        .from('health_profiles')
        .upsert({
          user_id: user.id,
          profile_data: healthProfile
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

  return { 
    healthProfile, 
    isLoading, 
    setHealthProfile,
    isEditMode,
    setEditMode,
    updateHealthProfile,
    saveHealthProfile
  };
};
