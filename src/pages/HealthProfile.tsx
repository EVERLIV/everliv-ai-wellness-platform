
import React from "react";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import HealthProfilePageHeader from "@/components/health-profile/HealthProfilePageHeader";
import HealthProfileDisplay from "@/components/health-profile/HealthProfileDisplay";
import { useHealthProfile } from "@/hooks/useHealthProfile";

const HealthProfile: React.FC = () => {
  const { healthProfile, updateHealthProfile, setEditMode } = useHealthProfile();

  const handleEdit = () => {
    setEditMode(true);
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
      <HealthProfileDisplay 
        healthProfile={healthProfile}
        onEdit={handleEdit}
      />
    </PageLayoutWithHeader>
  );
};

export default HealthProfile;
