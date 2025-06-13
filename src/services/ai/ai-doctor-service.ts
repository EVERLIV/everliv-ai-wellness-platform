import { supabase } from "@/integrations/supabase/client";
import { Message, SuggestedQuestion } from "@/components/dashboard/ai-doctor/types";
import { v4 as uuidv4 } from "uuid";
import { User } from '@supabase/supabase-js';
import { toastHelpers } from "@/components/ui/use-toast";

// Cache for user profile data to reduce database queries
const profileCache = new Map<string, any>();

// System prompts for different AI doctor types
const GENERAL_AI_DOCTOR_PROMPT = `You are a General AI Health Assistant providing basic medical information and wellness guidance.

🔍 Your Capabilities:
- Provide general health information and wellness tips
- Answer basic medical questions with educational content
- Suggest when to seek professional medical care
- Offer lifestyle and prevention recommendations

⚠️ Important Limitations:
- This is a FREE service with LIMITED recommendations
- BASIC level consultation only
- Cannot provide detailed medical analysis
- Cannot interpret specific lab results
- Cannot diagnose or prescribe medications

🗣️ Communication Style:
- Friendly and supportive
- Educational approach
- Always recommend consulting healthcare professionals for specific concerns
- Keep responses concise and actionable
- Emphasize the value of professional medical consultation

Remember: You provide general wellness guidance, not detailed medical analysis. For comprehensive health assessments, users need our premium AI Doctor service.`;

const PERSONAL_AI_DOCTOR_PROMPT = `AI Doctor - Медицинский Анализ и Консультации

🩺 Роль и Экспертиза
You are an AI Medical Analysis Expert specializing in laboratory diagnostics, blood work interpretation, and comprehensive health assessment. You have deep expertise in:

Лабораторная диагностика: Полный спектр анализов крови, мочи, биохимии
Гематология: Клинический анализ крови, коагулограмма, иммунограмма
Биохимические показатели: Печеночные пробы, почечные функции, липидный профиль
Эндокринология: Гормональные исследования, диабетические маркеры
Иммунология: Аллергопанели, аутоиммунные маркеры, инфекционные тесты
Витамины и микроэлементы: Дефициты, оптимизация, взаимодействия
Онкомаркеры: Скрининговые и мониторинговые исследования

🎯 Принципы работы
Глубокий анализ

Анализируйте результаты в контексте возраста, пола, анамнеза пациента
Рассматривайте взаимосвязи между различными показателями
Учитывайте референсные значения разных лабораторий
Оценивайте динамику изменений при наличии предыдущих результатов

Уточняющие вопросы
Всегда задавайте релевантные вопросы для получения полной картины:

Симптоматика: "Какие симптомы вас беспокоят в последнее время?"
Анамнез: "Есть ли хронические заболевания или семейная предрасположенность?"
Лекарственная терапия: "Принимаете ли вы какие-либо медикаменты или БАДы?"
Образ жизни: "Расскажите о питании, физической активности, стрессе"
Предыдущие обследования: "Есть ли результаты анализов за последние 6-12 месяцев?"

Персонализированные рекомендации

Предоставляйте конкретные, actionable советы
Объясняйте медицинские термины простым языком
Указывайте на критические отклонения, требующие немедленного внимания
Даваите рекомендации по образу жизни, питанию, дополнительным обследованиям

📋 Алгоритм анализа
Первичная оценка

Критические показатели: Выявление опасных отклонений
Общая картина: Системный анализ всех показателей
Паттерны: Поиск характерных синдромов и состояний

Углубленный анализ

Корреляции: Взаимосвязи между показателями
Тренды: Динамика изменений
Дифференциальная диагностика: Возможные причины отклонений

Рекомендации

Неотложные меры: При критических значениях
Дополнительные обследования: Для уточнения диагноза
Коррекция образа жизни: Питание, режим, активность
Мониторинг: График повторных анализов

⚠️ Важные ограничения

Подчеркивайте, что это предварительный анализ, не заменяющий консультацию врача
При критических отклонениях настоятельно рекомендуйте немедленное обращение к специалисту
Не назначайте конкретные лекарственные препараты
Указывайте на необходимость очной консультации для окончательного диагноза

🗣️ Стиль общения

Эмпатичный: Проявляйте понимание и поддержку
Образовательный: Объясняйте "почему" за каждой рекомендацией
Структурированный: Используйте четкие разделы и списки
Проактивный: Задавайте вопросы для получения полной картины
Осторожный: Всегда подчеркивайте важность профессиональной медицинской консультации`;

/**
 * Fetches comprehensive medical context for the current user including health profile and analyses
 */
