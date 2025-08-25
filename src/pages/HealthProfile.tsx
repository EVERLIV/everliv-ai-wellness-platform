
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileChatLayout } from "@/components/layout/MobileChatLayout";
import ModernHealthProfileDisplay from "@/components/health-profile/ModernHealthProfileDisplay";
import StepByStepHealthProfileForm from "@/components/health-profile/StepByStepHealthProfileForm";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, User, Plus } from "lucide-react";

const HealthProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Mobile Loading Component
  const MobileLoadingState = ({ message }: { message: string }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-4 pt-safe py-4 bg-white border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Назад</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Профиль здоровья</h1>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );

  // Mobile Error Component
  const MobileErrorState = ({ title, message, actions }: { 
    title: string; 
    message: string; 
    actions: React.ReactNode; 
  }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-4 pt-safe py-4 bg-white border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Назад</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Профиль здоровья</h1>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-6">{message}</p>
          <div className="space-y-3">{actions}</div>
        </div>
      </div>
    </div>
  );

  // Mobile Empty State Component
  const MobileEmptyState = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="px-4 pt-safe py-4 bg-white border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Назад</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Профиль здоровья</h1>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Создайте профиль здоровья
          </h3>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Получайте персональные рекомендации и отслеживайте показатели здоровья
          </p>
          <button 
            onClick={handleCreateProfile}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Создать профиль
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop Wrapper
  const DesktopWrapper = ({ children }: { children: React.ReactNode }) => (
    <AppLayout>{children}</AppLayout>
  );

  // Проверяем аутентификацию пользователя
  if (!user && !isLoading) {
    if (isMobile) {
      return (
        <MobileErrorState
          title="Требуется авторизация"
          message="Для доступа к профилю здоровья необходимо войти в систему"
          actions={
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors active:scale-95"
            >
              Войти в систему
            </button>
          }
        />
      );
    }
    
    return (
      <DesktopWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Требуется авторизация</h3>
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
      </DesktopWrapper>
    );
  }

  if (isLoading) {
    if (isMobile) {
      return <MobileLoadingState message="Загрузка профиля здоровья..." />;
    }
    
    return (
      <DesktopWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка профиля здоровья...</p>
          </div>
        </div>
      </DesktopWrapper>
    );
  }

  if (error) {
    if (isMobile) {
      return (
        <MobileErrorState
          title="Ошибка загрузки"
          message={error}
          actions={
            <>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors active:scale-95"
              >
                Попробовать снова
              </button>
              {error.includes('авторизац') && (
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors active:scale-95"
                >
                  Войти заново
                </button>
              )}
            </>
          }
        />
      );
    }
    
    return (
      <DesktopWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Ошибка загрузки профиля</h3>
            <p className="text-muted-foreground mb-8">{error}</p>
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
      </DesktopWrapper>
    );
  }

  if (!healthProfile) {
    if (isMobile) {
      return <MobileEmptyState />;
    }
    
    return (
      <DesktopWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Профиль здоровья не найден</h3>
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
      </DesktopWrapper>
    );
  }

  if (isEditMode) {
    if (isMobile) {
      return (
        <div className="min-h-screen bg-gray-50">
          <StepByStepHealthProfileForm
            healthProfile={healthProfile}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={updateHealthProfile}
          />
        </div>
      );
    }
    
    return (
      <DesktopWrapper>
        <StepByStepHealthProfileForm
          healthProfile={healthProfile}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={updateHealthProfile}
        />
      </DesktopWrapper>
    );
  }

  if (isMobile) {
    return (
      <ModernHealthProfileDisplay 
        healthProfile={healthProfile}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <DesktopWrapper>
      <ModernHealthProfileDisplay 
        healthProfile={healthProfile}
        onEdit={handleEdit}
      />
    </DesktopWrapper>
  );
};

export default HealthProfile;
