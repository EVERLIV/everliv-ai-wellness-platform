
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SupportFAQ: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Часто задаваемые вопросы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Как отменить подписку?</h4>
            <p className="text-sm text-gray-600">
              Вы можете отменить подписку в разделе "Оплата" в настройках аккаунта.
            </p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Как изменить план подписки?</h4>
            <p className="text-sm text-gray-600">
              Перейдите в раздел "Цены" и выберите новый план. Изменения вступят в силу немедленно.
            </p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Безопасны ли мои данные?</h4>
            <p className="text-sm text-gray-600">
              Да, мы используем современные методы шифрования и соблюдаем все требования по защите персональных данных.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/faq')}
            className="w-full"
          >
            Посмотреть все вопросы
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportFAQ;
