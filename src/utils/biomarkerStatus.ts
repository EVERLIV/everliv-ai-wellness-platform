// Утилита для определения статуса биомаркера на основе значения и нормы
export const calculateBiomarkerStatus = (
  value: string, 
  normalRange: string
): 'normal' | 'high' | 'low' => {
  // Нормализуем значение - заменяем запятую на точку и убираем единицы
  let cleanValue = value;
  if (typeof cleanValue === 'string') {
    // Извлекаем только числовую часть
    const valueMatch = cleanValue.match(/^([0-9,.\s]+)/);
    if (valueMatch) {
      cleanValue = valueMatch[1].trim().replace(',', '.');
    }
  }
  
  const numericValue = parseFloat(cleanValue);
  
  // Детальное логирование для отладки
  console.log('🔍 Проверка статуса биомаркера:', {
    originalValue: value,
    cleanValue,
    numericValue,
    normalRange,
    isValidNumber: !isNaN(numericValue)
  });
  
  if (isNaN(numericValue)) {
    console.warn('⚠️ Не удалось распарсить значение:', value);
    return 'normal';
  }

  // Обработка различных форматов норм
  
  // Формат "X-Y" (например, "3-11 %" или "120-150 г/л")
  if (normalRange.includes('-')) {
    const rangeParts = normalRange.split('-');
    if (rangeParts.length === 2) {
      const minStr = rangeParts[0].trim().replace(',', '.');
      const maxStr = rangeParts[1].trim().replace(',', '.');
      
      const minNormal = parseFloat(minStr);
      const maxNormal = parseFloat(maxStr);
      
      if (!isNaN(minNormal) && !isNaN(maxNormal)) {
        let status: 'normal' | 'high' | 'low';
        if (numericValue < minNormal) {
          status = 'low';
        } else if (numericValue > maxNormal) {
          status = 'high';
        } else {
          status = 'normal';
        }
        
        console.log('📊 Результат проверки диапазона:', {
          value: numericValue,
          min: minNormal,
          max: maxNormal,
          status,
          logic: `${numericValue} ${numericValue < minNormal ? '<' : numericValue > maxNormal ? '>' : 'в диапазоне'} [${minNormal}-${maxNormal}]`
        });
        
        return status;
      }
    }
  }
  
  // Формат ">X" (например, ">1.0 ммоль/л")
  if (normalRange.startsWith('>')) {
    const thresholdStr = normalRange.substring(1).trim().replace(',', '.');
    const threshold = parseFloat(thresholdStr);
    if (!isNaN(threshold)) {
      const status = numericValue >= threshold ? 'normal' : 'low';
      console.log('📊 Результат проверки "больше":', {
        value: numericValue,
        threshold,
        status,
        logic: `${numericValue} ${numericValue >= threshold ? '>=' : '<'} ${threshold}`
      });
      return status;
    }
  }
  
  // Формат "<X" (например, "<5.0 ммоль/л")
  if (normalRange.startsWith('<')) {
    const thresholdStr = normalRange.substring(1).trim().replace(',', '.');
    const threshold = parseFloat(thresholdStr);
    if (!isNaN(threshold)) {
      const status = numericValue <= threshold ? 'normal' : 'high';
      console.log('📊 Результат проверки "меньше":', {
        value: numericValue,
        threshold,
        status,
        logic: `${numericValue} ${numericValue <= threshold ? '<=' : '>'} ${threshold}`
      });
      return status;
    }
  }
  
  // Формат "до X" (например, "до 4.0 нг/мл")
  if (normalRange.toLowerCase().includes('до ')) {
    const match = normalRange.match(/до\s*(\d+(?:[,.]?\d+)?)/i);
    if (match) {
      const threshold = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(threshold)) {
        const status = numericValue <= threshold ? 'normal' : 'high';
        console.log('📊 Результат проверки "до":', {
          value: numericValue,
          threshold,
          status,
          logic: `${numericValue} ${numericValue <= threshold ? '<=' : '>'} ${threshold}`
        });
        return status;
      }
    }
  }
  
  // Формат "выше X" (например, "выше 1.0 ммоль/л")
  if (normalRange.toLowerCase().includes('выше ')) {
    const match = normalRange.match(/выше\s*(\d+(?:[,.]?\d+)?)/i);
    if (match) {
      const threshold = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(threshold)) {
        const status = numericValue >= threshold ? 'normal' : 'low';
        console.log('📊 Результат проверки "выше":', {
          value: numericValue,
          threshold,
          status,
          logic: `${numericValue} ${numericValue >= threshold ? '>=' : '<'} ${threshold}`
        });
        return status;
      }
    }
  }
  
  // Если не удалось распарсить, возвращаем 'normal'
  console.warn('⚠️ Не удалось распарсить норму:', normalRange);
  return 'normal';
};