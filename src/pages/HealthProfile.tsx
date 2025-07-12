
import React from "react";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import HealthProfilePageHeader from "@/components/health-profile/HealthProfilePageHeader";
import HealthProfileDisplay from "@/components/health-profile/HealthProfileDisplay";
import EnhancedHealthProfileDisplay from "@/components/health-profile/EnhancedHealthProfileDisplay";
import StepByStepHealthProfileForm from "@/components/health-profile/StepByStepHealthProfileForm";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HealthProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    healthProfile, 
    isLoading, 
    error,
    isEditMode, 
    updateHealthProfile, 
    saveHealthProfile, 
    setEditMode 
  } = useHealthProfile();

  const handleEdit = () => {
    console.log('✏️ Entering edit mode');
    setEditMode(true);
  };

  const handleSave = async () => {
    console.log('💾 Save button clicked');
    try {
      const success = await saveHealthProfile();
      if (success) {
        console.log('✅ Profile saved successfully');
        toast.success('Профиль здоровья сохранен');
      } else {
        console.log('❌ Profile save failed');
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      toast.error('Ошибка при сохранении профиля');
    }
  };

  const handleCancel = () => {
    console.log('❌ Cancel button clicked, exiting edit mode');
    setEditMode(false);
  };

  const handleCreateProfile = () => {
    console.log('➕ Creating new profile');
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

  // Проверяем аутентификацию пользователя
  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-2">
            Требуется авторизация
          </h3>
          <p className="text-gray-600 mb-8">
            Для доступа к профилю здоровья необходимо войти в систему
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка профиля здоровья...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-2">
            Ошибка загрузки профиля
          </h3>
          <p className="text-gray-600 mb-8">
            {error}
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="block w-full px-8 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
            >
              Попробовать снова
            </button>
            {error.includes('авторизац') && (
              <button 
                onClick={() => navigate('/login')}
                className="block w-full px-8 py-3 bg-gray-600 text-white hover:bg-gray-700 transition-colors font-medium"
              >
                Войти заново
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!healthProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-2">
            Профиль здоровья не найден
          </h3>
          <p className="text-gray-600 mb-8">
            Создайте свой профиль здоровья, чтобы получать персональные рекомендации и отслеживать показатели здоровья
          </p>
          <button 
            onClick={handleCreateProfile}
            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Создать профиль
          </button>
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <StepByStepHealthProfileForm
        healthProfile={healthProfile}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={updateHealthProfile}
      />
    );
  }

  return (
    <EnhancedHealthProfileDisplay 
      healthProfile={healthProfile}
      onEdit={handleEdit}
    />
  );
};

export default HealthProfile;
