
export interface WeatherInfo {
  temperature: number;
  pressure: number;
  humidity: number;
  condition: string;
  city: string;
  pressureChange: 'rising' | 'falling' | 'stable';
  healthImpact: 'low' | 'medium' | 'high';
}

export interface MagneticStormInfo {
  level: 'низкий' | 'средний' | 'высокий';
  kIndex: number;
  regions: string[];
  description: string;
  healthWarnings: string[];
  startTime?: string;
  endTime?: string;
}

export interface HealthRecommendation {
  type: 'blood_pressure' | 'meditation' | 'exercise' | 'nutrition' | 'sleep';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  conditions: string[];
}

class WeatherMagneticService {
  private static instance: WeatherMagneticService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 минут

  static getInstance(): WeatherMagneticService {
    if (!WeatherMagneticService.instance) {
      WeatherMagneticService.instance = new WeatherMagneticService();
    }
    return WeatherMagneticService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private getCachedData<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data as T;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async getWeatherInfo(city: string = 'Moscow'): Promise<WeatherInfo> {
    const cacheKey = `weather_${city}`;
    const cached = this.getCachedData<WeatherInfo>(cacheKey);
    if (cached) return cached;

    try {
      // В реальной реализации здесь будет вызов к API погоды
      // Пока используем симуляцию данных
      const baseTemp = Math.floor(Math.random() * 30) - 10;
      const basePressure = Math.floor(Math.random() * 50) + 740;
      
      const weatherInfo: WeatherInfo = {
        temperature: baseTemp,
        pressure: basePressure,
        humidity: Math.floor(Math.random() * 40) + 40,
        condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)],
        city: city,
        pressureChange: basePressure > 750 ? 'rising' : basePressure < 740 ? 'falling' : 'stable',
        healthImpact: basePressure < 740 || basePressure > 760 ? 'high' : 
                     basePressure < 745 || basePressure > 755 ? 'medium' : 'low'
      };

      this.setCachedData(cacheKey, weatherInfo);
      return weatherInfo;
    } catch (error) {
      console.error('Error fetching weather info:', error);
      throw error;
    }
  }

  async getMagneticStormInfo(): Promise<MagneticStormInfo> {
    const cacheKey = 'magnetic_storm';
    const cached = this.getCachedData<MagneticStormInfo>(cacheKey);
    if (cached) return cached;

    try {
      // Симуляция данных о магнитных бурях
      const levels = ['низкий', 'средний', 'высокий'] as const;
      const level = levels[Math.floor(Math.random() * levels.length)];
      const kIndex = level === 'высокий' ? 6 : level === 'средний' ? 4 : 2;
      
      const allRegions = [
        'Москва и Москов���кая область',
        'Санкт-Петербург и Ленинградская область',
        'Сибирский федеральный округ',
        'Дальневосточный федеральный округ',
        'Уральский федеральный округ',
        'Южный федеральный округ'
      ];

      const affectedRegions = level === 'высокий' 
        ? allRegions.slice(0, 5)
        : level === 'средний'
        ? allRegions.slice(0, 3)
        : allRegions.slice(0, 1);

      const healthWarnings = level === 'высокий'
        ? [
            'Людям с гипертонией следует чаще измерять давление',
            'Избегайте стрессовых ситуаций',
            'Ограничьте физические нагрузки',
            'Принимайте назначенные препараты строго по времени'
          ]
        : level === 'средний'
        ? [
            'Следите за самочувствием',
            'При головных болях отдохните',
            'Пейте больше воды'
          ]
        : [
            'Магнитная обстановка спокойная',
            'Можете заниматься обычными делами'
          ];

      const stormInfo: MagneticStormInfo = {
        level,
        kIndex,
        regions: affectedRegions,
        description: level === 'высокий' 
          ? 'Ожидается сильная магнитная буря'
          : level === 'средний'
          ? 'Возможны слабые геомагнитные возмущения'
          : 'Магнитная обстановка спокойная',
        healthWarnings,
        startTime: level !== 'низкий' ? new Date().toISOString() : undefined,
        endTime: level !== 'низкий' ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined
      };

      this.setCachedData(cacheKey, stormInfo);
      return stormInfo;
    } catch (error) {
      console.error('Error fetching magnetic storm info:', error);
      throw error;
    }
  }

  generateHealthRecommendations(
    weatherInfo: WeatherInfo, 
    magneticInfo: MagneticStormInfo,
    userProfile?: { age?: number; conditions?: string[] }
  ): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = [];

    // Рекомендации по давлению
    if (weatherInfo.healthImpact === 'high' || magneticInfo.level === 'высокий') {
      recommendations.push({
        type: 'blood_pressure',
        title: '🩺 Контроль давления',
        description: 'Измерьте артериальное давление и следите за самочувствием',
        urgency: 'high',
        conditions: ['гипертония', 'сердечно-сосудистые заболевания']
      });
    }

    // Рекомендации по медитации
    if (magneticInfo.level !== 'низкий' || weatherInfo.condition === 'rainy') {
      recommendations.push({
        type: 'meditation',
        title: '🧘‍♀️ Дыхательная практика',
        description: 'Выполните 5-10 минут глубокого дыхания для снятия напряжения',
        urgency: 'medium',
        conditions: []
      });
    }

    // Рекомендации по активности
    if (weatherInfo.temperature > 25) {
      recommendations.push({
        type: 'exercise',
        title: '🌡️ Осторожно с нагрузками',
        description: 'В жару ограничьте интенсивные тренировки, выберите утренние часы',
        urgency: 'medium',
        conditions: []
      });
    } else if (weatherInfo.temperature < -10) {
      recommendations.push({
        type: 'exercise',
        title: '❄️ Разминка важна',
        description: 'В холод обязательно разминайтесь перед выходом на улицу',
        urgency: 'medium',
        conditions: []
      });
    }

    return recommendations;
  }
}

export const weatherMagneticService = WeatherMagneticService.getInstance();
