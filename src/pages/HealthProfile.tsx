
import React from "react";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import HealthProfilePageHeader from "@/components/health-profile/HealthProfilePageHeader";
import HealthProfileDisplay from "@/components/health-profile/HealthProfileDisplay";
import HealthProfileEditForm from "@/components/health-profile/HealthProfileEditForm";
import { useHealthProfile } from "@/hooks/useHealthProfile";

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
    setEditMode(true);
  };

  const handleSave = async () => {
    await saveHealthProfile();
  };

  const handleCancel = () => {
    setEditMode(false);
  };

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

  if (!healthProfile) {
    return (
      <PageLayoutWithHeader
        headerComponent={<HealthProfilePageHeader />}
      >
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Профиль здоровья не найден</p>
          <button 
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Создать профиль
          </button>
        </div>
      </PageLayoutWithHeader>
    );
  }

  return (
    <PageLayoutWithHeader
      headerComponent={<HealthProfilePageHeader />}
    >
      {isEditMode ? (
        <HealthProfileEditForm
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
