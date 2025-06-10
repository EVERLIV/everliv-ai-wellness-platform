
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info, Shield, BookOpen } from "lucide-react";

const MedicalDataDisclaimer = () => {
  return (
    <Card className="border-blue-200 bg-blue-50/50 mb-8">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">О качестве медицинских данных</h3>
              <p className="text-blue-800 leading-relaxed">
                Данные основаны на рекомендациях ВОЗ, ESC/EAS, Российских клинических рекомендациях 
                и других авторитетных медицинских источников 2023-2024 годов.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Расширенная база данных</h4>
                  <p className="text-sm text-blue-700">
                    Значительно расширенная база биомаркеров с оптимальными диапазонами, 
                    возрастными группами и подкатегориями
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Актуальные референсы</h4>
                  <p className="text-sm text-blue-700">
                    Референсные значения на основе последних медицинских рекомендаций 
                    с учетом пола, возраста и статуса показателей
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Ключевые улучшения:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Детальная клиническая значимость каждого показателя</li>
                <li>• Источники и методы исследования для каждого биомаркера</li>
                <li>• Утилиты для анализа с учетом индивидуальных особенностей</li>
                <li>• Расширенная структура данных с подкатегориями</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalDataDisclaimer;
