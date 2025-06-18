
import { useMemo } from "react";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { HealthProfileData } from "@/types/healthProfile";

export const useHealthProfileStatus = () => {
  const { healthProfile, isLoading } = useHealthProfile();

  const status = useMemo(() => {
    if (isLoading || !healthProfile) {
      return {
        isComplete: false,
        completionPercentage: 0,
        missingFields: [],
        requiredFields: []
      };
    }

    // Определяем обязательные поля для полного профиля
    const requiredFields = [
      { key: 'age', label: 'Возраст' },
      { key: 'gender', label: 'Пол' },
      { key: 'height', label: 'Рост' },
      { key: 'weight', label: 'Вес' },
      { key: 'exerciseFrequency', label: 'Частота тренировок' },
      { key: 'stressLevel', label: 'Уровень стресса' },
      { key: 'sleepHours', label: 'Часы сна' },
      { key: 'waterIntake', label: 'Потребление воды' }
    ];

    // Проверяем заполненность базовых полей
    const missingFields = requiredFields.filter(field => {
      const value = healthProfile[field.key as keyof HealthProfileData];
      return value === undefined || value === null || value === '';
    });

    // Проверяем заполненность лабораторных данных
    const labFields = [
      'hemoglobin', 'erythrocytes', 'hematocrit', 'mcv', 'mchc', 
      'platelets', 'serumIron', 'cholesterol', 'bloodSugar', 'ldh'
    ];

    const filledLabFields = labFields.filter(field => {
      const labResults = healthProfile.labResults;
      return labResults && labResults[field as keyof typeof labResults] !== undefined;
    });

    // Считаем процент заполненности
    const totalFields = requiredFields.length + labFields.length;
    const filledFields = (requiredFields.length - missingFields.length) + filledLabFields.length;
    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    return {
      isComplete: missingFields.length === 0 && filledLabFields.length >= 5, // Считаем полным если заполнено минимум 5 лабораторных показателей
      completionPercentage,
      missingFields: missingFields.map(f => f.label),
      requiredFields: requiredFields.map(f => f.label),
      labFieldsStatus: {
        total: labFields.length,
        filled: filledLabFields.length
      }
    };
  }, [healthProfile, isLoading]);

  return status;
};
