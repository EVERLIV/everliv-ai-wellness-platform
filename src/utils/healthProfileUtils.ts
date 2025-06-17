
export const processHealthProfileValue = (fieldName: string, value: any, customValue?: string): any => {
  // Если выбрано "other" и есть кастомное значение, используем его
  if (value === 'other' && customValue) {
    return customValue;
  }
  
  // Для массивов обрабатываем каждый элемент
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item.value === 'other' && item.customValue) {
        return item.customValue;
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
