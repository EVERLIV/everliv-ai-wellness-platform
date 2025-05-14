
import { generateChatCompletion } from './openai-client';

// Helper function for AI doctor chat
export const generateDoctorResponse = async (userMessage: string): Promise<string> => {
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
