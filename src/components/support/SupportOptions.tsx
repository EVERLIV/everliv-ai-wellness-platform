
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, Book, HelpCircle } from "lucide-react";

const SupportOptions: React.FC = () => {
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
  );
};

export default SupportOptions;
