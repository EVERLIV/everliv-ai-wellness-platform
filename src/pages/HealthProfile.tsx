
import React from "react";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import HealthProfilePageHeader from "@/components/health-profile/HealthProfilePageHeader";
import HealthProfileDisplay from "@/components/health-profile/HealthProfileDisplay";
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
    // Создаем базовый профиль с минимальными данными
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
      <PageLayoutWithHeader
        headerComponent={<HealthProfilePageHeader />}
      >
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Требуется авторизация
            </h3>
            <p className="text-gray-600 mb-6">
              Для доступа к профилю здоровья необходимо войти в систему
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Войти в систему
            </button>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  if (isLoading) {
    return (
      <PageLayoutWithHeader
        headerComponent={<HealthProfilePageHeader />}
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-500">Загрузка профиля здоровья...</p>
        </div>
      </PageLayoutWithHeader>
    );
  }

  if (error) {
    return (
      <PageLayoutWithHeader
        headerComponent={<HealthProfilePageHeader />}
      >
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ошибка загрузки профиля
            </h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium w-full"
              >
                Попробовать снова
              </button>
              {error.includes('авторизац') && (
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium w-full"
                >
                  Войти заново
                </button>
              )}
            </div>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  if (!healthProfile) {
    return (
      <PageLayoutWithHeader
        headerComponent={<HealthProfilePageHeader />}
      >
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Профиль здоровья не найден
            </h3>
            <p className="text-gray-600 mb-6">
              Создайте свой профиль здоровья, чтобы получать персональные рекомендации и отслеживать показатели здоровья
            </p>
            <button 
              onClick={handleCreateProfile}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Создать профиль
            </button>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  return (
    <PageLayoutWithHeader
      headerComponent={<HealthProfilePageHeader />}
    >
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
    </PageLayoutWithHeader>
  );
};

export default HealthProfile;