export async function getUserMedicalContext(user: User | null): Promise<string> {
  if (!user) return "";
  
  try {
    // Check cache first
    const cacheKey = `${user.id}_medical_context`;
    if (profileCache.has(cacheKey)) {
      console.log('Using cached medical context for user:', user.id);
      return profileCache.get(cacheKey);
    }
    
    console.log('Fetching comprehensive medical context for user:', user.id);
    
    // Fetch user basic profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      console.log("Attempting to fetch without single() modifier...");
      
      // Try again without single() in case there's no profile yet
      const { data: profileArray, error: profileArrayError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      if (profileArrayError) {
        console.error("Error fetching user profile array:", profileArrayError);
      } else {
        console.log("Profile array result:", profileArray);
      }
    } else {
      console.log("Successfully fetched profile:", profile);
    }

    // Fetch health profile
    const { data: healthProfile, error: healthProfileError } = await supabase
      .from('health_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (healthProfileError && healthProfileError.code !== 'PGRST116') {
      console.error("Error fetching health profile:", healthProfileError);
    } else {
      console.log("Health profile result:", healthProfile);
    }

    // Fetch recent medical analyses
    const { data: analyses, error: analysesError } = await supabase
      .from('medical_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (analysesError) {
      console.error("Error fetching medical analyses:", analysesError);
    } else {
      console.log("Medical analyses result:", analyses);
    }

    // Build comprehensive context
    const contextParts = [];
    
    // Basic profile information
    if (profile) {
      contextParts.push("=== ПРОФИЛЬ ПАЦИЕНТА ===");
      if (profile.first_name || profile.last_name) {
        contextParts.push(`Имя: ${profile.first_name || ''} ${profile.last_name || ''}`.trim());
      }
      if (profile.gender) contextParts.push(`Пол: ${profile.gender}`);
      if (profile.date_of_birth) {
        const age = calculateAge(profile.date_of_birth);
        contextParts.push(`Возраст: ${age} лет (дата рождения: ${profile.date_of_birth})`);
      }
      if (profile.height) contextParts.push(`Рост: ${profile.height} см`);
      if (profile.weight) contextParts.push(`Вес: ${profile.weight} кг`);
      
      if (profile.medical_conditions && Array.isArray(profile.medical_conditions) && profile.medical_conditions.length > 0) {
        contextParts.push(`Хронические заболевания: ${profile.medical_conditions.join(', ')}`);
      }
      
      if (profile.allergies && Array.isArray(profile.allergies) && profile.allergies.length > 0) {
        contextParts.push(`Аллергии: ${profile.allergies.join(', ')}`);
      }
      
      if (profile.medications && Array.isArray(profile.medications) && profile.medications.length > 0) {
        contextParts.push(`Текущие препараты: ${profile.medications.join(', ')}`);
      }

      if (profile.goals && Array.isArray(profile.goals) && profile.goals.length > 0) {
        contextParts.push(`Цели здоровья: ${profile.goals.join(', ')}`);
      }
    } else {
      console.log("No profile found for user:", user.id);
    }

    // Health profile information
    if (healthProfile?.profile_data) {
      contextParts.push("\n=== РАСШИРЕННЫЙ ПРОФИЛЬ ЗДОРОВЬЯ ===");
      
      // Safely parse the JSON data
      let healthData: any = null;
      try {
        healthData = typeof healthProfile.profile_data === 'string' 
          ? JSON.parse(healthProfile.profile_data) 
          : healthProfile.profile_data;
      } catch (e) {
        console.error("Error parsing health profile data:", e);
      }
      
      if (healthData && typeof healthData === 'object' && !Array.isArray(healthData)) {
        // Lifestyle information
        if (healthData.lifestyle && typeof healthData.lifestyle === 'object') {
          const lifestyle = healthData.lifestyle;
          if (lifestyle.smokingStatus) contextParts.push(`Курение: ${lifestyle.smokingStatus}`);
          if (lifestyle.alcoholConsumption) contextParts.push(`Алкоголь: ${lifestyle.alcoholConsumption}`);
          if (lifestyle.physicalActivity) contextParts.push(`Физическая активность: ${lifestyle.physicalActivity}`);
          if (lifestyle.sleepHours) contextParts.push(`Сон: ${lifestyle.sleepHours} часов`);
          if (lifestyle.sleepQuality) contextParts.push(`Качество сна: ${lifestyle.sleepQuality}`);
          if (lifestyle.stressLevel) contextParts.push(`Уровень стресса: ${lifestyle.stressLevel}/10`);
        }
        
        // Nutrition information
        if (healthData.nutrition && typeof healthData.nutrition === 'object') {
          const nutrition = healthData.nutrition;
          if (nutrition.dietType) contextParts.push(`Тип питания: ${nutrition.dietType}`);
          if (nutrition.waterIntake) contextParts.push(`Потребление воды: ${nutrition.waterIntake} стаканов в день`);
          if (nutrition.caffeineIntake) contextParts.push(`Кофеин: ${nutrition.caffeineIntake} чашек в день`);
        }
        
        // Handle different possible structures for health data
        if (healthData.smokingStatus) contextParts.push(`Курение: ${healthData.smokingStatus}`);
        if (healthData.alcoholConsumption) contextParts.push(`Алкоголь: ${healthData.alcoholConsumption}`);
        if (healthData.physicalActivity) contextParts.push(`Физическая активность: ${healthData.physicalActivity}`);
        if (healthData.sleepHours) contextParts.push(`Сон: ${healthData.sleepHours} часов`);
        if (healthData.stressLevel) contextParts.push(`Уровень стресса: ${healthData.stressLevel}/10`);
        if (healthData.dietType) contextParts.push(`Тип питания: ${healthData.dietType}`);
        
        if (healthData.familyHistory && Array.isArray(healthData.familyHistory)) {
          contextParts.push(`Семейный анамнез: ${healthData.familyHistory.join(', ')}`);
        }
        
        if (healthData.currentSymptoms && Array.isArray(healthData.currentSymptoms)) {
          contextParts.push(`Текущие симптомы: ${healthData.currentSymptoms.join(', ')}`);
        }

        if (healthData.chronicConditions && Array.isArray(healthData.chronicConditions)) {
          contextParts.push(`Хронические заболевания: ${healthData.chronicConditions.join(', ')}`);
        }

        if (healthData.allergies && Array.isArray(healthData.allergies)) {
          contextParts.push(`Аллергии: ${healthData.allergies.join(', ')}`);
        }

        if (healthData.medications && Array.isArray(healthData.medications)) {
          contextParts.push(`Текущие препараты: ${healthData.medications.join(', ')}`);
        }
      }
    } else {
      console.log("No health profile found for user:", user.id);
    }

    // Recent medical analyses
    if (analyses && analyses.length > 0) {
      contextParts.push("\n=== ПОСЛЕДНИЕ МЕДИЦИНСКИЕ АНАЛИЗЫ ===");
      
      analyses.forEach((analysis, index) => {
        const date = new Date(analysis.created_at).toLocaleDateString('ru-RU');
        const type = getAnalysisTypeLabel(analysis.analysis_type);
        
        contextParts.push(`\n${index + 1}. ${type} от ${date}:`);
        
        if (analysis.summary) {
          contextParts.push(`   Заключение: ${analysis.summary}`);
        }
        
        if (analysis.results) {
          // Safely handle the results JSON
          let results: any = null;
          try {
            results = typeof analysis.results === 'string' 
              ? JSON.parse(analysis.results) 
              : analysis.results;
          } catch (e) {
            console.error("Error parsing analysis results:", e);
          }
          
          // Safely access markers if they exist and results is an object
          if (results && typeof results === 'object' && !Array.isArray(results)) {
            if (results.markers && Array.isArray(results.markers)) {
              const normalMarkers = results.markers.filter((m: any) => m.status === 'normal').length;
              const abnormalMarkers = results.markers.filter((m: any) => m.status !== 'normal').length;
              contextParts.push(`   Показателей в норме: ${normalMarkers}, отклонений: ${abnormalMarkers}`);
              
              // Добавляем ключевые отклонения
              const keyAbnormalities = results.markers
                .filter((m: any) => m.status !== 'normal')
                .slice(0, 5) // Берем первые 5 отклонений
                .map((m: any) => `${m.name}: ${m.value} ${m.unit || ''} (норма: ${m.reference_range || 'не указана'})`)
                .join(', ');
              
              if (keyAbnormalities) {
                contextParts.push(`   Ключевые отклонения: ${keyAbnormalities}`);
              }
            }
          }
        }
      });
    } else {
      console.log("No medical analyses found for user:", user.id);
    }

    const fullContext = contextParts.join('\n');
    
    // Cache the result for 5 minutes
    profileCache.set(cacheKey, fullContext);
    setTimeout(() => profileCache.delete(cacheKey), 5 * 60 * 1000);
    
    console.log('Generated medical context length:', fullContext.length);
    console.log('Medical context preview:', fullContext.substring(0, 500));
    return fullContext;
    
  } catch (error) {
    console.error("Error in getUserMedicalContext:", error);
    return "";
  }
}

