
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, Building2, Users, CheckCircle } from 'lucide-react';

const PartnershipCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="p-6 border-t-4 border-primary">
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Handshake className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Для медицинских учреждений</h3>
          <p className="text-gray-600 mb-6">
            Интегрируйте наши решения в ваш медицинский центр и предлагайте пациентам передовые возможности для мониторинга и улучшения здоровья.
          </p>
          <ul className="text-left w-full mb-6">
            <li className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Доступ к платформе анализа биомаркеров</span>
            </li>
            <li className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Интеграция с медицинской информационной системой</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Обучение персонала и техническая поддержка</span>
            </li>
          </ul>
          <Button className="w-full">Узнать подробнее</Button>
        </CardContent>
      </Card>
      
      <Card className="p-6 border-t-4 border-primary">
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Для корпоративных клиентов</h3>
          <p className="text-gray-600 mb-6">
            Оздоровительные программы для сотрудников и корпоративные решения для улучшения здоровья и производительности вашего коллектива.
          </p>
          <ul className="text-left w-full mb-6">
            <li className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Групповые программы мониторинга здоровья</span>
            </li>
            <li className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Аналитика здоровья на уровне организации</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Корпоративные тарифы и индивидуальные условия</span>
            </li>
          </ul>
          <Button className="w-full">Узнать подробнее</Button>
        </CardContent>
      </Card>
      
      <Card className="p-6 border-t-4 border-primary">
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Для медицинских специалистов</h3>
          <p className="text-gray-600 mb-6">
            Расширьте ваши возможности с помощью нашей платформы и технологий искусственного интеллекта для лучшей диагностики и лечения.
          </p>
          <ul className="text-left w-full mb-6">
            <li className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Инструменты AI-анализа результатов обследований</span>
            </li>
            <li className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Персонализированные протоколы для пациентов</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
              <span>Реферальная система и комиссионные</span>
            </li>
          </ul>
          <Button className="w-full">Узнать подробнее</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnershipCards;
