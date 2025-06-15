
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Users, Shield, HeartHandshake } from "lucide-react";

const CorporatePricing = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Корпоративные решения</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Позаботьтесь о здоровье своих сотрудников с помощью специальных корпоративных тарифов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Building2 className="h-12 w-12 text-everliv-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Для компаний</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Специальные тарифы для организаций любого размера</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-everliv-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Массовое подключение</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Простое подключение всех сотрудников одновременно</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-everliv-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Защита данных</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Высокий уровень безопасности корпоративных данных</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <HeartHandshake className="h-12 w-12 text-everliv-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Поддержка 24/7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Персональный менеджер и приоритетная поддержка</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Свяжитесь с нами для обсуждения корпоративного тарифа</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Мы предложим индивидуальное решение, которое подойдет именно вашей компании
            </p>
            <Link to="/contact">
              <Button className="bg-everliv-600 hover:bg-everliv-700 text-white px-8 py-3">
                Связаться с нами
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CorporatePricing;
