
import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import { CheckCircle } from 'lucide-react';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BreathingPractices = () => {
  const benefits = [
    "Улучшение кислородного обмена",
    "Снижение уровня стресса и тревожности",
    "Повышение концентрации внимания",
    "Нормализация артериального давления",
    "Улучшение качества сна",
    "Укрепление иммунной системы",
    "Стабилизация эмоционального состояния"
  ];

  const techniques = [
    {
      name: "Дыхание диафрагмой",
      description: "Базовая техника глубокого дыхания с использованием диафрагмы",
      difficulty: "легкая"
    },
    {
      name: "Альтернативное дыхание через ноздри",
      description: "Техника из йоги для балансировки энергии и успокоения ума",
      difficulty: "средняя"
    },
    {
      name: "Дыхание 4-7-8",
      description: "Вдох на 4 счета, задержка на 7, выдох на 8. Способствует расслаблению и засыпанию",
      difficulty: "легкая"
    },
    {
      name: "Холотропное дыхание",
      description: "Интенсивная техника для глубокого самоисследования и трансформации",
      difficulty: "сложная"
    },
    {
      name: "Дыхание по методу Вима Хофа",
      description: "Гипервентиляция с задержкой дыхания для повышения жизненных сил и иммунитета",
      difficulty: "средняя"
    }
  ];

  const research = [
    {
      title: "Влияние дыхательных практик на вариабельность сердечного ритма",
      authors: "Джонсон Л., Петров А., и др.",
      year: 2021,
      journal: "Журнал физиологии человека",
      summary: "Исследование показало, что регулярная практика глубокого дыхания в течение 8 недель значительно повышает вариабельность сердечного ритма, что свидетельствует о лучшей адаптации к стрессу."
    },
    {
      title: "Дыхательные техники как нефармакологический метод снижения артериального давления",
      authors: "Смит Т., Иванова Е., и др.",
      year: 2020,
      journal: "Международный журнал кардиологии",
      summary: "Медленное диафрагмальное дыхание (6 вдохов в минуту) в течение 15 минут ежедневно снижает систолическое артериальное давление на 8-10 мм рт.ст. у пациентов с мягкой гипертонией."
    },
    {
      title: "Нейрофизиологические механизмы воздействия дыхательных практик",
      authors: "Браун К., Чжао Л., и др.",
      year: 2019,
      journal: "Нейронаука и биоповеденческие обзоры",
      summary: "Дыхательные практики модулируют активность блуждающего нерва и воздействуют на лимбическую систему мозга, что объясняет их эффективность в снижении тревожности и повышении эмоциональной регуляции."
    }
  ];

  return (
    <ServicePageLayout
      title="Дыхательные практики"
      description="Научно обоснованные техники дыхания для улучшения здоровья, повышения энергии и снижения стресса"
      imageSrc="/placeholder.svg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Преимущества дыхательных практик</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Основные техники</h2>
          <div className="space-y-4">
            {techniques.map((technique, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold">{technique.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{technique.description}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block
                  ${technique.difficulty === "легкая" ? "bg-green-100 text-green-700" : 
                  technique.difficulty === "средняя" ? "bg-yellow-100 text-yellow-700" : 
                  "bg-red-100 text-red-700"}`}>
                  {technique.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Научно обоснованные протоколы</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ProtocolCard
          title="Протокол снижения стресса"
          description="5-минутная практика для быстрого снижения уровня стресса и тревожности"
          difficulty="beginner"
          duration="5 минут"
          category="дыхание"
          steps={[
            "Сядьте в удобное положение с прямой спиной",
            "Начните дышать через нос, считая до 4 на вдохе",
            "Задержите дыхание на 2 счета",
            "Медленно выдыхайте через рот, считая до 6",
            "Повторите цикл 10 раз"
          ]}
          benefits={[
            "Быстрое снижение уровня кортизола",
            "Активация парасимпатической нервной системы",
            "Снижение частоты сердечных сокращений"
          ]}
        />

        <ProtocolCard
          title="Энергетическое дыхание"
          description="Интенсивная практика для повышения энергии и концентрации внимания"
          difficulty="advanced"
          duration="15 минут"
          category="дыхание"
          steps={[
            "Сядьте в удобное положение с прямой спиной",
            "Сделайте 30 быстрых глубоких вдохов и выдохов через нос",
            "После последнего выдоха задержите дыхание на максимально возможное время",
            "Сделайте глубокий вдох и задержите дыхание на 15 секунд",
            "Повторите весь цикл 3 раза"
          ]}
          benefits={[
            "Повышение уровня энергии",
            "Улучшение концентрации внимания",
            "Увеличение устойчивости к стрессу",
            "Активация иммунной системы"
          ]}
          warnings={[
            "Не рекомендуется при гипертонии",
            "Не практиковать при беременности",
            "Возможно головокружение при первых практиках"
          ]}
        />

        <ProtocolCard
          title="Сон и расслабление"
          description="Вечерний протокол для улучшения качества сна и глубокого расслабления"
          difficulty="intermediate"
          duration="10 минут"
          category="дыхание"
          steps={[
            "Лягте на спину в удобное положение",
            "Вдыхайте через нос на 4 счета",
            "Задержите дыхание на 7 счетов",
            "Медленно выдыхайте через рот на 8 счетов",
            "Повторите цикл 6-8 раз",
            "Завершите практикой осознанного расслабления каждой части тела"
          ]}
          benefits={[
            "Снижение времени засыпания",
            "Улучшение качества сна",
            "Снижение тревожности перед сном",
            "Общее расслабление тела и ума"
          ]}
        />
      </div>

      <ScientificExplanation
        title="Научное обоснование эффективности"
        description="Современные исследования подтверждают многочисленные положительные эффекты дыхательных практик на физическое и психическое здоровье."
        research={research}
      />

      <div className="mt-12 bg-blue-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-3">Начните свой путь к осознанному дыханию</h3>
        <p className="text-gray-700 mb-4">
          Наши специалисты помогут вам подобрать оптимальный режим дыхательных практик с учетом ваших индивидуальных особенностей и целей.
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

export default BreathingPractices;
