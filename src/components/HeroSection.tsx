
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, BarChart3, Stethoscope, BookOpen, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200">
                <Sparkles className="h-4 w-4" />
                Персонализированное здравоохранение с ИИ
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Ваше здоровье в 
                <span className="text-emerald-600"> надежных руках</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Искусственный интеллект для анализа здоровья, персональные рекомендации 
                и научно обоснованные протоколы для достижения оптимального самочувствия
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                  Начать бесплатно
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/90 backdrop-blur-sm border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-medium shadow-sm"
                >
                  Панель управления
                </Button>
              </Link>
            </div>

            {/* Features row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Анализ данных</h3>
                  <p className="text-sm text-gray-600">ИИ-анализ биомаркеров</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">ИИ-доктор</h3>
                  <p className="text-sm text-gray-600">24/7 консультации</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">База знаний</h3>
                  <p className="text-sm text-gray-600">Научные материалы</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 border border-gray-200 shadow-xl">
              {/* Mock dashboard preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-emerald-300 rounded animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg mb-2"></div>
                    <div className="w-20 h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-2 bg-gray-100 rounded"></div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg mb-2"></div>
                    <div className="w-20 h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-24 h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-gray-100 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                    <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
