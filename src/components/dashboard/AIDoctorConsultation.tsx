import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, User, Bot, Brain, Heart, Activity, ThumbsUp } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
// No imports needed from openai-service for this component

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type SuggestedQuestion = {
  text: string;
  icon: React.ReactNode;
};

const AIDoctorConsultation: React.FC = () => {
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
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      text: "Как улучшить выносливость?",
      icon: <Activity className="h-4 w-4 text-blue-500" />,
    },
    {
      text: "Рекомендации для улучшения сна",
      icon: <Brain className="h-4 w-4 text-purple-500" />,
    },
    {
      text: "Какие добавки помогут моему сердцу?",
      icon: <Heart className="h-4 w-4 text-red-500" />,
    },
    {
      text: "Как оптимизировать метаболизм?",
      icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      // Simulate OpenAI API call (replace with actual implementation)
      // In production, this should use your backend to call OpenAI
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const useSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-600" />
          Консультация с ИИ-доктором
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4 max-h-[60vh]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === "user" ? (
                    <User className="h-4 w-4 mr-1" />
                  ) : (
                    <Bot className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.role === "user" ? "Вы" : "ИИ-доктор"} •{" "}
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>ИИ-доктор печатает...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {messages.length === 1 && (
        <div className="px-4 mb-4">
          <h4 className="text-sm font-medium mb-2">Рекомендуемые вопросы:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-2"
                onClick={() => useSuggestedQuestion(question.text)}
              >
                {question.icon}
                <span className="ml-2 truncate">{question.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="pt-2 border-t">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            placeholder="Введите ваш вопрос..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            className="flex-grow"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIDoctorConsultation;
