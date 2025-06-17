
export const processHealthProfileValue = (fieldName: string, value: any, customValue?: string): any => {
  // Если выбрано "other" и есть кастомное значение, используем его
  if (value === 'other' && customValue) {
    return customValue;
  }
  
  // Переводим "other" на русский язык, если нет кастомного значения
  if (value === 'other') {
    return 'Другое';
  }
  
  // Для массивов обрабатываем каждый элемент
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item.value === 'other' && item.customValue) {
        return item.customValue;
      }
      if (typeof item === 'object' && item.value === 'other') {
        return 'Другое';
      }
      return typeof item === 'object' ? item.value || item : item;
    });
  }
  
  return value;
};

export const prepareHealthProfileForAnalysis = (healthProfile: any): any => {
  const processedProfile = { ...healthProfile };
  
  // Обрабатываем все поля, которые могут содержать "other"
  const fieldsToProcess = [
    'gender', 'physicalActivity', 'smokingStatus', 'alcoholConsumption',
    'dietType', 'sleepQuality', 'mentalHealthSupport', 'fitnessLevel',
    'moodChanges', 'lastCheckup'
  ];
  
  fieldsToProcess.forEach(field => {
    if (processedProfile[field]) {
      processedProfile[field] = processHealthProfileValue(
        field, 
        processedProfile[field], 
        processedProfile[`${field}Custom`]
      );
    }
  });
  
  // Обрабатываем массивы
  const arrayFields = [
    'chronicConditions', 'currentSymptoms', 'sleepIssues', 
    'familyHistory', 'allergies', 'medications', 'previousSurgeries'
  ];
  
  arrayFields.forEach(field => {
    if (processedProfile[field]) {
      processedProfile[field] = processHealthProfileValue(field, processedProfile[field]);
    }
  });
  
  return processedProfile;
};

// Новая функция для отображения значений в UI
export const displayHealthProfileValue = (value: any): string => {
  if (value === 'other') {
    return 'Другое';
  }
  
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item.value === 'other') {
        return item.customValue || 'Другое';
      }
      if (typeof item === 'object') {
        return item.customValue || item.value || item;
      }
      return item === 'other' ? 'Другое' : item;
    }).join(', ');
  }
  
  if (typeof value === 'object' && value.value === 'other') {
    return value.customValue || 'Другое';
  }
  
  if (typeof value === 'object') {
    return value.customValue || value.value || value;
  }
  
  return value;
};
