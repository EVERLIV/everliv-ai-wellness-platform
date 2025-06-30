
import React from "react";
import { Activity, AlertTriangle, User } from "lucide-react";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BiologicalAgeCardProps {
  biologicalAge: number;
}

const BiologicalAgeCard: React.FC<BiologicalAgeCardProps> = ({ 
  biologicalAge: fallbackBiologicalAge 
}) => {
  const { healthProfile } = useHealthProfile();
  const navigate = useNavigate();

  // Расчет биологического возраста на основе профиля здоровья
  const calculateBiologicalAge = () => {
    if (!healthProfile?.age) return null;
    
    let bioAge = healthProfile.age;
    
    // Факторы старения
    if (healthProfile.stressLevel && healthProfile.stressLevel > 7) bioAge += 3;
    if (healthProfile.sleepHours && healthProfile.sleepHours < 6) bioAge += 2;
    if (healthProfile.exerciseFrequency && healthProfile.exerciseFrequency < 1) bioAge += 5;
    
    // Факторы омоложения
    if (healthProfile.exerciseFrequency && healthProfile.exerciseFrequency >= 4) bioAge -= 2;
    if (healthProfile.sleepHours && healthProfile.sleepHours >= 7 && healthProfile.sleepHours <= 9) bioAge -= 1;
    if (healthProfile.stressLevel && healthProfile.stressLevel <= 4) bioAge -= 2;
    
    return Math.max(18, Math.min(bioAge, healthProfile.age + 10));
  };

  const calculatedAge = calculateBiologicalAge();
  const displayAge = calculatedAge || fallbackBiologicalAge;
  const hasProfileData = !!healthProfile;

  if (!hasProfileData) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/50 rounded-xl border border-orange-200/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Биологический возраст</span>
              <p className="text-xs text-orange-600">Данных недостаточно</p>
            </div>
          </div>
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/health-profile')}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <User className="h-4 w-4 mr-1" />
              Создать профиль
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 rounded-xl border border-indigo-200/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Биологический возраст</span>
            <p className="text-xs text-gray-500">Рассчитан на основе профиля</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {displayAge}
          </span>
          <span className="text-lg text-gray-600 ml-1">лет</span>
        </div>
      </div>
    </div>
  );
};

export default BiologicalAgeCard;
