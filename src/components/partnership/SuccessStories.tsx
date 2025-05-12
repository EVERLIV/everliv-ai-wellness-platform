
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SuccessStories = () => {
  return (
    <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12 rounded-2xl text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Успешные истории партнеров</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Клиника "МедЭксперт"</h3>
            <p className="text-gray-700 mb-4">
              "После интеграции с EVERLIV мы увеличили приток новых пациентов на 35% и расширили спектр услуг без дополнительных затрат на персонал."
            </p>
            <p className="font-medium text-primary">Директор клиники</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">ООО "ЗдоровьеПлюс"</h3>
            <p className="text-gray-700 mb-4">
              "Партнерство с EVERLIV позволило нам предложить корпоративным клиентам инновационные программы заботы о здоровье, что привлекло крупных заказчиков."
            </p>
            <p className="font-medium text-primary">Генеральный директор</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Др. Анна Соколова</h3>
            <p className="text-gray-700 mb-4">
              "Как врач-эндокринолог, я получила дополнительный инструмент для диагностики и мониторинга пациентов, а также стабильный дополнительный доход."
            </p>
            <p className="font-medium text-primary">Врач-эндокринолог</p>
          </CardContent>
        </Card>
      </div>
      
      <Button size="lg">Присоединиться к успешным партнерам</Button>
    </div>
  );
};

export default SuccessStories;
