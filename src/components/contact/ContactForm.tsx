
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Bug } from "lucide-react";
import { useSupportRequests } from "@/hooks/useSupportRequests";

const ContactForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { createSupportRequest } = useSupportRequests();
  
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    if (rating === 0) {
      return;
    }

    const requestData = {
      user_name: formData.get('ratingName') as string || 'Анонимный пользователь',
      user_email: formData.get('ratingEmail') as string || 'no-email@example.com',
      subject: `Оценка приложения: ${rating}/10`,
      message: formData.get('ratingComment') as string || `Пользователь поставил оценку ${rating}/10`,
      request_type: 'rating' as const,
      rating: rating,
      rating_comment: formData.get('ratingComment') as string,
    };

    await createSupportRequest.mutateAsync(requestData);
    (e.target as HTMLFormElement).reset();
    setRating(0);
  };

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const requestData = {
      user_name: formData.get('userName') as string,
      user_email: formData.get('userEmail') as string,
      subject: formData.get('problemType') as string,
      message: formData.get('problemDescription') as string,
      request_type: 'bug' as const,
      problem_type: formData.get('problemType') as string,
      browser_info: formData.get('browserInfo') as string,
    };

    await createSupportRequest.mutateAsync(requestData);
    (e.target as HTMLFormElement).reset();
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="ratingName" className="text-gray-700 font-medium">Ваше имя</label>
                  <Input
                    id="ratingName"
                    name="ratingName"
                    type="text"
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="ratingEmail" className="text-gray-700 font-medium">Email</label>
                  <Input
                    id="ratingEmail"
                    name="ratingEmail"
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

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
                disabled={createSupportRequest.isPending || rating === 0}
              >
                {createSupportRequest.isPending ? "Отправка..." : "Отправить оценку"}
              </Button>
            </form>
          </div>
        </TabsContent>
        
        <TabsContent value="bug">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Сообщить о проблеме</h2>
            <p className="text-gray-600 mb-6">Опишите проблему или баг, который вы обнаружили</p>
            
            <form onSubmit={handleBugSubmit} className="space-y-6">
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
                disabled={createSupportRequest.isPending}
              >
                {createSupportRequest.isPending ? "Отправка..." : "Сообщить о проблеме"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactForm;
