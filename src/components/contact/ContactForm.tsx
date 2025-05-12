
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Users, MessageCircle } from "lucide-react";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.");
      setIsSubmitting(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-everliv-800">Связаться с нами</h2>
      
      <Tabs defaultValue="contact" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> 
            Общий вопрос
          </TabsTrigger>
          <TabsTrigger value="consultation" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> 
            Консультация
          </TabsTrigger>
          <TabsTrigger value="partnership" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> 
            Партнерство
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-gray-700 font-medium">Имя</label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-gray-700 font-medium">Фамилия</label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-gray-700 font-medium">Тема</label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
                required
              >
                <option value="">Выберите тему обращения</option>
                <option value="general">Общий вопрос</option>
                <option value="support">Техническая поддержка</option>
                <option value="billing">Вопросы оплаты</option>
                <option value="refund">Возврат средств</option>
                <option value="subscription">Вопросы по подписке</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-gray-700 font-medium">Сообщение</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
                required
              ></textarea>
            </div>

            <div className="flex items-start">
              <input
                id="privacy"
                name="privacy"
                type="checkbox"
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="privacy" className="text-sm text-gray-600">
                Я согласен с <a href="/privacy-policy" className="text-everliv-600 hover:underline">Политикой конфиденциальности</a> и даю разрешение на обработку моих персональных данных
              </label>
            </div>

            <Button 
              type="submit"
              className="bg-everliv-600 hover:bg-everliv-700 text-white" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Отправить сообщение"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="consultation">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-gray-700 font-medium">Имя</label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-gray-700 font-medium">Фамилия</label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-gray-700 font-medium">Телефон</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="consultationType" className="text-gray-700 font-medium">Тип консультации</label>
              <select
                id="consultationType"
                name="consultationType"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
                required
              >
                <option value="">Выберите тип консультации</option>
                <option value="initial">Первичная консультация</option>
                <option value="followup">Повторная консультация</option>
                <option value="bloodAnalysis">Анализ результатов исследований</option>
                <option value="protocol">Разработка персонального протокола</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="preferredDate" className="text-gray-700 font-medium">Предпочтительная дата</label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="additionalInfo" className="text-gray-700 font-medium">Дополнительная информация</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
                placeholder="Опишите кратко цель вашей консультации или имеющиеся проблемы со здоровьем"
              ></textarea>
            </div>

            <div className="flex items-start">
              <input
                id="privacy-consultation"
                name="privacy"
                type="checkbox"
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="privacy-consultation" className="text-sm text-gray-600">
                Я согласен с <a href="/privacy-policy" className="text-everliv-600 hover:underline">Политикой конфиденциальности</a> и даю разрешение на обработку моих персональных данных
              </label>
            </div>

            <Button 
              type="submit"
              className="bg-everliv-600 hover:bg-everliv-700 text-white" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Записаться на консультацию"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="partnership">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-gray-700 font-medium">Название компании</label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="website" className="text-gray-700 font-medium">Веб-сайт</label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="contactName" className="text-gray-700 font-medium">Контактное лицо</label>
                <Input
                  id="contactName"
                  name="contactName"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="text-gray-700 font-medium">Должность</label>
                <Input
                  id="position"
                  name="position"
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="businessEmail" className="text-gray-700 font-medium">Корпоративный Email</label>
                <Input
                  id="businessEmail"
                  name="businessEmail"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-gray-700 font-medium">Телефон</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="partnershipType" className="text-gray-700 font-medium">Тип партнерства</label>
              <select
                id="partnershipType"
                name="partnershipType"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
                required
              >
                <option value="">Выберите вариант сотрудничества</option>
                <option value="distributor">Дистрибьютор</option>
                <option value="medicalCenter">Медицинский центр</option>
                <option value="doctor">Врач/Специалист</option>
                <option value="reseller">Реселлер</option>
                <option value="affiliate">Партнерская программа</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="partnershipDetails" className="text-gray-700 font-medium">Описание предлагаемого сотрудничества</label>
              <textarea
                id="partnershipDetails"
                name="partnershipDetails"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
                required
              ></textarea>
            </div>

            <div className="flex items-start">
              <input
                id="privacy-partnership"
                name="privacy"
                type="checkbox"
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="privacy-partnership" className="text-sm text-gray-600">
                Я согласен с <a href="/privacy-policy" className="text-everliv-600 hover:underline">Политикой конфиденциальности</a> и даю разрешение на обработку моих персональных данных
              </label>
            </div>

            <Button 
              type="submit"
              className="bg-everliv-600 hover:bg-everliv-700 text-white" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactForm;