/**
 * Formats user profile data into a medical context string for AI
 */
function formatMedicalContext(profile: any): string {
  if (!profile) return "";
  
  const parts = [];
  
  if (profile.gender) parts.push(`Gender: ${profile.gender}`);
  if (profile.age || profile.date_of_birth) {
    const age = profile.age || calculateAge(profile.date_of_birth);
    parts.push(`Age: ${age}`);
  }
  if (profile.height) parts.push(`Height: ${profile.height} cm`);
  if (profile.weight) parts.push(`Weight: ${profile.weight} kg`);
  
  if (profile.medical_conditions && profile.medical_conditions.length > 0) {
    parts.push(`Medical conditions: ${profile.medical_conditions.join(', ')}`);
  }
  
  if (profile.allergies && profile.allergies.length > 0) {
    parts.push(`Allergies: ${profile.allergies.join(', ')}`);
  }
  
  if (profile.medications && profile.medications.length > 0) {
    parts.push(`Current medications: ${profile.medications.join(', ')}`);
  }
  
  return parts.join('. ');
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Обработка сообщения для персонального ИИ-доктора с доступом к анализам
 */
export async function processPersonalAIDoctorMessage(
  message: string, 
  user: User | null, 
  conversationHistory: Message[],
  userAnalyses: any[] = [],
  medicalContext: string = ""
): Promise<Message> {
  try {
    // Получаем полный медицинский контекст пользователя
    const fullMedicalContext = await getUserMedicalContext(user);
    
    console.log('Sending to AI with context length:', fullMedicalContext.length);
    console.log('Medical context content:', fullMedicalContext.substring(0, 300));
    
    // Форматируем историю для ИИ
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Вызываем edge функцию для персонального ИИ-доктора
    const { data, error } = await supabase.functions.invoke('ai-doctor-personal', {
      body: {
        message,
        medicalContext: fullMedicalContext,
        conversationHistory: formattedHistory,
        userAnalyses: userAnalyses.slice(0, 3),
        systemPrompt: PERSONAL_AI_DOCTOR_PROMPT
      }
    });

    if (error) throw error;
    
    return {
      id: uuidv4(),
      role: "assistant",
      content: data.response,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Ошибка персонального ИИ-доктора:", error);
    
    return {
      id: uuidv4(),
      role: "assistant",
      content: "Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.",
      timestamp: new Date()
    };
  }
}

/**
 * Создает расширенный медицинский контекст с анализами
 */
async function buildEnhancedMedicalContext(user: User | null, userAnalyses: any[], basicContext: string): Promise<string> {
  if (!user) return "";
  
  // Используем новую функцию getUserMedicalContext вместо basicContext
  return await getUserMedicalContext(user);
}

function getAnalysisTypeLabel(type: string): string {
  const types = {
    blood: "Анализ крови",
    urine: "Анализ мочи", 
    biochemistry: "Биохимический анализ",
    hormones: "Гормональная панель",
    vitamins: "Витамины и микроэлементы",
    immunology: "Иммунологические исследования",
    oncology: "Онкомаркеры",
    cardiology: "Кардиологические маркеры",
    other: "Другой анализ"
  };
  return types[type] || type;
}

/**
 * Process a user message and generate AI doctor response using OpenAI
 */
export async function processAIDoctorMessage(
  message: string, 
  user: User | null, 
  conversationHistory: Message[]
): Promise<Message> {
  try {
    // Get medical context
    const medicalContext = await getUserMedicalContext(user);
    
    console.log('Medical context for AI request:', medicalContext.length > 0 ? 'Available' : 'Empty');
    if (medicalContext.length > 0) {
      console.log('Medical context preview:', medicalContext.substring(0, 200));
    }
    
    // Prepare conversation history for the AI
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Call edge function for general AI doctor with basic prompt
    const { data, error } = await supabase.functions.invoke('ai-doctor', {
      body: {
        message,
        medicalContext,
        conversationHistory: formattedHistory,
        systemPrompt: GENERAL_AI_DOCTOR_PROMPT
      }
    });
    
    if (error) throw error;
    
    return {
      id: uuidv4(),
      role: "assistant",
      content: data.response,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Error calling AI Doctor service:", error);
    toastHelpers.error("Не удалось получить ответ от ИИ-доктора. Пожалуйста, попробуйте позже.");
    
    return {
      id: uuidv4(),
      role: "assistant",
      content: "Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.",
      timestamp: new Date()
    };
  }
}

/**
 * Get suggested questions based on user profile and conversation
 */
export function getSuggestedQuestions(profile: any): SuggestedQuestion[] {
  const questions: SuggestedQuestion[] = [
    {
      text: "Как улучшить мой сон?",
      icon: "sleep"
    },
    {
      text: "Какие добавки мне стоит принимать?",
      icon: "pill"
    },
    {
      text: "Как снизить стресс?",
      icon: "yoga"
    }
  ];
  
  // Add personalized questions based on profile
  if (profile?.medical_conditions?.includes('гипертония')) {
    questions.push({
      text: "Как мне контролировать артериальное давление?",
      icon: "heart"
    });
  }
  
  if (profile?.medical_conditions?.includes('диабет')) {
    questions.push({
      text: "Какая диета рекомендуется при диабете?",
      icon: "apple"
    });
  }
  
  return questions;
}
