
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, HelpCircle, Mail, MessageCircle, Book, Phone } from "lucide-react";
import { toast } from "sonner";

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Здесь будет логика отправки сообщения в поддержку
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация отправки
      toast.success("Сообщение отправлено! Мы свяжемся с вами в ближайшее время.");
      setFormData({ subject: "", message: "", email: "" });
    } catch (error) {
      toast.error("Ошибка отправки сообщения. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Онлайн чат",
      description: "Получите быструю помощь в чате",
      action: "Начать чат",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Mail,
      title: "Email поддержка",
      description: "support@everliv.ru",
      action: "Написать письмо",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Phone,
      title: "Телефон",
      description: "+7 (495) 123-45-67",
      action: "Позвонить",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Book,
      title: "База знаний",
      description: "Ответы на частые вопросы",
      action: "Открыть FAQ",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Поддержка</h1>
          </div>

          <div className="grid gap-6">
            {/* Способы связи */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Как мы можем помочь?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportOptions.map((option, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className={`p-3 rounded-lg ${option.bgColor}`}>
                        <option.icon className={`h-6 w-6 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                        <Button variant="link" className="p-0 h-auto mt-1 text-primary">
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Форма обратной связи */}
            <Card>
              <CardHeader>
                <CardTitle>Написать в поддержку</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email для ответа</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Тема обращения</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Опишите кратко суть вопроса"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Подробно опишите ваш вопрос или проблему"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Часто задаваемые вопросы */}
            <Card>
              <CardHeader>
                <CardTitle>Часто задаваемые вопросы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-semibold mb-2">Как отменить подписку?</h4>
                    <p className="text-sm text-gray-600">
                      Вы можете отменить подписку в разделе "Оплата" в настройках аккаунта.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h4 className="font-semibold mb-2">Как изменить план подписки?</h4>
                    <p className="text-sm text-gray-600">
                      Перейдите в раздел "Цены" и выберите новый план. Изменения вступят в силу немедленно.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h4 className="font-semibold mb-2">Безопасны ли мои данные?</h4>
                    <p className="text-sm text-gray-600">
                      Да, мы используем современные методы шифрования и соблюдаем все требования по защите персональных данных.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/faq')}
                    className="w-full"
                  >
                    Посмотреть все вопросы
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default Support;
