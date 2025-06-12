
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Bug } from "lucide-react";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Сообщение успешно отправлено! Спасибо за обратную связь.");
      setIsSubmitting(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
      setRating(0);
    }, 1500);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Пожалуйста, выберите оценку");
      return;
    }
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success(`Спасибо за оценку ${rating}/10! Ваше мнение важно для нас.`);
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
      setRating(0);
    }, 1000);
  };
  
  return (
    <div>
      <Tabs defaultValue="rating" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rating" className="flex items-center gap-2">
            <Star className="h-4 w-4" /> 
            Оценить приложение
          </TabsTrigger>
          <TabsTrigger value="bug" className="flex items-center gap-2">
            <Bug className="h-4 w-4" /> 
            Сообщить о проблеме
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rating">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Оцените наше приложение</h2>
            <p className="text-gray-600 mb-6">Ваша оценка поможет нам улучшить сервис</p>
            
            <form onSubmit={handleRatingSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-gray-700 font-medium">Оценка по 10-балльной шкале</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className={`
                        w-10 h-10 rounded-full border-2 font-medium transition-all
                        ${(hoveredRating >= value || rating >= value)
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                        }
                      `}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600">
                    Ваша оценка: {rating}/10
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="ratingComment" className="text-gray-700 font-medium">
                  Комментарий (необязательно)
                </label>
                <textarea
                  id="ratingComment"
                  name="ratingComment"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Расскажите, что вам нравится или что можно улучшить"
                ></textarea>
              </div>

              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "Отправка..." : "Отправить оценку"}
              </Button>
            </form>
          </div>
        </TabsContent>
        
        <TabsContent value="bug">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Сообщить о проблеме</h2>
            <p className="text-gray-600 mb-6">Опишите проблему или баг, который вы обнаружили</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="userName" className="text-gray-700 font-medium">Ваше имя</label>
                  <Input
                    id="userName"
                    name="userName"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="userEmail" className="text-gray-700 font-medium">Email</label>
                  <Input
                    id="userEmail"
                    name="userEmail"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="problemType" className="text-gray-700 font-medium">Тип проблемы</label>
                <select
                  id="problemType"
                  name="problemType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Выберите тип проблемы</option>
                  <option value="bug">Баг в приложении</option>
                  <option value="performance">Проблемы с производительностью</option>
                  <option value="ui">Проблемы с интерфейсом</option>
                  <option value="data">Проблемы с данными</option>
                  <option value="payment">Проблемы с оплатой</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="problemDescription" className="text-gray-700 font-medium">Описание проблемы</label>
                <textarea
                  id="problemDescription"
                  name="problemDescription"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Подробно опишите проблему: что произошло, что вы ожидали, шаги для воспроизведения"
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label htmlFor="browserInfo" className="text-gray-700 font-medium">Дополнительная информация</label>
                <textarea
                  id="browserInfo"
                  name="browserInfo"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Браузер, устройство, время возникновения проблемы"
                ></textarea>
              </div>

              <Button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Сообщить о проблеме"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactForm;
