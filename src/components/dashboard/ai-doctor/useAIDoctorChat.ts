
import { useState } from "react";
import { Message } from "./types";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export const useAIDoctorChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: "Здравствуйте! Я ИИ-доктор, готовый помочь вам с вопросами о здоровье и долголетии. Мои рекомендации основаны на анализе тысяч научных исследований. Чем могу вам помочь сегодня?",
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { profileData } = useProfile();

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const sendMessage = async (text: string) => {
    if (text.trim() === "") return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      // Prepare context based on profile data
      let profileContext = "";
      if (profileData) {
        profileContext = `Информация о пользователе: 
          Возраст: ${profileData.date_of_birth ? calculateAge(profileData.date_of_birth) : "не указан"}, 
          Пол: ${profileData.gender || "не указан"}, 
          Рост: ${profileData.height ? `${profileData.height} см` : "не указан"}, 
          Вес: ${profileData.weight ? `${profileData.weight} кг` : "не указан"}`;
        
        if (profileData.medical_conditions && profileData.medical_conditions.length > 0) {
          profileContext += `, Медицинские условия: ${profileData.medical_conditions.join(", ")}`;
        }
        
        if (profileData.allergies && profileData.allergies.length > 0) {
          profileContext += `, Аллергии: ${profileData.allergies.join(", ")}`;
        }
        
        if (profileData.medications && profileData.medications.length > 0) {
          profileContext += `, Принимаемые препараты: ${profileData.medications.join(", ")}`;
        }
      }

      // Simulate OpenAI API call
      setTimeout(() => {
        let responseContent = "";
        
        if (text.toLowerCase().includes("выносливость")) {
          responseContent = `Для улучшения выносливости рекомендую комплексный подход:\n\n1. **Интервальные тренировки** - чередуйте короткие интенсивные периоды нагрузки с периодами восстановления.\n\n2. **Правильное питание** - увеличьте потребление сложных углеводов и белка.\n\n3. **Оптимизация сна** - обеспечьте 7-8 часов качественного сна.\n\n4. **Добавки** - рассмотрите прием креатина, бета-аланина и кофеина перед тренировкой.\n\n5. **Периодизация тренировок** - постепенно увеличивайте интенсивность и объем нагрузок.`;
        } else if (text.toLowerCase().includes("сон")) {
          responseContent = `Для улучшения качества сна рекомендую:\n\n1. **Регулярный режим** - ложитесь и вставайте в одно время.\n\n2. **Оптимальные условия** - температура в спальне 18-20°C, полная темнота и тишина.\n\n3. **Ограничение синего света** - исключите гаджеты за 1-2 часа до сна.\n\n4. **Добавки** - можно рассмотреть магний глицинат (200-400 мг) и мелатонин (0.3-1 мг) за 30-60 минут до сна.\n\n5. **Избегайте стимуляторов** - исключите кофеин после 14:00.`;
        } else if (text.toLowerCase().includes("сердц")) {
          responseContent = `Для поддержки здоровья сердца рекомендую:\n\n1. **Омега-3 жирные кислоты** - EPA и DHA в дозировке 1-2 г в день помогают снизить воспаление и поддерживают здоровый липидный профиль.\n\n2. **Коэнзим Q10** - 100-200 мг в день, особенно если вы принимаете статины.\n\n3. **Магний** - 300-400 мг в день для поддержки нормального сердечного ритма.\n\n4. **Физическая активность** - 150 минут умеренных аэробных нагрузок в неделю.\n\n5. **Средиземноморская диета** - богатая оливковым маслом, рыбой, орехами и овощами.`;
        } else if (text.toLowerCase().includes("метаболизм")) {
          responseContent = `Для оптимизации метаболизма рекомендую:\n\n1. **Силовые тренировки** - 2-3 раза в неделю для увеличения мышечной массы.\n\n2. **Прием пищи** - 4-5 небольших приемов пищи в течение дня для поддержания стабильного уровня глюкозы.\n\n3. **Белок** - увеличьте потребление до 1.6-2 г на кг веса тела.\n\n4. **Добавки** - зеленый чай, L-карнитин и альфа-липоевая кислота могут помочь активировать метаболизм.\n\n5. **Интервальное голодание** - рассмотрите протокол 16:8, если это подходит вашему образу жизни.`;
        } else {
          responseContent = `Благодарю за ваш вопрос. Основываясь на научных данных, могу предложить следующие рекомендации:\n\n1. **Индивидуальный подход** - важно учитывать ваши персональные характеристики и цели.\n\n2. **Комплексные меры** - сочетание правильного питания, физической активности, управления стрессом и качественного сна даст наилучший результат.\n\n3. **Регулярная диагностика** - рекомендую периодически проходить комплексное обследование для корректировки рекомендаций.\n\nМогу предоставить более конкретные рекомендации, если вы поделитесь дополнительной информацией о ваших целях и текущем состоянии здоровья.`;
        }

        // Add assistant response
        const aiResponse: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Произошла ошибка при получении ответа ИИ-доктора");
      setIsProcessing(false);
    }
  };

  return {
    messages,
    inputText,
    isProcessing,
    setInputText,
    sendMessage,
  };
};
