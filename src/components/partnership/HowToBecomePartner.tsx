
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight } from 'lucide-react';

const HowToBecomePartner = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Как стать партнером EVERLIV?</h2>
      
      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Заполните партнерскую анкету</h3>
            <p className="text-gray-600">Расскажите о своей организации или профессиональном опыте и целях сотрудничества</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Пройдите интервью с менеджером</h3>
            <p className="text-gray-600">Обсудите детали сотрудничества и выберите оптимальную модель партнерства</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Подпишите партнерское соглашение</h3>
            <p className="text-gray-600">Формализуйте сотрудничество и получите доступ к партнерским материалам и инструментам</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">4</div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Начните зарабатывать</h3>
            <p className="text-gray-600">Получайте комиссию с каждой успешной сделки и расширяйте свой доход с ростом клиентской базы</p>
          </div>
        </div>
      </div>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Скачать презентацию
        </Button>
        <Button size="lg" variant="outline" className="flex items-center gap-2">
          Связаться с нами
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HowToBecomePartner;
