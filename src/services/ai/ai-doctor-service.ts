
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
 * Fetches medical context for the current user to enhance AI responses
 */
export async function getUserMedicalContext(user: User | null): Promise<string> {
  if (!user) return "";
  
  try {
    // Check cache first
    if (profileCache.has(user.id)) {
      const cachedProfile = profileCache.get(user.id);
      return formatMedicalContext(cachedProfile);
    }
    
    // Fetch user profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user medical context:", error);
      return "";
    }
    
    // Cache the profile data
    profileCache.set(user.id, profile);
    
    return formatMedicalContext(profile);
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
    // Подготавливаем расширенный медицинский контекст
    const enhancedContext = await buildEnhancedMedicalContext(user, userAnalyses, medicalContext);
    
    // Форматируем историю для ИИ
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Вызываем edge функцию для персонального ИИ-доктора с новым промтом
    const { data, error } = await supabase.functions.invoke('ai-doctor-personal', {
      body: {
        message,
        medicalContext: enhancedContext,
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
  
  const contextParts = [basicContext];
  
  // Добавляем информацию об анализах
  if (userAnalyses.length > 0) {
    contextParts.push("\nПоследние медицинские анализы пользователя:");
    
    userAnalyses.slice(0, 3).forEach((analysis, index) => {
      const date = new Date(analysis.created_at).toLocaleDateString('ru-RU');
      const type = getAnalysisTypeLabel(analysis.analysis_type);
      
      contextParts.push(`${index + 1}. ${type} от ${date}:`);
      
      if (analysis.results?.markers) {
        const normalMarkers = analysis.results.markers.filter(m => m.status === 'normal').length;
        const abnormalMarkers = analysis.results.markers.filter(m => m.status !== 'normal').length;
        contextParts.push(`   - Показателей в норме: ${normalMarkers}`);
        contextParts.push(`   - Отклонений: ${abnormalMarkers}`);
        
        // Добавляем ключевые отклонения
        const keyAbnormalities = analysis.results.markers
          .filter(m => m.status !== 'normal')
          .slice(0, 3)
          .map(m => `${m.name}: ${m.value} (${m.status})`)
          .join(', ');
        
        if (keyAbnormalities) {
          contextParts.push(`   - Ключевые отклонения: ${keyAbnormalities}`);
        }
      }
      
      if (analysis.results?.summary) {
        contextParts.push(`   - Краткое резюме: ${analysis.results.summary.substring(0, 200)}...`);
      }
    });
  }
  
  return contextParts.join('\n');
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
