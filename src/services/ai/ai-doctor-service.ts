import { supabase } from "@/integrations/supabase/client";
import { Message, SuggestedQuestion } from "@/components/dashboard/ai-doctor/types";
import { v4 as uuidv4 } from "uuid";
import { User } from '@supabase/supabase-js';
import { toastHelpers } from "@/components/ui/use-toast";

// Cache for user profile data to reduce database queries
const profileCache = new Map<string, any>();

// Enhanced system prompts for different AI doctor types
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

/**
 * Enhanced function to fetch comprehensive medical context for the current user
 */
export async function getUserMedicalContext(user: User | null): Promise<string> {
  if (!user) {
    console.log('No user provided to getUserMedicalContext');
    return "";
  }
  
  try {
    // Check cache first
    const cacheKey = `${user.id}_medical_context_enhanced`;
    if (profileCache.has(cacheKey)) {
      console.log('Using cached enhanced medical context for user:', user.id);
      return profileCache.get(cacheKey);
    }
    
    console.log('Fetching comprehensive enhanced medical context for user:', user.id);
    
    // Fetch user basic profile
    let profile = null;
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        profile = profileData;
      }
    } catch (error) {
      console.error("Exception fetching profile:", error);
    }

    // Fetch health profile
    let healthProfile = null;
    try {
      const { data: healthProfileData, error: healthProfileError } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (healthProfileError && healthProfileError.code !== 'PGRST116') {
        console.error("Error fetching health profile:", healthProfileError);
      } else {
        healthProfile = healthProfileData;
      }
    } catch (error) {
      console.error("Exception fetching health profile:", error);
    }

    // Fetch recent medical analyses
    let analyses = [];
    try {
      const { data: analysesData, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10); // Увеличиваем до 10 анализов
      
      if (analysesError) {
        console.error("Error fetching medical analyses:", analysesError);
      } else {
        analyses = analysesData || [];
      }
    } catch (error) {
      console.error("Exception fetching medical analyses:", error);
    }

    // Fetch personal recommendations for context
    let recommendations = [];
    try {
      const { data: recommendationsData, error: recommendationsError } = await supabase
        .from('personal_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recommendationsError) {
        console.error("Error fetching recommendations:", recommendationsError);
      } else {
        recommendations = recommendationsData || [];
      }
    } catch (error) {
      console.error("Exception fetching recommendations:", error);
    }

    // Build enhanced comprehensive context
    const contextParts = [];
    
    // Basic profile information with enhanced formatting
    contextParts.push("🧑‍⚕️ === ПРОФИЛЬ ПАЦИЕНТА ===");
    if (profile) {
      if (profile.first_name || profile.last_name) {
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        contextParts.push(`👤 Имя: ${fullName}`);
      }
      if (profile.gender) contextParts.push(`⚧️ Пол: ${profile.gender}`);
      if (profile.date_of_birth) {
        const age = calculateAge(profile.date_of_birth);
        contextParts.push(`🎂 Возраст: ${age} лет (дата рождения: ${profile.date_of_birth})`);
      }
      if (profile.height) contextParts.push(`📏 Рост: ${profile.height} см`);
      if (profile.weight) {
        contextParts.push(`⚖️ Вес: ${profile.weight} кг`);
        if (profile.height) {
          const heightM = profile.height / 100;
          const bmi = (profile.weight / (heightM * heightM)).toFixed(1);
          contextParts.push(`📊 ИМТ: ${bmi}`);
        }
      }
      
      if (profile.medical_conditions && Array.isArray(profile.medical_conditions) && profile.medical_conditions.length > 0) {
        contextParts.push(`🏥 Хронические заболевания: ${profile.medical_conditions.join(', ')}`);
      }
      
      if (profile.allergies && Array.isArray(profile.allergies) && profile.allergies.length > 0) {
        contextParts.push(`🚫 Аллергии: ${profile.allergies.join(', ')}`);
      }
      
      if (profile.medications && Array.isArray(profile.medications) && profile.medications.length > 0) {
        contextParts.push(`💊 Текущие препараты: ${profile.medications.join(', ')}`);
      }

      if (profile.goals && Array.isArray(profile.goals) && profile.goals.length > 0) {
        contextParts.push(`🎯 Цели здоровья: ${profile.goals.join(', ')}`);
      }
    } else {
      contextParts.push("ℹ️ Базовый профиль пользователя не заполнен");
    }

    // Enhanced health profile information
    if (healthProfile?.profile_data) {
      contextParts.push("\n🔬 === РАСШИРЕННЫЙ ПРОФИЛЬ ЗДОРОВЬЯ ===");
      
      let healthData: any = null;
      try {
        healthData = typeof healthProfile.profile_data === 'string' 
          ? JSON.parse(healthProfile.profile_data) 
          : healthProfile.profile_data;
      } catch (e) {
        console.error("Error parsing health profile data:", e);
      }
      
      if (healthData && typeof healthData === 'object' && !Array.isArray(healthData)) {
        // Lifestyle information with enhanced categorization
        if (healthData.lifestyle && typeof healthData.lifestyle === 'object') {
          const lifestyle = healthData.lifestyle;
          contextParts.push("\n🏃‍♂️ ОБРАЗ ЖИЗНИ:");
          if (lifestyle.smokingStatus) contextParts.push(`  🚬 Курение: ${lifestyle.smokingStatus}`);
          if (lifestyle.alcoholConsumption) contextParts.push(`  🍷 Алкоголь: ${lifestyle.alcoholConsumption}`);
          if (lifestyle.physicalActivity) contextParts.push(`  💪 Физическая активность: ${lifestyle.physicalActivity}`);
          if (lifestyle.sleepHours) contextParts.push(`  😴 Сон: ${lifestyle.sleepHours} часов`);
          if (lifestyle.sleepQuality) contextParts.push(`  🌙 Качество сна: ${lifestyle.sleepQuality}`);
          if (lifestyle.stressLevel) contextParts.push(`  😰 Уровень стресса: ${lifestyle.stressLevel}/10`);
        }
        
        // Nutrition information
        if (healthData.nutrition && typeof healthData.nutrition === 'object') {
          const nutrition = healthData.nutrition;
          contextParts.push("\n🍎 ПИТАНИЕ:");
          if (nutrition.dietType) contextParts.push(`  🥗 Тип питания: ${nutrition.dietType}`);
          if (nutrition.waterIntake) contextParts.push(`  💧 Потребление воды: ${nutrition.waterIntake} стаканов в день`);
          if (nutrition.caffeineIntake) contextParts.push(`  ☕ Кофеин: ${nutrition.caffeineIntake} чашек в день`);
        }
        
        // Handle different possible structures for health data
        if (healthData.familyHistory && Array.isArray(healthData.familyHistory)) {
          contextParts.push(`\n👨‍👩‍👧‍👦 Семейный анамнез: ${healthData.familyHistory.join(', ')}`);
        }
        
        if (healthData.currentSymptoms && Array.isArray(healthData.currentSymptoms)) {
          contextParts.push(`\n🤒 Текущие симптомы: ${healthData.currentSymptoms.join(', ')}`);
        }
      }
    }

    // Enhanced medical analyses section
    if (analyses && analyses.length > 0) {
      contextParts.push("\n📊 === ИСТОРИЯ МЕДИЦИНСКИХ АНАЛИЗОВ ===");
      
      analyses.forEach((analysis, index) => {
        const date = new Date(analysis.created_at).toLocaleDateString('ru-RU');
        const type = getAnalysisTypeLabel(analysis.analysis_type);
        
        contextParts.push(`\n📋 ${index + 1}. ${type} от ${date}:`);
        
        if (analysis.summary) {
          contextParts.push(`   💡 Заключение: ${analysis.summary}`);
        }
        
        if (analysis.results) {
          let results: any = null;
          try {
            results = typeof analysis.results === 'string' 
              ? JSON.parse(analysis.results) 
              : analysis.results;
          } catch (e) {
            console.error("Error parsing analysis results:", e);
          }
          
          if (results && typeof results === 'object' && !Array.isArray(results)) {
            if (results.markers && Array.isArray(results.markers)) {
              const normalMarkers = results.markers.filter((m: any) => m.status === 'normal').length;
              const abnormalMarkers = results.markers.filter((m: any) => m.status !== 'normal').length;
              contextParts.push(`   ✅ Показателей в норме: ${normalMarkers}, ⚠️ отклонений: ${abnormalMarkers}`);
              
              // Добавляем детальные отклонения для лучшего анализа
              const keyAbnormalities = results.markers
                .filter((m: any) => m.status !== 'normal')
                .slice(0, 6)
                .map((m: any) => {
                  const trend = m.status === 'high' ? '📈' : m.status === 'low' ? '📉' : '⚠️';
                  return `${trend} ${m.name}: ${m.value} ${m.unit || ''} (норма: ${m.reference_range || 'не указана'})`;
                })
                .join('\n   ');
              
              if (keyAbnormalities) {
                contextParts.push(`   🔍 Основные отклонения:\n   ${keyAbnormalities}`);
              }
            }
          }
        }
      });
    }

    // Personal recommendations context
    if (recommendations && recommendations.length > 0) {
      contextParts.push("\n💡 === ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ ===");
      recommendations.forEach((rec, index) => {
        const status = rec.is_completed ? '✅' : '⏳';
        contextParts.push(`${status} ${index + 1}. [${rec.category}] ${rec.title}`);
        if (rec.description) {
          contextParts.push(`   📝 ${rec.description.substring(0, 100)}...`);
        }
      });
    }

    const fullContext = contextParts.join('\n');
    
    // Cache the result for 3 minutes (shorter for more up-to-date data)
    profileCache.set(cacheKey, fullContext);
    setTimeout(() => profileCache.delete(cacheKey), 3 * 60 * 1000);
    
    console.log('Generated enhanced medical context length:', fullContext.length);
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


function getAnalysisTypeLabel(type: string): string {
  const types = {
    blood: "🩸 Анализ крови",
    urine: "🧪 Анализ мочи", 
    biochemistry: "⚗️ Биохимический анализ",
    hormones: "🧬 Гормональная панель",
    vitamins: "💊 Витамины и микроэлементы",
    immunology: "🛡️ Иммунологические исследования",
    oncology: "🎗️ Онкомаркеры",
    cardiology: "❤️ Кардиологические маркеры",
    other: "📋 Другой анализ"
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
    const medicalContext = await getUserMedicalContext(user);
    
    console.log('Medical context for AI request:', medicalContext.length > 0 ? 'Available' : 'Empty');
    
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
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
      text: "Проанализируй мои последние анализы крови",
      icon: "microscope"
    },
    {
      text: "Какие витамины мне стоит принимать?",
      icon: "pill"
    },
    {
      text: "Как улучшить мои показатели здоровья?",
      icon: "trending-up"
    },
    {
      text: "Объясни мои биомаркеры простым языком",
      icon: "book-open"
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
