
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

  if (!healthProfile) {
    return (
      <PageLayoutWithHeader
        headerComponent={<HealthProfilePageHeader />}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">Загрузка профиля здоровья...</p>
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
