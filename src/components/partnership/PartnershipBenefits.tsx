
import React from 'react';
import { Globe, Award, TrendingUp } from 'lucide-react';

const PartnershipBenefits = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Преимущества сотрудничества</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-50 p-8 rounded-xl">
          <Globe className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-3">Расширение возможностей</h3>
          <p className="text-gray-600">
            Предложите вашим клиентам передовые решения в области здравоохранения, использующие новейшие технологии искусственного интеллекта и научный подход.
          </p>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-xl">
          <Award className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-3">Повышение ценности услуг</h3>
          <p className="text-gray-600">
            Дополните ваши услуги инновационными инструментами и технологиями, которые помогут вашим клиентам достичь лучших результатов в здоровье и продолжительности жизни.
          </p>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-xl">
          <TrendingUp className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-3">Дополнительный доход</h3>
          <p className="text-gray-600">
            Привлекательные условия партнерской программы с комиссией до 30% и прозрачной системой выплат. Возможность построения пассивного дохода в долгосрочной перспективе.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnershipBenefits;
