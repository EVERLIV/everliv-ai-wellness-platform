
import OpenAI from 'openai';

// Initialize OpenAI client 
// In production, you would use environment variables for the API key
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-api-key',
  dangerouslyAllowBrowser: true, // For client-side usage, not recommended for production
});

// Export function to initialize OpenAI client for use in other modules
export function initializeOpenAI() {
  return openai;
}

export async function generateAIResponse(message: string): Promise<string> {
  try {
    // Use a conditional check to handle demo mode when no API key is set
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'demo-api-key') {
      // Return pre-defined responses for demo mode
      console.log("Running in demo mode - using canned responses");
      return getMockResponse(message);
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Вы - ИИ-доктор, специализирующийся на персонализированной медицине и здоровом долголетии. Давайте краткие, но информативные ответы на вопросы о здоровье, профилактике заболеваний и здоровом образе жизни. Основывайте свои ответы на научных данных." },
        { role: "user", content: message }
      ],
      model: "gpt-4o-mini",
    });

    return completion.choices[0].message.content || "Извините, не удалось сгенерировать ответ.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.";
  }
}

// Mock responses for demo mode
function getMockResponse(message: string): string {
  const lowercaseMessage = message.toLowerCase();

  if (lowercaseMessage.includes('давлен') || lowercaseMessage.includes('гиперт')) {
    return "Для контроля артериального давления рекомендую регулярную физическую активность (30-40 минут в день), ограничение потребления соли до 5-6 г в сутки, увеличение потребления овощей и фруктов, отказ от курения и умеренное потребление алкоголя. Важно регулярно измерять давление и консультироваться с врачом о медикаментозной терапии при необходимости.";
  }
  
  if (lowercaseMessage.includes('сон') || lowercaseMessage.includes('спать') || lowercaseMessage.includes('бессонниц')) {
    return "Качественный сон критически важен для здоровья. Рекомендую соблюдать режим (ложиться и вставать в одно время), создать комфортную обстановку в спальне (температура 18-20°C, темнота, тишина), исключить гаджеты за 1-2 часа до сна, ограничить кофеин во второй половине дня. При хронической бессоннице необходима консультация специалиста.";
  }
  
  if (lowercaseMessage.includes('стресс') || lowercaseMessage.includes('тревог')) {
    return "Для управления стрессом эффективны регулярные практики медитации (10-15 минут в день), дыхательные упражнения, физическая активность, полноценный сон, тайм-менеджмент и четкий режим дня. Можно использовать методы прогрессивной мышечной релаксации и когнитивно-поведенческие техники. При сильной тревожности рекомендую консультацию психотерапевта.";
  }
  
  if (lowercaseMessage.includes('питан') || lowercaseMessage.includes('еда') || lowercaseMessage.includes('диет')) {
    return "Оптимальное питание для долголетия включает: разнообразие свежих овощей и фруктов (5+ порций в день), цельные злаки вместо обработанных, белок из растительных источников и рыбы, полезные жиры (оливковое масло, орехи, авокадо), ограничение обработанных продуктов, сахара и красного мяса. Интервальное голодание (например, 16/8) также показывает положительное влияние на долголетие.";
  }
  
  if (lowercaseMessage.includes('витамин') || lowercaseMessage.includes('добавк')) {
    return "Основные витамины и минералы лучше получать из разнообразного питания. Однако, некоторым группам могут требоваться добавки: витамин D (особенно зимой), Омега-3 (при недостаточном потреблении рыбы), B12 (для вегетарианцев). Перед приемом добавок важно проконсультироваться с врачом и сдать анализы на дефициты, так как избыток некоторых витаминов может быть вреден.";
  }
  
  return "Для поддержания здорового долголетия рекомендую комплексный подход: регулярная физическая активность (150+ минут умеренной нагрузки в неделю), средиземноморская диета с акцентом на растительную пищу, качественный сон (7-8 часов), управление стрессом (медитация, дыхательные практики), социальная активность и постоянное интеллектуальное развитие. Регулярные профилактические обследования также критически важны для раннего выявления возможных проблем.";
}
