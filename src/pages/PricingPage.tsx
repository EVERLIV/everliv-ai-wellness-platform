import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Star, Zap, Shield, Headphones } from "lucide-react";

const PricingPage = () => {
  const plans = [
    {
      name: "Базовый",
      price: "Бесплатно",
      period: "",
      description: "Основные функции для начала работы",
      current: true,
      features: [
        "Базовый профиль здоровья",
        "Простые метрики",
        "5 рекомендаций в месяц",
        "Базовая поддержка"
      ],
      limitations: [
        "Ограниченная аналитика",
        "Нет ИИ-консультаций"
      ]
    },
    {
      name: "Премиум",
      price: "1,990",
      period: "₽/месяц",
      description: "Расширенные возможности для активных пользователей",
      popular: true,
      features: [
        "Полный профиль здоровья",
        "Расширенные метрики",
        "Неограниченные рекомендации",
        "ИИ-врач (50 консультаций/мес)",
        "Детальная аналитика",
        "Приоритетная поддержка",
        "Экспорт данных"
      ]
    },
    {
      name: "Про",
      price: "3,990",
      period: "₽/месяц",
      description: "Максимальные возможности для профессионалов",
      features: [
        "Все возможности Премиум",
        "Неограниченные ИИ-консультации",
        "Продвинутая аналитика",
        "Интеграция с устройствами",
        "Персональный менеджер",
        "API доступ",
        "Белый лейбл",
        "Корпоративная поддержка 24/7"
      ]
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Выберите подходящий план</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Получите доступ к полному функционалу EverliveAI и улучшите своё здоровье с помощью ИИ
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} ${plan.current ? 'border-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Популярный
                  </Badge>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Текущий план
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations?.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-3 opacity-60">
                      <span className="h-4 w-4 text-gray-400 flex-shrink-0">✗</span>
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  {plan.current ? (
                    <Button className="w-full" disabled>
                      Текущий план
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Выбрать план
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Часто задаваемые вопросы</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-medium mb-2">Можно ли изменить план?</h4>
              <p className="text-sm text-muted-foreground">
                Да, вы можете изменить или отменить подписку в любое время в настройках аккаунта.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Есть ли пробный период?</h4>
              <p className="text-sm text-muted-foreground">
                Мы предлагаем 7-дневный бесплатный пробный период для всех платных планов.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Безопасны ли мои данные?</h4>
              <p className="text-sm text-muted-foreground">
                Мы используем шифрование банковского уровня и соблюдаем все стандарты безопасности.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Техническая поддержка</h4>
              <p className="text-sm text-muted-foreground">
                Все пользователи получают поддержку, а премиум-клиенты - приоритетную поддержку 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PricingPage;