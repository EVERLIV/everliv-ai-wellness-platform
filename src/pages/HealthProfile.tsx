
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import MobileHealthProfileDisplay from "@/components/health-profile/MobileHealthProfileDisplay";
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
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Требуется авторизация
            </h3>
            <p className="text-muted-foreground mb-8">
              Для доступа к профилю здоровья необходимо войти в систему
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-md"
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка профиля здоровья...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Ошибка загрузки профиля
            </h3>
            <p className="text-muted-foreground mb-8">
              {error}
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="block w-full px-8 py-3 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors font-medium rounded-md"
              >
                Попробовать снова
              </button>
              {error.includes('авторизац') && (
                <button 
                  onClick={() => navigate('/login')}
                  className="block w-full px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium rounded-md"
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Профиль здоровья не найден
            </h3>
            <p className="text-muted-foreground mb-8">
              Создайте свой профиль здоровья, чтобы получать персональные рекомендации и отслеживать показатели здоровья
            </p>
            <button 
              onClick={handleCreateProfile}
              className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-md"
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
      <MobileHealthProfileDisplay 
        healthProfile={healthProfile}
        onEdit={handleEdit}
      />
    </AppLayout>
  );
};

export default HealthProfile;
