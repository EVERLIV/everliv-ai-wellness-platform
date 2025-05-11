
import React from 'react';
import { Shield, LockKeyhole, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DataProtectionSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Защита ваших данных</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Мы применяем самые современные технологии шифрования и строгие протоколы безопасности для защиты ваших данных
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="mb-4 flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Защита данных</h3>
            <p className="text-gray-600 text-center">
              Все ваши данные защищены современными методами шифрования и хранятся на серверах с высоким уровнем безопасности
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="mb-4 flex justify-center">
              <LockKeyhole className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Конфиденциальность</h3>
            <p className="text-gray-600 text-center">
              Мы никогда не передаем ваши личные данные третьим лицам и соблюдаем строгие правила конфиденциальности
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="mb-4 flex justify-center">
              <Eye className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Прозрачность</h3>
            <p className="text-gray-600 text-center">
              У вас всегда есть полный контроль и доступ к вашим данным, а также возможность запросить их удаление в любой момент
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/privacy">
            <Button variant="outline" className="rounded-full">
              Подробнее о политике конфиденциальности
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DataProtectionSection;
