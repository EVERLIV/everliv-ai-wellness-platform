
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HealthProfileData {
  // Personal Info
  age: number;
  gender: string;
  height: number;
  weight: number;
  
  // Physical Health
  physicalActivity: string;
  exerciseFrequency: number;
  fitnessLevel: string;
  chronicConditions: string[];
  currentSymptoms: string[];
  
  // Mental Health
  stressLevel: number;
  anxietyLevel: number;
  moodChanges: string;
  mentalHealthSupport: string;
  
  // Lifestyle
  smokingStatus: string;
  alcoholConsumption: string;
  dietType: string;
  waterIntake: number;
  caffeineIntake: number;
  
  // Sleep
  sleepHours: number;
  sleepQuality: string;
  sleepIssues: string[];
  
  // Medical History
  familyHistory: string[];
  allergies: string[];
  medications: string[];
  previousSurgeries: string[];
  lastCheckup: string;
}

const defaultHealthProfile: HealthProfileData = {
  age: 30,
  gender: '',
  height: 170,
  weight: 70,
  physicalActivity: '',
  exerciseFrequency: 0,
  fitnessLevel: '',
  chronicConditions: [],
  currentSymptoms: [],
  stressLevel: 5,
  anxietyLevel: 5,
  moodChanges: '',
  mentalHealthSupport: '',
  smokingStatus: '',
  alcoholConsumption: '',
  dietType: '',
  waterIntake: 8,
  caffeineIntake: 1,
  sleepHours: 8,
  sleepQuality: '',
  sleepIssues: [],
  familyHistory: [],
  allergies: [],
  medications: [],
  previousSurgeries: [],
  lastCheckup: ''
};

export const useHealthProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [healthProfile, setHealthProfile] = useState<HealthProfileData>(defaultHealthProfile);

  useEffect(() => {
    if (user) {
      loadHealthProfile();
    }
  }, [user]);

  const loadHealthProfile = async () => {
    try {
      // Use type assertion to work around missing table types
      const { data, error } = await (supabase as any)
        .from('health_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.profile_data) {
        setHealthProfile(data.profile_data);
      }
    } catch (error) {
      console.error('Error loading health profile:', error);
    }
  };

  const saveHealthProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Use type assertion to work around missing table types
      const { error } = await (supabase as any)
        .from('health_profiles')
        .upsert({
          user_id: user.id,
          profile_data: healthProfile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Профиль здоровья успешно сохранен');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving health profile:', error);
      toast.error('Ошибка сохранения профиля здоровья');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHealthProfile = (updates: Partial<HealthProfileData>) => {
    setHealthProfile(prev => ({ ...prev, ...updates }));
  };

  return {
    healthProfile,
    isLoading,
    updateHealthProfile,
    saveHealthProfile
  };
};
