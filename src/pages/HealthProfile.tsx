import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import HealthProfileDashboard from "@/components/health-profile/HealthProfileDashboard";
import StepByStepHealthProfileForm from "@/components/health-profile/StepByStepHealthProfileForm";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

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
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Требуется авторизация
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Для доступа к профилю здоровья необходимо войти в систему
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full px-8 py-4 bg-green-600 text-white hover:bg-green-700 transition-colors font-medium rounded-2xl shadow-lg"
            >
              Войти в систему
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-3xl shadow-lg p-8">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Загрузка профиля здоровья...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Ошибка загрузки профиля
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {error}
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="block w-full px-8 py-4 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium rounded-2xl shadow-lg"
              >
                Попробовать снова
              </button>
              {error.includes('авторизац') && (
                <button 
                  onClick={() => navigate('/login')}
                  className="block w-full px-8 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium rounded-2xl"
                >
                  Войти заново
                </button>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!healthProfile) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Профиль здоровья не найден
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Создайте свой профиль здоровья, чтобы получать персональные рекомендации и отслеживать показатели здоровья
            </p>
            <button 
              onClick={handleCreateProfile}
              className="w-full px-8 py-4 bg-green-600 text-white hover:bg-green-700 transition-colors font-medium rounded-2xl shadow-lg"
            >
              Создать профиль
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isEditMode) {
    return (
      <AppLayout>
        <StepByStepHealthProfileForm
          healthProfile={healthProfile}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={updateHealthProfile}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <HealthProfileDashboard 
        healthProfile={healthProfile}
        onEdit={handleEdit}
      />
    </AppLayout>
  );
};

export default HealthProfile;