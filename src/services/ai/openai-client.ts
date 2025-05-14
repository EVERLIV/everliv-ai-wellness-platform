
import OpenAI from 'openai';

// OpenAI client instance with lazy initialization
let openaiClient: OpenAI | null = null;

// Function to initialize the OpenAI client
export const initializeOpenAI = (): OpenAI => {
  if (!openaiClient) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key is not set. Running in demo mode.');
      // Create a minimal placeholder client for demo mode
      openaiClient = {
        chat: {
          completions: {
            create: async () => {
              // Return mock data in demo mode
              return {
                choices: [
                  {
                    message: {
                      content: "This is a demo response. Please set VITE_OPENAI_API_KEY to enable the full functionality."
                    }
                  }
                ]
              };
            }
          }
        }
      } as unknown as OpenAI;
    } else {
      openaiClient = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }
  
  return openaiClient;
};

// Re-usable function to generate chat completions
export const generateChatCompletion = async (
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
  } = {}
): Promise<string> => {
  const client = initializeOpenAI();
  
  try {
    const completion = await client.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1500,
    });
    
    return completion.choices[0]?.message.content || "Не удалось получить ответ";
  } catch (error) {
    console.error('Error generating chat completion:', error);
    return "Произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.";
  }
};

// Function used by AI Doctor for generating responses to user queries
export const generateAIResponse = async (userMessage: string): Promise<string> => {
  const systemPrompt = `Вы опытный врач-терапевт, который помогает пользователям с их медицинскими вопросами. 
  Отвечайте четко, профессионально и с эмпатией. Основывайтесь только на научно подтвержденных медицинских знаниях.
  В случае серьезных симптомов, всегда советуйте обратиться к врачу.
  Отвечайте на русском языке.`;
  
  return generateChatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ], {
    temperature: 0.7,
    model: 'gpt-3.5-turbo'
  });
};

export default {
  initializeOpenAI,
  generateChatCompletion,
  generateAIResponse
};
