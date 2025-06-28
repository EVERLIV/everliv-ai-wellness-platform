
import React from "react";
import HealthProfilePageHeader from "@/components/health-profile/HealthProfilePageHeader";
import HealthProfileDisplay from "@/components/health-profile/HealthProfileDisplay";
import StepByStepHealthProfileForm from "@/components/health-profile/StepByStepHealthProfileForm";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";
import { Heart, Sparkles, Target } from "lucide-react";

const HealthProfile: React.FC = () => {
  const { 
    healthProfile, 
    isLoading, 
    isEditMode, 
    updateHealthProfile, 
    saveHealthProfile, 
    setEditMode 
  } = useHealthProfile();

  const handleEdit = () => {
    console.log('Entering edit mode');
    setEditMode(true);
  };

  const handleSave = async () => {
    console.log('Save button clicked');
    try {
      const success = await saveHealthProfile();
      if (success) {
        console.log('Profile saved successfully');
        toast.success('Профиль здоровья сохранен');
      } else {
        console.log('Profile save failed');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Ошибка при сохранении профиля');
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked, exiting edit mode');
    setEditMode(false);
  };

  const handleCreateProfile = () => {
    console.log('Creating new profile');
    const defaultProfile: HealthProfileData = {
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
      labResults: {}
    };
    
    updateHealthProfile(defaultProfile);
    setEditMode(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <HealthProfilePageHeader />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-700 font-medium">Загрузка профиля здоровья...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!healthProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <HealthProfilePageHeader />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Создайте профиль здоровья
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Получайте персональные рекомендации и отслеживайте показатели здоровья с помощью умного анализа
              </p>
              <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>ИИ анализ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>Цели здоровья</span>
                </div>
              </div>
              <button 
                onClick={handleCreateProfile}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Создать профиль
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <HealthProfilePageHeader />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {isEditMode ? (
          <StepByStepHealthProfileForm
            healthProfile={healthProfile}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={updateHealthProfile}
          />
        ) : (
          <HealthProfileDisplay 
            healthProfile={healthProfile}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default HealthProfile;
