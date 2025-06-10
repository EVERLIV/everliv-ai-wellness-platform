
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Heart, 
  Activity, 
  Brain, 
  Apple, 
  Moon, 
  Stethoscope,
  ArrowLeft,
  Save,
  CheckCircle
} from "lucide-react";
import PersonalInfoSection from "@/components/health-profile/PersonalInfoSection";
import PhysicalHealthSection from "@/components/health-profile/PhysicalHealthSection";
import MentalHealthSection from "@/components/health-profile/MentalHealthSection";
import LifestyleSection from "@/components/health-profile/LifestyleSection";
import SleepSection from "@/components/health-profile/SleepSection";
import MedicalHistorySection from "@/components/health-profile/MedicalHistorySection";

interface HealthProfileData {
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

const HealthProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [healthProfile, setHealthProfile] = useState<HealthProfileData>({
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
  });

  const sections = [
    { 
      title: "Личная информация", 
      icon: Heart, 
      component: PersonalInfoSection 
    },
    { 
      title: "Физическое здоровье", 
      icon: Activity, 
      component: PhysicalHealthSection 
    },
    { 
      title: "Психическое здоровье", 
      icon: Brain, 
      component: MentalHealthSection 
    },
    { 
      title: "Образ жизни", 
      icon: Apple, 
      component: LifestyleSection 
    },
    { 
      title: "Сон", 
      icon: Moon, 
      component: SleepSection 
    },
    { 
      title: "Медицинская история", 
      icon: Stethoscope, 
      component: MedicalHistorySection 
    }
  ];

  useEffect(() => {
    if (user) {
      loadHealthProfile();
    }
  }, [user]);

  const loadHealthProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
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
      
      const { error } = await supabase
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

  const progress = ((currentSection + 1) / sections.length) * 100;
  const CurrentSectionComponent = sections[currentSection].component;
  const CurrentIcon = sections[currentSection].icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <div className="pt-16 flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <CurrentIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Профиль здоровья
                  </h1>
                  <p className="text-gray-600">
                    {sections[currentSection].title}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                К дашборду
              </Button>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Прогресс заполнения</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Раздел {currentSection + 1} из {sections.length}</span>
                <span>{sections[currentSection].title}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrentIcon className="h-5 w-5 text-blue-600" />
                {sections[currentSection].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CurrentSectionComponent 
                data={healthProfile}
                onChange={updateHealthProfile}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Назад
            </Button>

            <div className="flex gap-2">
              {currentSection === sections.length - 1 ? (
                <Button
                  onClick={saveHealthProfile}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Сохранить профиль
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                >
                  Далее
                </Button>
              )}
            </div>
          </div>

          {/* Section Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Button
                  key={index}
                  variant={index === currentSection ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection(index)}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs text-center">{section.title}</span>
                  {index < currentSection && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default HealthProfile;
