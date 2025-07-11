// Утилита для определения статуса биомаркера на основе значения и нормы
export const calculateBiomarkerStatus = (
  value: string, 
  normalRange: string
): 'normal' | 'high' | 'low' => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return 'normal';

  // Обработка различных форматов норм
  
  // Формат "X-Y" (например, "0.5-2.0" или "120-150 г/л")
  if (normalRange.includes('-')) {
    const rangeParts = normalRange.split('-');
    if (rangeParts.length === 2) {
      const minStr = rangeParts[0].trim();
      const maxStr = rangeParts[1].trim();
      
      const minNormal = parseFloat(minStr);
      const maxNormal = parseFloat(maxStr);
      
      if (!isNaN(minNormal) && !isNaN(maxNormal)) {
        if (numericValue < minNormal) return 'low';
        if (numericValue > maxNormal) return 'high';
        return 'normal';
      }
    }
  }
  
  // Формат ">X" (например, ">1.0 ммоль/л")
  if (normalRange.startsWith('>')) {
    const threshold = parseFloat(normalRange.substring(1).trim());
    if (!isNaN(threshold)) {
      return numericValue >= threshold ? 'normal' : 'low';
    }
  }
  
  // Формат "<X" (например, "<5.0 ммоль/л")
  if (normalRange.startsWith('<')) {
    const threshold = parseFloat(normalRange.substring(1).trim());
    if (!isNaN(threshold)) {
      return numericValue <= threshold ? 'normal' : 'high';
    }
  }
  
  // Формат "до X" (например, "до 4.0 нг/мл")
  if (normalRange.toLowerCase().includes('до ')) {
    const match = normalRange.match(/до\s*(\d+(?:\.\d+)?)/i);
    if (match) {
      const threshold = parseFloat(match[1]);
      if (!isNaN(threshold)) {
        return numericValue <= threshold ? 'normal' : 'high';
      }
    }
  }
  
  // Формат "выше X" (например, "выше 1.0 ммоль/л")
  if (normalRange.toLowerCase().includes('выше ')) {
    const match = normalRange.match(/выше\s*(\d+(?:\.\d+)?)/i);
    if (match) {
      const threshold = parseFloat(match[1]);
      if (!isNaN(threshold)) {
        return numericValue >= threshold ? 'normal' : 'low';
      }
    }
  }
  
  // Если не удалось распарсить, возвращаем 'normal'
  return 'normal';
};