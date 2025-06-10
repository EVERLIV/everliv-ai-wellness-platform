
import { AnalysisData, Biomarker } from "@/types/analysis";

export const getAnalysisTypeName = (type: string): string => {
  console.log('Getting analysis type name for:', type);
  const typeNames: { [key: string]: string } = {
    'blood_test': 'Общий анализ крови',
    'blood': 'Общий анализ крови',
    'biochemistry': 'Биохимический анализ крови',
    'hormones': 'Анализ гормонов',
    'vitamins': 'Анализ витаминов и микроэлементов',
    'lipid_profile': 'Липидограмма',
    'thyroid': 'Анализ функции щитовидной железы',
    'diabetes': 'Анализ на диабет',
    'liver': 'Печеночные пробы',
    'kidney': 'Почечные пробы'
  };
  const result = typeNames[type] || 'Медицинский анализ';
  console.log('Analysis type name result:', result);
  return result;
};

export const getBiomarkerDescription = (name: string): string => {
  const descriptions: { [key: string]: string } = {
    'Холестерин общий': 'Показатель липидного обмена, влияет на риск сердечно-сосудистых заболеваний',
    'Холестерин ЛПНП': 'Липопротеины низкой плотности, "плохой" холестерин',
    'Холестерин ЛПВП': 'Липопротеины высокой плотности, "хороший" холестерин',
    'Триглицериды': 'Основной тип жиров в крови, показатель энергетического метаболизма',
    'Глюкоза': 'Уровень сахара в крови, показатель углеводного обмена',
    'Гликированный гемоглобин': 'Средний уровень глюкозы за последние 2-3 месяца',
    'Инсулин': 'Гормон, регулирующий уровень глюкозы в крови',
    'Гемоглобин': 'Белок, переносящий кислород в крови',
    'Эритроциты': 'Красные кровяные тельца, переносят кислород',
    'Лейкоциты': 'Белые кровяные тельца, отвечают за иммунитет',
    'Тромбоциты': 'Кровяные пластинки, отвечают за свертываемость крови',
    'СОЭ': 'Скорость оседания эритроцитов, показатель воспаления',
    'Витамин D': 'Регулирует обмен кальция и фосфора, влияет на иммунитет',
    'Витамин B12': 'Необходим для работы нервной системы и образования крови',
    'Фолиевая кислота': 'Важна для синтеза ДНК и деления клеток',
    'Железо': 'Необходимо для транспорта кислорода и работы ферментов',
    'Ферритин': 'Показатель запасов железа в организме',
    'Трансферрин': 'Белок, переносящий железо в крови',
    'Креатинин': 'Показатель функции почек',
    'Мочевина': 'Продукт белкового обмена, показатель работы почек',
    'АЛТ': 'Фермент печени, показатель ее функции',
    'АСТ': 'Фермент, показатель состояния печени и сердца',
    'Билирубин общий': 'Продукт распада эритроцитов, показатель работы печени',
    'Белок общий': 'Показатель белкового обмена и функции печени',
    'Альбумин': 'Основной белок плазмы крови',
    'ТТГ': 'Тиреотропный гормон, регулирует работу щитовидной железы',
    'Т3 свободный': 'Активный гормон щитовидной железы',
    'Т4 свободный': 'Основной гормон щитовидной железы',
    'Кортизол': 'Гормон стресса, регулирует обмен веществ',
    'Тестостерон': 'Мужской половой гормон',
    'Эстрадиол': 'Женский половой гормон',
    'ПСА': 'Простат-специфический антиген, маркер здоровья простаты'
  };

  return descriptions[name] || 'Важный показатель здоровья, требует интерпретации специалистом';
};

export const processAnalysisData = (analysis: any): AnalysisData => {
  console.log('processAnalysisData called with:', analysis);
  const biomarkers: Biomarker[] = [];
  
  console.log('Обрабатываем результаты анализа:', analysis.results);
  
  if (analysis.results?.markers) {
    console.log('Found markers:', analysis.results.markers);
    for (const marker of analysis.results.markers) {
      console.log('Обрабатываем маркер:', marker);
      biomarkers.push({
        name: marker.name,
        value: marker.value,
        unit: marker.unit || '',
        status: marker.status || 'unknown',
        referenceRange: marker.normalRange || marker.reference_range || 'Н/Д',
        description: getBiomarkerDescription(marker.name)
      });
    }
  } else {
    console.log('No markers found in results');
  }

  const result = {
    id: analysis.id,
    analysisType: getAnalysisTypeName(analysis.analysis_type),
    createdAt: analysis.created_at,
    biomarkers
  };

  console.log('Финальный результат обработки:', result);
  return result;
};
