
import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import { CheckCircle } from 'lucide-react';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const OxygenTherapy = () => {
  const benefits = [
    "Повышение энергетического метаболизма",
    "Ускорение восстановления после тренировок",
    "Улучшение когнитивных функций",
    "Снижение воспаления",
    "Активация иммунной системы",
    "Улучшение качества сна",
    "Поддержка митохондриальной функции"
  ];

  const methods = [
    {
      name: "Гипербарическая оксигенация (HBOT)",
      description: "Дыхание 100% кислородом в барокамере под повышенным давлением",
      suitable: "Для комплексной терапии и восстановления после травм"
    },
    {
      name: "Нормобарическая оксигенация",
      description: "Дыхание воздухом с повышенным содержанием кислорода при нормальном атмосферном давлении",
      suitable: "Для повышения энергии и восстановления после нагрузок"
    },
    {
      name: "Интервальная гипоксия-гипероксия (IHHT)",
      description: "Чередование дыхания воздухом со сниженным и повышенным содержанием кислорода",
      suitable: "Для тренировки адаптационных систем организма"
    },
    {
      name: "Озонотерапия",
      description: "Применение озоно-кислородной смеси различными способами",
      suitable: "Для иммуномодуляции и борьбы с хроническими воспалениями"
    },
    {
      name: "Аутогемотерапия с озоном",
      description: "Обработка небольшого количества крови озоном и возвращение в кровоток",
      suitable: "Для комплексного воздействия на иммунную и кровеносную системы"
    }
  ];

  const research = [
    {
      title: "Гипербарическая оксигенация улучшает когнитивные функции у пожилых людей",
      authors: "Шапира Н., Эфрати С., Ашери А. и др.",
      year: 2022,
      journal: "Aging",
      summary: "Исследование показало, что курс из 60 сеансов HBOT значительно улучшает когнитивные способности и церебральный кровоток у здоровых взрослых старше 65 лет."
    },
    {
      title: "Интервальная гипоксически-гипероксическая тренировка в спортивной медицине",
      authors: "Андреева А., Смирнов В., Иванов К.",
      year: 2021,
      journal: "Journal of Sports Medicine",
      summary: "15 сеансов IHHT улучшают аэробную производительность, снижают лактат крови и ускоряют восстановление после интенсивных тренировок у профессиональных спортсменов."
    },
    {
      title: "Озонотерапия снижает маркеры воспаления при хронических воспалительных заболеваниях",
      authors: "Мартинес М., Борелли Е., и др.",
      year: 2020,
      journal: "International Immunopharmacology",
      summary: "Системная озонотерапия снижает уровни провоспалительных цитокинов и C-реактивного белка у пациентов с хроническими воспалительными заболеваниями."
    }
  ];

  return (
    <ServicePageLayout
      title="Кислородная терапия"
      description="Инновационные методы оксигенации для повышения энергии, восстановления и профилактики заболеваний"
      imageSrc="/placeholder.svg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Преимущества кислородной терапии</h2>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Современные методы</h2>
          <div className="space-y-4">
            {methods.map((method, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{method.description}</p>
                <p className="text-xs text-blue-600 mt-2">Рекомендуется: {method.suitable}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Протоколы кислородной терапии</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ProtocolCard
          title="Базовый HBOT протокол"
          description="Курс гипербарической оксигенации для повышения энергии и восстановления"
          difficulty="beginner"
          duration="10 сеансов"
          category="кислородная терапия"
          steps={[
            "10 сеансов по 60-90 минут",
            "Давление 1.5-2.0 ATA",
            "100% медицинский кислород",
            "1-2 сеанса в неделю",
            "Предварительная консультация специалиста"
          ]}
          benefits={[
            "Повышение клеточной энергии",
            "Улучшение микроциркуляции",
            "Снижение общего воспаления",
            "Улучшение когнитивных функций"
          ]}
        />

        <ProtocolCard
          title="Интенсивный восстановительный протокол"
          description="Интенсивный курс HBOT для быстрого восстановления и регенерации тканей"
          difficulty="advanced"
          duration="20 сеансов"
          category="кислородная терапия"
          steps={[
            "20 сеансов по 90 минут",
            "Давление 2.0-2.4 ATA",
            "100% медицинский кислород",
            "5 сеансов в неделю (ежедневно)",
            "Контроль маркеров до и после курса",
            "Дополнительно: внутривенные инфузии антиоксидантов"
          ]}
          benefits={[
            "Активация стволовых клеток",
            "Усиление регенерации тканей",
            "Значительное снижение воспаления",
            "Нейрорегенерация"
          ]}
          warnings={[
            "Только под наблюдением специалиста",
            "Повышенный риск кислородной токсичности",
            "Необходим контроль антиоксидантного статуса"
          ]}
        />

        <ProtocolCard
          title="Домашний протокол EWOT"
          description="Exercise With Oxygen Therapy - физические упражнения с обогащенным кислородом"
          difficulty="intermediate"
          duration="8 недель"
          category="кислородная терапия"
          steps={[
            "3 тренировки в неделю по 15-30 минут",
            "Использование концентратора кислорода (90-95% O2)",
            "Интервальная тренировка средней интенсивности",
            "Дыхание через маску или носовую канюлю",
            "Постепенное повышение интенсивности"
          ]}
          benefits={[
            "Повышение аэробной производительности",
            "Ускоренное восстановление после тренировок",
            "Увеличение энергии в повседневной жизни",
            "Улучшение насыщения тканей кислородом"
          ]}
          warnings={[
            "Не рекомендуется людям с серьезными сердечно-легочными заболеваниями",
            "Необходима предварительная консультация"
          ]}
        />
      </div>

      <ScientificExplanation
        title="Научное обоснование"
        description="Современные исследования подтверждают эффективность различных методов кислородной терапии"
        research={research}
      />

      <div className="mt-12 bg-blue-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-3">Начните курс кислородной терапии</h3>
        <p className="text-gray-700 mb-4">
          Наши специалисты помогут подобрать оптимальный протокол кислородной терапии с учетом ваших индивидуальных особенностей и целей.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/dashboard/subscription">Записаться на консультацию</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/my-protocols">Изучить все протоколы</Link>
          </Button>
        </div>
      </div>
    </ServicePageLayout>
  );
};

export default OxygenTherapy;
