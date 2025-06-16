
import { supabase } from "@/integrations/supabase/client";

interface EmailData {
  type: 'registration' | 'analysis' | 'newsletter';
  to: string;
  data: any;
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    console.log('Отправка email:', emailData.type, 'для', emailData.to);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });

    if (error) {
      console.error('Ошибка отправки email:', error);
      throw new Error(error.message || 'Не удалось отправить email');
    }

    console.log('Email успешно отправлен:', data);
    return data;
  } catch (error) {
    console.error('Ошибка сервиса email:', error);
    throw error;
  }
};

// Функция для отправки email подтверждения регистрации
export const sendRegistrationConfirmationEmail = async (
  email: string, 
  userName: string, 
  confirmationUrl: string
) => {
  return sendEmail({
    type: 'registration',
    to: email,
    data: {
      userName,
      confirmationUrl,
    }
  });
};

// Функция для отправки уведомления о результатах анализа
export const sendAnalysisResultsEmail = async (
  email: string,
  userName: string,
  analysisType: string,
  resultsUrl: string,
  keyFindings: string[]
) => {
  return sendEmail({
    type: 'analysis',
    to: email,
    data: {
      userName,
      analysisType,
      resultsUrl,
      keyFindings,
    }
  });
};

// Функция для отправки newsletter
export const sendMedicalNewsletterEmail = async (
  email: string,
  userName: string,
  articles: Array<{title: string, summary: string, url: string}>,
  tips: Array<{icon: string, title: string, description: string}>
) => {
  return sendEmail({
    type: 'newsletter',
    to: email,
    data: {
      userName,
      articles,
      tips,
    }
  });
};
